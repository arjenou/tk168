/** 360° 全景上传：服务端压缩后写入 R2（依赖 Cloudflare Images binding）。 */

export const PANORAMA_MAX_WIDTH = 4096;
export const PANORAMA_JPEG_QUALITY = 82;
/** 原始上传上限（压缩前） */
export const PANORAMA_MAX_UPLOAD_BYTES = 48 * 1024 * 1024;
/** Cloudflare Images：单边 ≤12000px，面积 ≤100MP */
const IMAGES_MAX_DIMENSION = 12000;
const IMAGES_MAX_MEGAPIXELS = 100_000_000;

function makeApiError(code, status, apiMessage) {
  const err = new Error(code);
  err.status = status;
  err.apiMessage = apiMessage;
  return err;
}

function mapImagesFailure(detail) {
  const text = String(detail || "");
  if (/9413|100 megapixels|12000/i.test(text)) {
    return "全景图分辨率超过平台限制（单边 12000px 或 1 亿像素）。请先在 Insta360 Studio 导出为较小 JPG 再上传。";
  }
  if (/9422|usage limit|quota/i.test(text)) {
    return "Cloudflare Images 本月转换额度已用尽，请联系管理员升级或下月再试。";
  }
  if (/9412|9414|invalid|decode|corrupt/i.test(text)) {
    return "无法识别该图片文件，请确认是 JPG / PNG / WebP 全景图。";
  }
  if (text) return `全景图压缩失败：${text.slice(0, 160)}`;
  return "全景图压缩失败，请换一张 JPG 全景图后重试。";
}

function validateImageInfo(info) {
  if (!info?.width || !info?.height) return;
  const area = Number(info.width) * Number(info.height);
  if (info.width > IMAGES_MAX_DIMENSION || info.height > IMAGES_MAX_DIMENSION) {
    throw makeApiError(
      "panorama_dimensions_too_large",
      413,
      `图片尺寸 ${info.width}×${info.height} 超过单边 ${IMAGES_MAX_DIMENSION}px 上限，请先导出较小版本。`,
    );
  }
  if (area > IMAGES_MAX_MEGAPIXELS) {
    throw makeApiError(
      "panorama_dimensions_too_large",
      413,
      "图片像素总数超过 1 亿，请先导出较小版本。",
    );
  }
}

async function runImagesPipeline(env, input, { preWidth } = {}) {
  let pipeline = env.IMAGES.input(input);
  if (preWidth) {
    pipeline = pipeline.transform({ width: preWidth, fit: "scale-down" });
  }
  const imageResponse = (
    await pipeline
      .transform({ width: PANORAMA_MAX_WIDTH, fit: "scale-down" })
      .output({ format: "image/jpeg", quality: PANORAMA_JPEG_QUALITY })
  ).response();

  if (!imageResponse.ok) {
    const detail = await imageResponse.text().catch(() => "");
    throw new Error(`images_http_${imageResponse.status}:${detail}`);
  }

  const outBuffer = await imageResponse.arrayBuffer();
  if (!outBuffer?.byteLength) {
    throw new Error("empty_output");
  }
  return outBuffer;
}

/**
 * @param {File} file
 * @param {object} env
 * @returns {Promise<{ body: ArrayBuffer, contentType: string, ext: string, originalBytes: number, compressedBytes: number }>}
 */
export async function compressPanoramaFile(env, file) {
  const inputType = String(file.type || "").toLowerCase();
  if (!inputType.startsWith("image/")) {
    throw makeApiError("invalid_image_type", 400, "请上传 JPG / PNG / WebP 图片");
  }

  const buffer = await file.arrayBuffer();
  const originalBytes = buffer.byteLength;

  if (originalBytes > PANORAMA_MAX_UPLOAD_BYTES) {
    throw makeApiError(
      "panorama_too_large",
      413,
      `全景图超过 ${Math.round(PANORAMA_MAX_UPLOAD_BYTES / 1024 / 1024)}MB，请先在 Insta360 Studio 等工具导出较小文件`,
    );
  }

  if (!env.IMAGES?.input) {
    throw makeApiError(
      "panorama_compress_unavailable",
      503,
      "服务器未启用图片压缩（Images binding），请联系管理员配置 Worker",
    );
  }

  let info = null;
  try {
    info = await env.IMAGES.info(buffer);
    validateImageInfo(info);
  } catch (cause) {
    if (cause?.status) throw cause;
    console.warn("panorama_info_skip", cause);
  }

  const needsPreShrink =
    info &&
    (info.width > 10000 || info.height > 10000 || Number(info.width) * Number(info.height) > 90_000_000);

  try {
    const stream = typeof file.stream === "function" ? file.stream() : buffer;
    const outBuffer = await runImagesPipeline(env, stream, {
      preWidth: needsPreShrink ? 8000 : undefined,
    });

    return {
      body: outBuffer,
      contentType: "image/jpeg",
      ext: "jpg",
      originalBytes,
      compressedBytes: outBuffer.byteLength,
    };
  } catch (cause) {
    if (cause?.status) throw cause;
    console.error("panorama_compress_failed", cause);

    // 已是较小 JPEG 时降级为原图入库，避免 Images 偶发失败导致无法上传
    if (originalBytes <= 6 * 1024 * 1024 && /jpe?g/.test(inputType)) {
      return {
        body: buffer,
        contentType: "image/jpeg",
        ext: "jpg",
        originalBytes,
        compressedBytes: originalBytes,
      };
    }

    throw makeApiError(
      "panorama_compress_failed",
      422,
      mapImagesFailure(cause?.message),
    );
  }
}
