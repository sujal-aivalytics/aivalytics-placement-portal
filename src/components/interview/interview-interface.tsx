'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, RotateCcw, Play, Pause, Volume2, VolumeX, Square } from 'lucide-react';
import { generateQuestion } from '@/app/actions/interview';
import { InterviewContext } from '@/lib/interview-ai';
import { INTERVIEW_CONFIG, COMPANY_TYPES, INTERVIEW_TYPES } from '@/lib/interview-constants';
import { useSession } from 'next-auth/react';
import { speakWithKokoro, humanizeText, chunkTextForStreaming } from '@/lib/kokoro-tts';


// STT Interface extension for TypeScript
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

interface InterviewInterfaceProps {
  company: string;
  type: string;
}

export default function InterviewInterface({ company, type }: InterviewInterfaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<{ role: 'interviewer' | 'candidate' | 'user' | 'model'; content: string }[]>([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Audio State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const stopKokoroRef = useRef<(() => void) | null>(null);
  const isFirstQuestionRef = useRef<boolean>(true);



  // Initialize interview
  useEffect(() => {
    // DEV BYPASS: Commenting out login redirect to allow testing TTS without auth
    /*
    if (!session) {
      router.push('/login');
      return;
    }
    */


    // Initialize camera
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error accessing camera/microphone:', err);
        setIsLoading(false);
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [session, router]);

  // Handle TTS for new questions
  useEffect(() => {
    if (currentQuestion && interviewStarted && !interviewCompleted) {
      speak(currentQuestion);
    }
  }, [currentQuestion, interviewStarted]);


  // Text-to-Speech (TTS)
  const speak = async (text: string) => {
    // Stop any ongoing speech
    stopSpeaking();

    const isFirst = isFirstQuestionRef.current;
    isFirstQuestionRef.current = false;

    // Humanize the text before TTS
    const humanized = humanizeText(text, isFirst);
    const chunks = chunkTextForStreaming(humanized);

    setIsSpeaking(true);

    // Stream chunk by chunk for low latency
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      await new Promise<void>((resolve) => {
        speakWithKokoro(chunk, {
          voice: 'af_heart',
          speed: 0.93,
          onStart: () => setIsSpeaking(true),
          onEnd: () => resolve(),
          onError: () => resolve(),
        }).then((stopFn) => {
          stopKokoroRef.current = stopFn;
        });
      });
    }

    setIsSpeaking(false);
  };

  const stopSpeaking = () => {
    if (stopKokoroRef.current) {
      stopKokoroRef.current();
      stopKokoroRef.current = null;
    }
    // Also cancel browser TTS fallback
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };


  // Speech-to-Text (STT)
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const Recognition = webkitSpeechRecognition || SpeechRecognition;

    if (!Recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    // Stop speaking if AI is talking
    stopSpeaking();

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      // If we have a final result, append it. If we are editing, we might want to be careful.
      // For simplicity, we'll append final to current, but this might duplicate if not careful with state.
      // A safer approach for this simple UI: Just update with what we have + existing.
      // But since we want to show 'listening' live, let's just use the event data carefully.

      // Actually, standard behavior:
      // When resuming, we usually want to append. 
      // User might type, then speak.

      if (finalTranscript) {
        setUserAnswer(prev => {
          const separator = prev && !prev.endsWith(' ') ? ' ' : '';
          return prev + separator + finalTranscript;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };


  // Start interview
  const startInterview = async () => {
    // DEV BYPASS: Allowing start without session for TTS testing
    // if (!session?.user?.id) return;


    setIsInterviewActive(true);
    setInterviewStarted(true);
    isFirstQuestionRef.current = true;
    startTimeRef.current = Date.now();

    setIsProcessing(true); // Show loading while fetching first question

    try {
      // Get the first question from AI
      const context: InterviewContext = {
        interviewType: type,
        companyType: company,
        currentQuestionIndex: 0,
        previousQuestions: [],
        previousAnswers: [],
        conversationHistory: []
      };

      const response = await generateQuestion(context);
      setCurrentQuestion(response.question);
      setConversationHistory([
        { role: 'interviewer' as const, content: response.question }
      ]);
      setQuestionIndex(0);
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle user answer submission
  const submitAnswer = async () => {
    if (!userAnswer.trim() || isProcessing) return;

    setIsProcessing(true);
    stopSpeaking(); // Ensure AI stops speaking
    stopListening(); // Ensure mic stops listening


    // Add user answer to conversation history
    const updatedHistory = [...conversationHistory, { role: 'candidate' as const, content: userAnswer }];
    setConversationHistory(updatedHistory);

    // Prepare context for next question
    const context: InterviewContext = {
      interviewType: type,
      companyType: company,
      currentQuestionIndex: questionIndex + 1,
      previousQuestions: [...conversationHistory.filter(msg => msg.role === 'interviewer' || msg.role === 'model').map(msg => msg.content), currentQuestion],
      previousAnswers: [...conversationHistory.filter(msg => msg.role === 'candidate' || msg.role === 'user').map(msg => msg.content), userAnswer],
      conversationHistory: updatedHistory
    };

    try {
      // Get next question from AI
      const response = await generateQuestion(context);
      setCurrentQuestion(response.question);
      setConversationHistory([...updatedHistory, { role: 'interviewer' as const, content: response.question }]);
      setUserAnswer('');
      setQuestionIndex(questionIndex + 1);
    } catch (error) {
      console.error('Error getting next question:', error);
      setCurrentQuestion("I see you've provided a good answer. Let me ask you another question...");
      setUserAnswer('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsCameraOn(videoTracks[0].enabled);
      }
    }
  };

  // Toggle microphone (mute for video call, not STT)
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMicOn(audioTracks[0].enabled);
      }
    }
  };

  // Complete interview
  const completeInterview = async () => {
    setIsInterviewActive(false);
    stopSpeaking();
    stopListening();

    // Prepare data for submission
    const questions = conversationHistory
      .filter(msg => msg.role === 'interviewer' || msg.role === 'model')
      .map(msg => msg.content);

    const answers = conversationHistory
      .filter(msg => msg.role === 'candidate' || msg.role === 'user')
      .map(msg => msg.content);

    const transcript = conversationHistory
      .map(msg => `${msg.role === 'interviewer' || msg.role === 'model' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
      .join('\n');

    try {
      const response = await fetch('/api/interviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewType: type,
          companyType: company,
          questions,
          answers,
          transcript,
          duration: Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Interview submitted successfully:', result);
        setInterviewCompleted(true);
      } else {
        console.error('Error submitting interview:', response.statusText);
        setInterviewCompleted(true); // Still mark as completed but show error
      }
    } catch (error) {
      console.error('Error submitting interview:', error);
      setInterviewCompleted(true); // Still mark as completed but show error
    }
  };

  // Reset interview
  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewCompleted(false);
    setCurrentQuestion('');
    setUserAnswer('');
    setQuestionIndex(0);
    setConversationHistory([]);
    setIsInterviewActive(false);
    isFirstQuestionRef.current = true;
  };




  // Get interview config based on type
  const interviewConfig = INTERVIEW_CONFIG[type as keyof typeof INTERVIEW_CONFIG];
  const companyColor = company === COMPANY_TYPES.TCS ? 'bg-[#0067b1]' : 'bg-gradient-to-r from-[#E63312] to-[#88B04B]';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Initializing interview environment...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${companyColor} text-white p-6 rounded-2xl shadow-lg mb-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{interviewConfig?.title}</h1>
              <p className="opacity-90">{company} Interview Simulation</p>
            </div>
            <div className="flex gap-2 items-center">
              {interviewStarted && !interviewCompleted && (
                <>
                  <Button
                    onClick={() => setShowConfirmDialog(true)}
                    variant="secondary"
                    className="bg-red-500/20 text-white hover:bg-red-500/40 border-0"
                    size="sm"
                  >
                    Finish Interview
                  </Button>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Question {questionIndex + 1}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {interviewCompleted ? (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Interview Completed!</h2>
              <p className="text-gray-600 mb-8">
                Thank you for completing the {company} {interviewConfig?.title}. Your responses have been recorded.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => router.push('/dashboard/interview-suite/history')}
                  className={`${companyColor.replace('bg-', 'bg-')} hover:opacity-90 text-white`}
                >
                  View Results
                </Button>
                <Button
                  variant="outline"
                  onClick={resetInterview}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !interviewStarted ? (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Interview Preparation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Camera Preview */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Camera Preview</h3>
                  <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden border-2 border-gray-300">
                    {isCameraOn ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <VideoOff className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <button
                        onClick={toggleCamera}
                        className={`p-2 rounded-full ${isCameraOn ? 'bg-red-500' : 'bg-gray-500'} text-white`}
                      >
                        {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={toggleMic}
                        className={`p-2 rounded-full ${isMicOn ? 'bg-red-500' : 'bg-gray-500'} text-white`}
                      >
                        {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interview Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Interview Details</h3>
                    <div className="text-left bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">Company:</span> {company}</p>
                      <p><span className="font-medium">Type:</span> {interviewConfig?.title}</p>
                      <p><span className="font-medium">Duration:</span> ~{interviewConfig?.duration} minutes</p>
                      <p><span className="font-medium">Format:</span> AI-powered virtual interview</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
                    <ul className="text-left text-sm text-gray-600 space-y-1">
                      <li>• Ensure good lighting and clear audio</li>
                      <li>• Look at the camera when speaking</li>
                      <li>• Answer questions clearly and confidently</li>
                      <li>• You will be interviewed by our AI HR representative</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={startInterview}
                  size="lg"
                  disabled={isProcessing}
                  className={`${companyColor.replace('bg-', 'bg-')} hover:opacity-90 text-white px-8 py-6 text-lg transition-all`}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                      Creating Session...
                    </div>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Interview
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>AI Interviewer</span>
                    <Badge variant="outline" className={isSpeaking ? "bg-green-100 text-green-700 animate-pulse" : ""}>
                      {isSpeaking ? "Speaking..." : "Live"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden border-2 border-gray-300">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                      <div className="text-center">
                        <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-500 ${isSpeaking ? 'scale-110 shadow-lg' : ''}`}>
                          {isSpeaking ? (
                            <Volume2 className="w-10 h-10 text-blue-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                        <p className="font-medium text-gray-700">AI Interviewer</p>
                        <p className="text-sm text-gray-500">{isSpeaking ? 'Asking question...' : 'Listening...'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  {/* Camera Preview specific for active interview */}
                  <CardTitle className="flex items-center justify-between">
                    <span>You</span>
                    <Badge variant="outline" className={isListening ? "bg-red-100 text-red-700 animate-pulse" : ""}>
                      {isListening ? "Recording..." : "Camera Active"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden border-2 border-gray-300">
                    {isCameraOn ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <VideoOff className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <button
                        onClick={toggleCamera}
                        className={`p-2 rounded-full ${isCameraOn ? 'bg-red-500' : 'bg-gray-500'} text-white`}
                        title="Toggle Camera"
                      >
                        {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>

            {/* Main Interview Area - Slider Style */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Question {questionIndex + 1}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => speak(currentQuestion)}
                        disabled={isSpeaking}
                        title="Replay Question"
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">

                  {/* Question Display */}
                  <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100 flex-grow flex items-center justify-center min-h-[200px]">
                    <h2 className="text-xl md:text-2xl font-medium text-center text-gray-800 leading-relaxed">
                      {currentQuestion}
                    </h2>
                  </div>

                  {/* Answer Input Area */}
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={userAnswer}
                        readOnly
                        placeholder="Speak to answer..."
                        className="w-full p-4 pr-12 border border-gray-300 rounded-xl min-h-[120px] bg-gray-50 text-lg resize-none focus:outline-none cursor-default"
                        disabled={isProcessing}
                      />
                      <div className="absolute bottom-4 right-4">
                        <Button
                          variant={isListening ? "destructive" : "secondary"}
                          size="icon"
                          className={`rounded-full h-10 w-10 ${isListening ? 'animate-pulse' : ''}`}
                          onClick={toggleListening}
                          disabled={isProcessing}
                          title={isListening ? "Stop Recording" : "Start Recording"}
                        >
                          {isListening ? <Square className="h-4 w-4" fill="currentColor" /> : <Mic className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <p className="text-sm text-gray-500">
                        {isListening ? "Listening..." : "Click mic to speak or type answer"}
                      </p>
                      <Button
                        onClick={submitAnswer}
                        disabled={!userAnswer.trim() || isProcessing}
                        className={`${companyColor.replace('bg-', 'bg-')} hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl min-w-[150px]`}
                      >
                        {isProcessing ? 'Processing...' : 'Submit Answer'}
                      </Button>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-8">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>~{interviewConfig?.duration} min left</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5" role="progressbar">
                      <div
                        className={`${companyColor} h-1.5 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${Math.min(100, (questionIndex + 1) * 10)}%` }}
                      ></div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white border-0 shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl font-bold text-gray-900">Finish Interview Early?</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <p className="text-gray-600 mb-6">
                Are you sure you want to finish the interview early? This will submit your current progress and you cannot undo this action.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    completeInterview();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirm Finish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
