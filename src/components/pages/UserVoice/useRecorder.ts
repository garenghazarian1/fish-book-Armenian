import { useRef, useState, useCallback } from "react";
import { saveRecording, getRecording, deleteRecording } from "@/utils/audioDB";

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const currentKey = useRef<string | null>(null);

  const startRecording = async (maxDuration = 6000, key = "") => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];
    currentKey.current = key;

    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);

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
    }
  }, []);

  return {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    resetRecording,
    setExternalURL,
  };
};
