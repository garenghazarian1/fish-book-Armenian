import { useRef, useState, useCallback, useEffect } from "react";
import { saveRecording, getRecording, deleteRecording } from "@/utils/audioDB";

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const currentKey = useRef<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hadGesture = useRef(false); // ✅ iOS fix

  // ✅ Initialize audio with iOS-friendly playsinline attribute
  useEffect(() => {
    const audio = new Audio();
    audio.setAttribute("playsinline", "true"); // ✅ Safe way for iOS autoplay
    audioRef.current = audio;
  }, []);

  const startRecording = async (maxDuration = 6000, key = "") => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];
    currentKey.current = key;

    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(audioChunks.current, {
        type: "audio/ogg; codecs=opus",
      });

      const url = URL.createObjectURL(blob);
      setAudioURL(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load(); // ✅ buffer for iOS
      }

      if (key) {
        await saveRecording(key, blob);
      }
    };

    mediaRecorder.current.start();
    setIsRecording(true);

    setTimeout(() => {
      if (mediaRecorder.current?.state === "recording") {
        mediaRecorder.current.stop();
        setIsRecording(false);
      }
    }, maxDuration);
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
    hadGesture.current = true;

    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = audioURL;
      audioRef.current.load(); // ✅ ensure ready for iOS
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
