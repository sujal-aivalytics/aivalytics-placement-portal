'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  prompt: string;
  duration: number; // in seconds
  onSubmit: (audioBlob: Blob, duration: number) => void;
  isSubmitting?: boolean;
}

export function VoiceRecorder({ prompt, duration, onSubmit, isSubmitting = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= duration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            if (prev >= duration) {
              stopRecording();
              return prev;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL('');
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = () => {
    if (audioBlob) {
      onSubmit(audioBlob, recordingTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return (recordingTime / duration) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Prompt Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-2xl">Voice Assessment Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-6 rounded-lg border border-purple-200">
            <p className="text-lg text-gray-800 leading-relaxed">{prompt}</p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Maximum duration: {formatTime(duration)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recorder Card */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Recorder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Visualizer */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`
                w-32 h-32 rounded-full flex items-center justify-center
                ${isRecording && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-purple-500'}
                transition-all
              `}>
                <Mic className="w-16 h-16 text-white" />
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {formatTime(recordingTime)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {isRecording ? (isPaused ? 'Paused' : 'Recording...') : audioBlob ? 'Recording Complete' : 'Ready to Record'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0:00</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 justify-center">
            {!isRecording && !audioBlob && (
              <Button
                onClick={startRecording}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                size="lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  size="lg"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  onClick={stopRecording}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                  size="lg"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              </>
            )}

            {audioBlob && !isRecording && (
              <>
                <Button
                  onClick={togglePlayback}
                  variant="outline"
                  size="lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetRecording}
                  variant="outline"
                  size="lg"
                  disabled={isSubmitting}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Re-record
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  size="lg"
                  disabled={isSubmitting}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Recording'}
                </Button>
              </>
            )}
          </div>

          {/* Hidden Audio Element */}
          {audioURL && (
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Recording Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Speak clearly and at a moderate pace</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Ensure you&apos;re in a quiet environment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Use proper pronunciation and grammar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Organize your thoughts before speaking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Listen to your recording before submitting</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
