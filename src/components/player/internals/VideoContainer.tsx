import { PointerEvent, useCallback, useEffect, useRef } from "react";

import { makeVideoElementDisplayInterface } from "@/components/player/display/base";
import { playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

// initialize display interface
function useDisplayInterface() {
  const display = usePlayerStore((s) => s.display);
  const setDisplay = usePlayerStore((s) => s.setDisplay);

  useEffect(() => {
    if (!display) {
      setDisplay(makeVideoElementDisplayInterface());
    }
  }, [display, setDisplay]);
}

function useShouldShowVideoElement() {
  const status = usePlayerStore((s) => s.status);

  if (status !== playerStatus.PLAYING) return false;
  return true;
}

function VideoElement() {
  const videoEl = useRef<HTMLVideoElement>(null);
  const display = usePlayerStore((s) => s.display);
  const isPaused = usePlayerStore((s) => s.mediaPlaying.isPaused);

  const toggleFullscreen = useCallback(() => {
    display?.toggleFullscreen();
  }, [display]);

  const togglePause = useCallback(
    (e: PointerEvent<HTMLVideoElement>) => {
      if (e.pointerType !== "mouse") return;
      if (isPaused) display?.play();
      else display?.pause();
    },
    [display, isPaused]
  );

  // report video element to display interface
  useEffect(() => {
    if (display && videoEl.current) {
      display.processVideoElement(videoEl.current);
    }
  }, [display, videoEl]);

  return (
    <video
      className="w-full h-screen bg-black"
      autoPlay
      ref={videoEl}
      onDoubleClick={toggleFullscreen}
      onPointerUp={togglePause}
    />
  );
}

export function VideoContainer() {
  const show = useShouldShowVideoElement();
  useDisplayInterface();

  if (!show) return null;
  return <VideoElement />;
}
