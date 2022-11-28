import { forwardRef, useRef, useCallback, useEffect } from "react";

function prettyTime(s: number) {
  return (
    (s > 60
      ? Math.floor(s / 60)
          .toString()
          .padStart(2, "0") + ":"
      : "00:") +
    Math.round(s % 60)
      .toString()
      .padStart(2, "0")
  );
}

const K = () => {};

function Playable(
  { children, className = "", src, onPlay = K, onPause = K },
  inRef,
) {
  const btnRef = useRef<HTMLButtonElement>();
  const audioRef = useRef<HTMLAudioElement>();
  const statusRef = useRef<HTMLDivElement>();

  const playRef = useRef<HTMLImageElement>();
  const pauseRef = useRef<HTMLImageElement>();

  useEffect(() => {
    const aud = audioRef.current;
    if (aud) {
      const onSwitch = e => {
        const btn = btnRef.current;
        if (!aud.paused) {
          btn.classList.add("outline-pulse");
          playRef.current.style.display = "none";
          pauseRef.current.style.display = "inline";
        } else {
          btn.classList.remove("outline-pulse");
          playRef.current.style.display = "inline";
          pauseRef.current.style.display = "none";
        }
      };
      const onChange = e => {
        statusRef.current.textContent =
          prettyTime(aud.currentTime) + " / " + prettyTime(aud.duration);
      };
      aud.addEventListener("play", onSwitch, false);
      aud.addEventListener("playing", onSwitch, false);
      aud.addEventListener("pause", onSwitch, false);
      aud.addEventListener("durationchange", onChange, false);
      aud.addEventListener("loadedmetadata", onChange, false);
      aud.addEventListener("seeking", onChange, false);
      aud.addEventListener("timeupdate", onChange, false);
      return () => {
        aud.removeEventListener("play", onSwitch, false);
        aud.removeEventListener("playing", onSwitch, false);
        aud.removeEventListener("pause", onSwitch, false);
        aud.removeEventListener("durationchange", onChange, false);
        aud.removeEventListener("loadedmetadata", onChange, false);
        aud.removeEventListener("seeking", onChange, false);
        aud.removeEventListener("timeupdate", onChange, false);
      };
    }
  }, [audioRef.current]);

  const onClick = useCallback(e => {
    const n = audioRef.current;
    if (!n.paused) {
      n.pause();
      n.currentTime = 0;
    } else n.play();
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={className}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      {children}
      <audio
        ref={i => {
          audioRef.current = i;
          if (typeof inRef === "function") {
            inRef(i);
          } else inRef.current = i;
        }}
        src={src}
        preload="metadata"
        onPlay={onPlay}
        onPause={onPause}
        controlsList="nodownload nofullscreen"
      />
      <nav
        style={{
          padding: 4,
          background: "rgba(0 0 0/.15)",
          borderRadius: 9999,
          display: "inline-block",
          margin: "0 1ch",
        }}
      >
        <img
          src="assets/play.svg"
          ref={playRef}
          style={{ width: 20, display: "inline" }}
          alt="play"
        />
        <img
          src="assets/stop.svg"
          ref={pauseRef}
          style={{ width: 20, display: "none" }}
          alt="pause"
        />
      </nav>
      <span ref={statusRef}>00:00 / 00:00</span>
    </button>
  );
}

export default forwardRef(Playable);
