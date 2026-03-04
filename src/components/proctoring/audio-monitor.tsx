"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { toast } from "sonner";
import { processAudioChunk } from "@/app/actions/audio-proctoring";

interface AudioMonitorProps {
    testId: string;
    isActive: boolean;
    intervalSeconds?: number;
    onViolation?: (msg: string) => void;
}

export function AudioMonitor({ testId, isActive, intervalSeconds = 60, onViolation }: AudioMonitorProps) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        if (!isActive) return;

        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setHasPermission(true);

                const recorder = new MediaRecorder(stream);
                mediaRecorderRef.current = recorder;

                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunksRef.current.push(e.data);
                    }
                };

                recorder.onstop = async () => {
                    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                    chunksRef.current = []; // Clear for next batch
                    if (blob.size > 0) {
                        await sendAudioChunk(blob);
                    }
                };

                recorder.start();
                setIsRecording(true);

                // Restart recorder every 'intervalSeconds' to create a chunk
                intervalRef.current = setInterval(() => {
                    if (recorder.state === "recording") {
                        recorder.stop(); // Triggers onstop -> send -> start again
                        setTimeout(() => {
                            if (isActive && mediaRecorderRef.current?.state === "inactive") {
                                recorder.start();
                            }
                        }, 100); // Brief pause to ensure stop completes
                    }
                }, intervalSeconds * 1000);

            } catch (err) {
                console.error("Microphone denied:", err);
                setHasPermission(false);
                toast.error("Microphone access required for proctoring!");
                if (onViolation) onViolation("Microphone access denied");
            }
        };

        startRecording();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isActive, testId, intervalSeconds]);

    const sendAudioChunk = async (blob: Blob) => {
        const formData = new FormData();
        formData.append("audio", blob);

        try {
            const result = await processAudioChunk(formData, testId);
            if (result.success) {
                if (result.violation) {
                    toast.warning(`Audio Alert: ${result.violation}`);
                    if (onViolation) onViolation(result.violation);
                }
            } else {
                console.error("Audio analysis failed:", result.error);
            }
        } catch (e) {
            console.error("Error sending audio chunk", e);
        }
    };

    if (hasPermission === false) {
        return (
            <div className="fixed bottom-20 right-4 z-50 bg-red-100 border-2 border-red-500 rounded-lg p-3 shadow-xl flex items-center gap-3 animate-pulse">
                <MicOff className="w-6 h-6 text-red-600" />
                <span className="text-xs font-bold text-red-800">Mic Denied</span>
            </div>
        );
    }

    if (!isRecording) return null;

    return (
        <div className="fixed bottom-4 left-24 z-40 bg-black/40 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <Mic className="w-3 h-3 text-white/80" />
            <span className="text-[10px] text-white/70">Audio Active</span>
        </div>
    );
}
