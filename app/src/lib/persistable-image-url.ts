function readBlobFromUrl(blobUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", blobUrl);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response instanceof Blob) {
        resolve(xhr.response);
        return;
      }
      reject(new Error(`blob URL read failed: ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("blob URL read failed"));
    xhr.send();
  });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** blob URL을 localStorage에 보존 가능한 data URL로 변환 */
export async function persistableImageUrl(url: string | null | undefined): Promise<string> {
  if (!url?.trim()) return "";
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (!url.startsWith("blob:")) return url;

  try {
    const blob = await readBlobFromUrl(url);
    return await blobToDataUrl(blob);
  } catch {
    return "";
  }
}

export function revokePreviewUrlIfBlob(url: string | null | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
