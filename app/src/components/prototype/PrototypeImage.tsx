"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "design-system/utils";

interface PrototypeImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
}

/** export 전·실패 시 DS 톤 placeholder */
export function PrototypeImage({
  src,
  alt,
  className,
  imageClassName,
  sizes,
  priority,
}: PrototypeImageProps) {
  const [failed, setFailed] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    setFailed(false);
    return () => {
      mountedRef.current = false;
    };
  }, [src]);

  const handleError = useCallback(() => {
    queueMicrotask(() => {
      if (mountedRef.current) setFailed(true);
    });
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {failed ? (
        <div
          className="absolute inset-0 bg-gradient-to-br from-muted to-muted-strong"
          role="img"
          aria-label={alt}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
          onError={handleError}
        />
      )}
    </div>
  );
}
