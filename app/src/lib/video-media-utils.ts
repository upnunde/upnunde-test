/** 초 단위 재생 시간 → `MM:SS` 또는 `HH:MM:SS` */
export function formatVideoDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  return `${pad(minutes)}:${pad(secs)}`;
}

export function loadVideoMetadata(url: string): Promise<{ duration: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => resolve({ duration: video.duration });
    video.onerror = () => reject(new Error("영상 메타데이터를 불러오지 못했습니다."));
    video.src = url;
  });
}

/** 영상 URL에서 지정 시점 프레임을 JPEG blob URL로 추출 */
export function captureVideoFrame(url: string, seekTime = 0.1): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    if (!url.startsWith("blob:") && !url.startsWith("data:")) {
      video.crossOrigin = "anonymous";
    }
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
    };

    video.onloadeddata = () => {
      const target = Number.isFinite(video.duration)
        ? Math.min(seekTime, Math.max(0, video.duration - 0.05))
        : seekTime;
      video.currentTime = target;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          reject(new Error("미리보기 이미지를 만들지 못했습니다."));
          return;
        }
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(
          (blob) => {
            cleanup();
            if (!blob) {
              reject(new Error("미리보기 이미지를 만들지 못했습니다."));
              return;
            }
            resolve(URL.createObjectURL(blob));
          },
          "image/jpeg",
          0.92,
        );
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("영상을 불러오지 못했습니다."));
    };

    video.src = url;
  });
}
