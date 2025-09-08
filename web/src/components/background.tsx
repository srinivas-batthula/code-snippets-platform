"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const getFileExtension = (url: string): string => {
  return url.split(".").pop()?.toLowerCase() || "";
};

const isVideo = (extension: string): boolean => {
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "m4v"];
  return videoExtensions.includes(extension);
};

const VideoWithPlaceholder = ({
  src,
  className,
  placeholder,
}: {
  src: string;
  className?: string;
  placeholder?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !placeholder) {
      console.warn("No placeholder provided for video");
    }
  }, [placeholder]);

  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      const handleCanPlay = () => {
        setVideoLoaded(true);
      };

      video.addEventListener("canplay", handleCanPlay);
      
      // Check if video is already ready
      if (video.readyState >= 3) {
        setVideoLoaded(true);
      }
      
      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [src]);

  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch(error => {
        console.warn("Video autoplay failed:", error);
      });
    }
  }, [videoLoaded]);

  return (
    <>
      {placeholder && (
        <Image
          src={placeholder}
          loading="eager"
          priority
          sizes="100vw"
          alt="Background placeholder"
          className={cn(className, { invisible: videoLoaded })}
          quality={100}
          fill
        />
      )}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        controls={false}
        preload="auto"
        className={cn(className, { invisible: !videoLoaded })}
      />
    </>
  );
};

export const Background = ({
  src,
  placeholder,
  classname = "",
}: {
  src: string;
  placeholder?: string;
  classname?: string;
}) => {
  const extension = getFileExtension(src);
  const isVideoFile = isVideo(extension);

  const baseClasses = "absolute bg-background left-0 top-0 w-full h-full object-cover rounded-[42px] md:rounded-[72px]";
  const combinedClassName = cn(baseClasses, classname);

  if (isVideoFile) {
    return (
      <VideoWithPlaceholder
        src={src}
        className={combinedClassName}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Image
      priority
      loading="eager"
      src={src}
      alt="Background"
      className={combinedClassName}
      sizes="100vw"
      fill
    />
  );
};