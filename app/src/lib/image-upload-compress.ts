/**
 * 썸네일·표정 등 클라이언트 이미지 업로드 압축.
 * 모바일 카메라 원본(고해상도)을 크롭 UI에 넣기 전·보내기 후 모두 적당한 크기로 줄인다.
 */

/** 크롭 UI에 로드하기 전 원본 — 긴 변 상한 */
export const IMAGE_SOURCE_MAX_EDGE_PX = 2048;

/** 크롭 결과물 — 9:16 @3x(약 270×480)보다 여유 있게 */
export const IMAGE_CROP_OUTPUT_MAX_EDGE_PX = 960;

export const IMAGE_UPLOAD_QUALITY = 0.85;

/** 이 바이트를 넘으면 품질을 단계적으로 낮춘다 */
export const IMAGE_UPLOAD_MAX_BYTES = 600_000;

const ENCODE_MIME_TYPES = ["image/webp", "image/jpeg"] as const;

export type CompressImageOptions = {
  maxEdgePx?: number;
  quality?: number;
  maxBytes?: number;
};

function loadImageFromBlob(source: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(source);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image decode failed"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });
}

async function encodeCanvasWithSizeBudget(
  canvas: HTMLCanvasElement,
  quality: number,
  maxBytes: number,
): Promise<Blob> {
  for (const mimeType of ENCODE_MIME_TYPES) {
    let q = quality;
    let lastBlob: Blob | null = null;
    while (q >= 0.5) {
      const blob = await canvasToBlob(canvas, mimeType, q);
      if (!blob) break;
      lastBlob = blob;
      if (blob.size <= maxBytes) return blob;
      q -= 0.1;
    }
    if (lastBlob) return lastBlob;
  }
  throw new Error("Canvas encode failed");
}

function scaleToMaxEdge(
  width: number,
  height: number,
  maxEdgePx: number,
): { width: number; height: number } {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxEdgePx) {
    return { width, height };
  }
  const scale = maxEdgePx / longEdge;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Blob·File을 디코딩한 뒤 리사이즈·압축한다 */
export async function compressImageBlob(
  source: Blob | File,
  options: CompressImageOptions = {},
): Promise<Blob> {
  const {
    maxEdgePx = IMAGE_SOURCE_MAX_EDGE_PX,
    quality = IMAGE_UPLOAD_QUALITY,
    maxBytes = IMAGE_UPLOAD_MAX_BYTES,
  } = options;

  const img = await loadImageFromBlob(source);
  const { width, height } = scaleToMaxEdge(img.naturalWidth, img.naturalHeight, maxEdgePx);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2d unavailable");
  ctx.drawImage(img, 0, 0, width, height);

  return encodeCanvasWithSizeBudget(canvas, quality, maxBytes);
}

/**
 * 파일 선택 직후 사용 — 이미 충분히 작으면 원본을 그대로 쓰고, 아니면 압축 blob URL을 반환한다.
 */
export async function createOptimizedImageObjectUrl(
  file: File,
  options?: CompressImageOptions,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Not an image file");
  }

  const maxEdgePx = options?.maxEdgePx ?? IMAGE_SOURCE_MAX_EDGE_PX;
  const maxBytes = options?.maxBytes ?? IMAGE_UPLOAD_MAX_BYTES;

  if (file.size <= maxBytes / 3) {
    try {
      const img = await loadImageFromBlob(file);
      if (Math.max(img.naturalWidth, img.naturalHeight) <= maxEdgePx) {
        return URL.createObjectURL(file);
      }
    } catch {
      // fall through to compress
    }
  }

  const blob = await compressImageBlob(file, options);
  return URL.createObjectURL(blob);
}

/** 크롭 캔버스 결과를 압축 blob으로보낸다 */
export async function encodeCroppedCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return encodeCanvasWithSizeBudget(canvas, IMAGE_UPLOAD_QUALITY, IMAGE_UPLOAD_MAX_BYTES);
}

export function scaleCropOutputDimensions(
  viewportW: number,
  viewportH: number,
  maxEdgePx: number = IMAGE_CROP_OUTPUT_MAX_EDGE_PX,
): { width: number; height: number } {
  return scaleToMaxEdge(viewportW, viewportH, maxEdgePx);
}
