/** 360° 全景上传：服务端压缩后写入 R2（依赖 Cloudflare Images binding）。 */

export const PANORAMA_MAX_WIDTH = 6144;
export const PANORAMA_JPEG_QUALITY = 82;
/** 原始上传上限（压缩前） */
export const PANORAMA_MAX_UPLOAD_BYTES = 48 * 1024 * 1024;

function makeApiError(code, status, apiMessage) {
  const err = new Error(code);
  err.status = status;
  err.apiMessage = apiMessage;
  return err;
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

  try {
    const imageResponse = (
      await env.IMAGES.input(buffer)
        .transform({ width: PANORAMA_MAX_WIDTH, fit: "scale-down" })
        .output({ format: "image/jpeg", quality: PANORAMA_JPEG_QUALITY })
    ).response();

    const outBuffer = await imageResponse.arrayBuffer();
    if (!outBuffer?.byteLength) {
      throw new Error("empty_output");
    }

    return {
      body: outBuffer,
      contentType: "image/jpeg",
      ext: "jpg",
      originalBytes,
      compressedBytes: outBuffer.byteLength,
    };
  } catch (cause) {
    console.error("panorama_compress_failed", cause);
    throw makeApiError(
      "panorama_compress_failed",
      422,
      "全景图压缩失败，请确认是 2:1 全景 JPG 后重试",
    );
  }
}
