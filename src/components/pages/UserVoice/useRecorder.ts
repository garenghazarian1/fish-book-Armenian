import { useRef, useState, useCallback, useEffect } from "react";
import { saveRecording, getRecording, deleteRecording } from "@/utils/audioDB";

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const currentKey = useRef<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hadGesture = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.setAttribute("playsinline", "true"); // iOS playback fix
    audioRef.current = audio;
  }, []);

  const startRecording = async (maxDuration = 6000, key = "") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const preferredMimeType = MediaRecorder.isTypeSupported(
        "audio/webm;codecs=opus"
      )
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, {
        mimeType: preferredMimeType,
      });
      mediaRecorder.current = recorder;
      audioChunks.current = [];
      currentKey.current = key;

      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
        console.log("Data chunk size:", e.data.size);
      };

      recorder.onstart = () => {
        console.log("Recording started");
      };

      recorder.onstop = () => {
        console.log("Recording stopped");
        const blob = new Blob(audioChunks.current, { type: preferredMimeType });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);

        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.load();
        }

        if (key) {
          saveRecording(key, blob); // Avoid await to prevent delay
        }

        // ✅ Stop mic access
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorder.current?.state === "recording") {
          mediaRecorder.current.stop();
          setIsRecording(false);
        }
      }, maxDuration);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = async () => {
    setAudioURL(null);
    setIsRecording(false);
    if (currentKey.current) {
      await deleteRecording(currentKey.current);
    }
  };

  const setExternalURL = useCallback(async (key: string) => {
    currentKey.current = key;
    const blob = await getRecording(key);
    if (blob) {
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
    }
  }, []);

  const playAudio = async () => {
    if (!audioRef.current || !audioURL) return;

    try {
      hadGesture.current = true;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = audioURL;
      audioRef.current.load();
      await audioRef.current.play();
    } catch (err) {
      console.warn("Playback failed:", err);
    }
  };

  const handleGesture = () => {
    hadGesture.current = true;
  };

  const setAudioURLPublic = (url: string | null) => {
    setAudioURL(url);
  };

  return {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    resetRecording,
    setExternalURL,
    playAudio,
    handleGesture,
    audioRef,
    setAudioURL: setAudioURLPublic,
  };
};
