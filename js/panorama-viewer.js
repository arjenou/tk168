(() => {
  const PI = Math.PI;
  const VERTEX_SHADER = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;
  const FRAGMENT_SHADER = `
    precision mediump float;
    uniform sampler2D u_texture;
    uniform vec2 u_yawPitch;
    uniform float u_fov;
    uniform float u_aspect;
    varying vec2 v_uv;

    const float PI = 3.14159265359;

    void main() {
      vec2 screen = v_uv * 2.0 - 1.0;
      screen.x *= u_aspect;
      float tanHalfFov = tan(u_fov * 0.5);
      vec3 dir = normalize(vec3(screen.x * tanHalfFov, -screen.y * tanHalfFov, -1.0));

      float cosPitch = cos(u_yawPitch.y);
      float sinPitch = sin(u_yawPitch.y);
      vec3 pitched = vec3(
        dir.x,
        cosPitch * dir.y - sinPitch * dir.z,
        sinPitch * dir.y + cosPitch * dir.z
      );

      float cosYaw = cos(u_yawPitch.x);
      float sinYaw = sin(u_yawPitch.x);
      vec3 world = vec3(
        cosYaw * pitched.x + sinYaw * pitched.z,
        pitched.y,
        -sinYaw * pitched.x + cosYaw * pitched.z
      );

      float lon = atan(world.x, world.z);
      float lat = asin(clamp(world.y, -1.0, 1.0));
      vec2 texCoord = vec2(lon / (2.0 * PI) + 0.5, 0.5 - lat / PI);
      gl_FragColor = texture2D(u_texture, texCoord);
    }
  `;

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || 'shader compile failed';
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function createProgram(gl) {
    const program = gl.createProgram();
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'program link failed');
    }
    return program;
  }

  class PanoramaViewer {
    constructor(container, options = {}) {
      this.container = container;
      this.imageSrc = options.imageSrc || '';
      this.ariaLabel = options.ariaLabel || '360° panorama';
      this.onReady = typeof options.onReady === 'function' ? options.onReady : null;
      this.onError = typeof options.onError === 'function' ? options.onError : null;
      this.yaw = options.yaw ?? 0;
      this.pitch = options.pitch ?? 0;
      this.fov = options.fov ?? (75 * PI / 180);
      this.dragging = false;
      this.lastX = 0;
      this.lastY = 0;
      this.destroyed = false;
      this.frameId = 0;

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'panorama-viewer-canvas';
      this.canvas.setAttribute('role', 'img');
      this.canvas.setAttribute('aria-label', this.ariaLabel);
      this.container.appendChild(this.canvas);

      this.gl = this.canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' });
      if (!this.gl) {
        throw new Error('WebGL is not available');
      }

      this.program = createProgram(this.gl);
      this.gl.useProgram(this.program);
      this.attribs = {
        position: this.gl.getAttribLocation(this.program, 'a_position')
      };
      this.uniforms = {
        texture: this.gl.getUniformLocation(this.program, 'u_texture'),
        yawPitch: this.gl.getUniformLocation(this.program, 'u_yawPitch'),
        fov: this.gl.getUniformLocation(this.program, 'u_fov'),
        aspect: this.gl.getUniformLocation(this.program, 'u_aspect')
      };

      const buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        this.gl.STATIC_DRAW
      );
      this.gl.enableVertexAttribArray(this.attribs.position);
      this.gl.vertexAttribPointer(this.attribs.position, 2, this.gl.FLOAT, false, 0, 0);

      this.texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

      this.image = new Image();
      this.image.decoding = 'async';
      this.image.crossOrigin = 'anonymous';
      this.image.addEventListener('load', () => this.handleImageLoad());
      this.image.addEventListener('error', () => this.handleImageError());

      this.onPointerDown = (event) => this.startDrag(event);
      this.onPointerMove = (event) => this.moveDrag(event);
      this.onPointerUp = () => this.endDrag();
      this.onResize = () => this.resize();
      this.canvas.addEventListener('pointerdown', this.onPointerDown);
      window.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('pointerup', this.onPointerUp);
      window.addEventListener('pointercancel', this.onPointerUp);
      window.addEventListener('resize', this.onResize);

      this.resize();
      this.image.src = this.imageSrc;
    }

    handleImageLoad() {
      if (this.destroyed) return;
      const { gl, image } = this;
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(this.uniforms.texture, 0);
      this.render();
      this.onReady?.();
    }

    handleImageError() {
      if (this.destroyed) return;
      this.onError?.(new Error('Failed to load panorama image'));
    }

    startDrag(event) {
      if (this.destroyed) return;
      this.dragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.canvas.setPointerCapture?.(event.pointerId);
      this.canvas.classList.add('is-dragging');
    }

    moveDrag(event) {
      if (!this.dragging || this.destroyed) return;
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.yaw += dx * 0.0045;
      this.pitch -= dy * 0.0045;
      const limit = PI * 0.47;
      this.pitch = Math.max(-limit, Math.min(limit, this.pitch));
      this.render();
    }

    endDrag() {
      this.dragging = false;
      this.canvas.classList.remove('is-dragging');
    }

    resize() {
      if (this.destroyed) return;
      const rect = this.container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (this.canvas.width === width && this.canvas.height === height) return;
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
      if (this.image.complete && this.image.naturalWidth > 0) {
        this.render();
      }
    }

    render() {
      if (this.destroyed || !this.image.complete) return;
      cancelAnimationFrame(this.frameId);
      this.frameId = requestAnimationFrame(() => {
        const { gl } = this;
        gl.clearColor(0.04, 0.05, 0.07, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(this.uniforms.yawPitch, this.yaw, this.pitch);
        gl.uniform1f(this.uniforms.fov, this.fov);
        gl.uniform1f(this.uniforms.aspect, this.canvas.width / this.canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });
    }

    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      cancelAnimationFrame(this.frameId);
      this.canvas.removeEventListener('pointerdown', this.onPointerDown);
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerup', this.onPointerUp);
      window.removeEventListener('pointercancel', this.onPointerUp);
      window.removeEventListener('resize', this.onResize);
      const loseContext = this.gl?.getExtension('WEBGL_lose_context');
      loseContext?.loseContext();
      this.canvas.remove();
    }
  }

  window.TK168PanoramaViewer = {
    create(container, options) {
      return new PanoramaViewer(container, options);
    }
  };
})();
