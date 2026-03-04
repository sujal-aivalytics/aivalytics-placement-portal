'use client';

import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useViolationDetection, type ViolationLog } from '@/hooks/useViolationDetection';
import { ViolationWarningModal } from '@/components/proctoring/violation-warning-modal';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice';
  category?: string;
  options: {
    id?: string;
    text: string;
    isCorrect?: boolean; // Optional - not sent from API for security
  }[];
}

interface PlacementMCQTestProps {
  questions: Question[];
  duration: number; // in minutes
  testTitle: string;
  onSubmit: (answers: Record<string, string>, proctoringData?: {
    violations: ViolationLog[];
    warningCount: number;
    isMaxViolations: boolean;
  }) => void;
  onTimeUp?: () => void;
  applicationId?: string;
}

type CameraStatus = 'idle' | 'checking' | 'ready' | 'denied' | 'error';
type IdentityStatus = 'loading' | 'pending' | 'verified' | 'failed';

export function PlacementMCQTest({
  questions,
  duration,
  testTitle,
  onSubmit,
  onTimeUp,
  applicationId,
}: PlacementMCQTestProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Proctoring states
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [identityStatus, setIdentityStatus] = useState<IdentityStatus>('loading');
  const [identityReason, setIdentityReason] = useState<string | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<{ name?: string | null; email?: string | null; image?: string | null } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violation, setViolation] = useState<string | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [monitoringEvents, setMonitoringEvents] = useState<Array<{ eventType: string; metadata?: Record<string, unknown> }>>([]);
  
  // Violation detection states
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [currentViolationType, setCurrentViolationType] = useState<ViolationLog['type'] | null>(null);
  const [isMaxViolations, setIsMaxViolations] = useState(false);
  const [violationLogs, setViolationLogs] = useState<ViolationLog[]>([]);
  const warningCountRef = useRef(0);

  const handleMonitoringEvent = useCallback(
    (eventType: string, metadata?: Record<string, unknown>) => {
      setMonitoringEvents(prev => [...prev, { eventType, metadata }]);
    },
    [],
  );

  // Violation detection handlers
  const handleViolationDetected = useCallback((violation: ViolationLog) => {
    setCurrentViolationType(violation.type);
    setViolationLogs(prev => [...prev, violation]);
    setShowWarningModal(true);
    
    // Log to monitoring events
    handleMonitoringEvent(`violation_${violation.type}`, {
      timestamp: violation.timestamp,
      ...violation.metadata,
    });
  }, [handleMonitoringEvent]);

  // Define submit handlers before violation handlers
  const handleSubmit = useCallback(() => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    setIsSubmitting(true);
    
    // Include proctoring data in submission
    onSubmit(answers, {
      violations: violationLogs,
      warningCount: warningCountRef.current,
      isMaxViolations: isMaxViolations,
    });
  }, [answers, onSubmit, stream, violationLogs, isMaxViolations]);

  const handleAutoSubmit = useCallback(() => {
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (onTimeUp) {
      onTimeUp();
    }
    setIsSubmitting(true);
    
    // Include proctoring data in auto-submission
    onSubmit(answers, {
      violations: violationLogs,
      warningCount: warningCountRef.current,
      isMaxViolations: true,
    });
  }, [onTimeUp, onSubmit, answers, stream, violationLogs]);

  const handleMaxViolations = useCallback(async (violations: ViolationLog[]) => {
    if (isMaxViolations || isSubmittingRef.current) return;
    setIsMaxViolations(true);
    setShowWarningModal(true);
    setViolationLogs(violations);
    
    // Log all violations
    violations.forEach(v => {
      handleMonitoringEvent(`violation_${v.type}`, {
        timestamp: v.timestamp,
        ...v.metadata,
      });
    });

    // Auto-submit test after a short delay
    setTimeout(() => {
      handleAutoSubmit();
    }, 2000);
  }, [handleMonitoringEvent, handleAutoSubmit, isMaxViolations]);

  // Initialize violation detection
  const { warningCount, resetViolations } = useViolationDetection({
    maxWarnings: 3,
    onViolation: handleViolationDetected,
    onMaxViolations: handleMaxViolations,
    enabled: examStarted,
    videoElementRef: previewVideoRef,
    faceDetectionEnabled: true,
    faceAwayThreshold: 3,
  });

  useEffect(() => {
    warningCountRef.current = warningCount;
  }, [warningCount]);

  // Identity verification
  const fetchIdentityStatus = async () => {
    setIdentityStatus('loading');
    try {
      const res = await fetch('/api/identity', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch identity status');
      }
      const data = await res.json();
      setIdentityStatus(data.status ?? 'pending');
      setIdentityReason(data.reason ?? null);
      if (data.user) {
        setVerifiedUser(data.user);
      }
    } catch (err) {
      console.error('Identity status error:', err);
      setIdentityStatus('failed');
      setIdentityReason('Unable to confirm identity. Please retry or contact support.');
    }
  };

  useEffect(() => {
    fetchIdentityStatus();
  }, []);

  // Sync preview video with stream when exam starts
  useEffect(() => {
    if (examStarted && previewVideoRef.current && stream && previewVideoRef.current.srcObject !== stream) {
      previewVideoRef.current.srcObject = stream;
      const playPromise = previewVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing preview video:', error);
        });
      }
    }
  }, [examStarted, stream]);

  const forceVerifyIdentity = async () => {
    try {
      const res = await fetch('/api/identity', { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to verify identity');
      }
      const data = await res.json();
      setIdentityStatus(data.status ?? 'verified');
      setIdentityReason(null);
      if (data.user) {
        setVerifiedUser(data.user);
      }
    } catch (err) {
      console.error('Force verify error:', err);
      setIdentityStatus('failed');
      setIdentityReason('Dev verify failed. Check server logs.');
    }
  };

  const devIdentityOverride = process.env.NEXT_PUBLIC_DEV_ID_VERIFY === 'true';


  // Fullscreen monitoring
  useEffect(() => {
    const updateFullscreenState = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active && examStarted) {
        setViolation('Full-screen mode exited. Re-enter to continue the exam.');
        handleMonitoringEvent('fullscreen_exit', { at: Date.now() });
      } else if (active) {
        setViolation(null);
        if (examStarted) {
          handleMonitoringEvent('fullscreen_resume', { at: Date.now() });
        }
      }
    };

    if (typeof document !== 'undefined') {
      updateFullscreenState();
      document.addEventListener('fullscreenchange', updateFullscreenState);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('fullscreenchange', updateFullscreenState);
      }
    };
  }, [examStarted, handleMonitoringEvent]);

  // Timer effect - only run when exam is started and in fullscreen
  useEffect(() => {
    if (!examStarted || !isFullscreen) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isFullscreen, timeLeft, handleAutoSubmit]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Camera access
  const requestCameraAccess = async () => {
    setCameraStatus('checking');
    setCameraError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = media;
      }
      setCameraStatus('ready');
      handleMonitoringEvent('camera_ready', { at: Date.now() });
    } catch (err: unknown) {
      console.error('Camera error', err);
      const errorObj = err as { name?: string; message?: string } | undefined;
      const blocked = errorObj?.name === 'NotAllowedError';
      setCameraStatus(blocked ? 'denied' : 'error');
      setCameraError(blocked ? 'Camera permission denied. Allow access to continue.' : 'Unable to access camera. Check device and retry.');
      handleMonitoringEvent('camera_failure', { reason: errorObj?.message });
    }
  };

  const enterFullscreen = async () => {
    if (typeof document === 'undefined') return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error', err);
      setViolation('Unable to enter full-screen. Please enable it to continue.');
    }
  };

  const canStart = useMemo(() => {
    return cameraStatus === 'ready' && identityStatus === 'verified' && isFullscreen && !isSubmitting;
  }, [cameraStatus, identityStatus, isFullscreen, isSubmitting]);

  const startExam = async () => {
    if (!canStart) return;
    setExamStarted(true);
    setViolation(null);
    resetViolations(); // Reset violation counter when exam starts
    handleMonitoringEvent('exam_started', { at: Date.now() });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / (duration * 60)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAnswer = (optionText: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: optionText,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];

  // Helper to get option label (A, B, C, D)
  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

  // Show pre-exam security checks if exam hasn't started
  if (!examStarted) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Proctored exam</p>
            <h1 className="text-2xl font-bold">{testTitle}</h1>
          </div>
        </div>

        {/* Violation Warning Modal */}
        <ViolationWarningModal
          isOpen={showWarningModal}
          warningCount={warningCount}
          maxWarnings={3}
          violationType={currentViolationType}
          onClose={() => setShowWarningModal(false)}
          isMaxViolations={isMaxViolations}
        />

        {/* Legacy violation display (for fullscreen exit) */}
        {violation && !showWarningModal && (
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/40">
            <CardHeader>
              <CardTitle className="text-amber-800 dark:text-amber-200">Action required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-amber-800 dark:text-amber-100">{violation}</p>
              {!isFullscreen && (
                <Button size="sm" onClick={enterFullscreen}>
                  Re-enter full-screen
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Pre-exam security checks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <StatusTile
                title="Camera access"
                status={cameraStatus === 'ready' ? 'pass' : cameraStatus === 'denied' ? 'fail' : 'pending'}
                description={cameraError || 'Allow webcam access to proceed.'}
                actions={
                  <Button size="sm" variant="outline" onClick={requestCameraAccess} disabled={cameraStatus === 'checking'}>
                    {cameraStatus === 'checking' ? 'Checking…' : cameraStatus === 'ready' ? 'Recheck' : 'Enable camera'}
                  </Button>
                }
              >
                <div className="mt-3 rounded border bg-black/70 aspect-video overflow-hidden">
                   <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
                </div>
              </StatusTile>

              <StatusTile
                title="Identity verification"
                status={identityStatus === 'verified' ? 'pass' : identityStatus === 'failed' ? 'fail' : 'pending'}
                description={identityReason || (identityStatus === 'verified' ? 'Identity confirmed.' : 'We verify your account email before starting.')}
                actions={
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={fetchIdentityStatus} disabled={identityStatus === 'loading'}>
                      {identityStatus === 'loading' ? 'Checking…' : 'Retry check'}
                    </Button>
                    {devIdentityOverride && (
                      <Button size="sm" variant="outline" onClick={forceVerifyIdentity}>
                        Mark verified (dev)
                      </Button>
                    )}
                  </div>
                }
              >
                {identityStatus === 'verified' && verifiedUser && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                    {verifiedUser.image ? (
                      <img src={verifiedUser.image} alt={verifiedUser.name || 'User'} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-200 font-bold">
                        {verifiedUser.name?.[0] || verifiedUser.email?.[0] || '?'}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">{verifiedUser.name || 'Authenticated User'}</p>
                      <p className="text-xs text-emerald-700/70 dark:text-emerald-300/60 truncate max-w-[150px]">{verifiedUser.email}</p>
                    </div>
                  </div>
                )}
              </StatusTile>

              <StatusTile
                title="Full-screen lock"
                status={isFullscreen ? 'pass' : 'pending'}
                description="Exam must stay in full-screen. Exiting will be recorded."
                actions={
                  <Button size="sm" onClick={enterFullscreen} variant="outline">
                    {isFullscreen ? 'Reconfirm' : 'Enter full-screen'}
                  </Button>
                }
              />
            </div>

            <div className="flex items-center justify-between rounded border px-3 py-2 text-sm text-muted-foreground">
              <p>Exam starts only after all checks are green. Leaving full-screen during the exam will pause your timer and be logged.</p>
              <Button onClick={startExam} disabled={!canStart}>
                {canStart ? 'Start Exam' : 'Complete checks to start'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col font-sans p-4 md:p-6">
      {/* Test Banner */}
      <div className="max-w-7xl mx-auto w-full mb-6 md:mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-none p-6 md:p-8 text-white shadow-xl border-b-4 border-primary">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-primary"></div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter">{testTitle}</h1>
              </div>
              <p className="opacity-90 font-bold text-sm md:text-base ml-4">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className={`
                bg-white/95 backdrop-blur-sm rounded-none px-6 md:px-8 py-3 md:py-4 flex items-center gap-3 shadow-lg
                ${timeLeft <= 60 ? 'animate-pulse ring-2 ring-red-500' : ''}
              `}>
                <Clock className={`w-6 h-6 md:w-8 md:h-8 ${getTimeColor()}`} />
                <span className={`text-3xl md:text-4xl font-black font-mono ${getTimeColor()}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="mt-2 text-xs md:text-sm font-bold opacity-90 tracking-wider">Time Remaining</p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="max-w-7xl mx-auto w-full mb-6 md:mb-8">
        <div className="bg-white rounded-none p-5 md:p-6 shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm md:text-base text-slate-600 font-black tracking-tight uppercase">Progress</span>
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-base text-slate-800 font-black">{answeredCount} / {questions.length}</span>
              <span className="text-xs text-slate-500 font-bold hidden sm:inline">answered</span>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner ring-1 ring-slate-200/50">
            <div 
              className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_rgba(93,95,239,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-right">
            <span className="text-xs text-slate-500 font-bold">{Math.round(progress)}% Complete</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar - Question Map & Camera */}
          <div className="lg:col-span-3 space-y-6 sticky top-6">
            <div className="bg-white rounded-none p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-black text-slate-800 mb-6 font-sans tracking-tighter">Questions</h2>
              <div className="grid grid-cols-4 gap-3">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id];
                  const isCurrent = idx === currentQuestion;
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`
                        aspect-square rounded-none text-lg font-black transition-all duration-300 transform relative overflow-hidden
                        ${isCurrent 
                          ? 'bg-white text-primary ring-2 ring-primary shadow-md scale-110 z-10' 
                          : isAnswered 
                          ? 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600 hover:shadow-xl hover:scale-105' 
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 hover:shadow-md hover:scale-105'
                        }
                      `}
                    >
                      {/* Shimmer effect on hover */}
                      {!isCurrent && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      )}
                      <span className="relative z-10">{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Camera Preview in Sidebar */}
            {cameraStatus === 'ready' && stream && (
              <div className="bg-white rounded-none p-4 shadow-sm border border-gray-100 overflow-hidden group">
                <div className="relative aspect-video rounded-none overflow-hidden bg-slate-900 shadow-lg ring-1 ring-gray-200">
                  <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    Live Feed
                  </div>
                  <video 
                    ref={previewVideoRef} 
                    className="h-full w-full object-cover transform scale-x-[-1] transition-transform duration-500 group-hover:scale-110" 
                    autoPlay 
                    playsInline 
                    muted 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 py-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Proctoring Active</span>
                </div>
              </div>
            )}
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-none p-8 shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Question {currentQuestion + 1}</h3>
                  <div className="h-1 w-12 bg-primary rounded-full" />
                </div>
                <span className="bg-[#F3E8FF] text-[#A855F7] px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-[#E9D5FF]">
                  {currentQ.category || 'numerical'}
                </span>
              </div>

              {/* Question Text Box */}
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-none p-10 mb-10 shadow-inner">
                <p className="text-2xl text-slate-700 leading-relaxed font-bold">
                  {currentQ.text}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4 flex-1">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option.text;
                  const label = getOptionLabel(idx);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option.text)}
                      className={`
                        group w-full text-left p-6 rounded-none border-2 transition-all duration-300 transform
                        ${isSelected
                          ? 'border-primary bg-primary/5 shadow-md -translate-y-0.5'
                          : 'border-slate-50 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`
                          flex-none flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                          ${isSelected 
                            ? 'border-primary bg-primary shadow-md shadow-purple-200' 
                            : 'border-slate-200 bg-white group-hover:border-slate-300'
                          }
                        `}>
                          {isSelected ? (
                            <div className="w-3.5 h-3.5 bg-white rounded-full scale-in-center" />
                          ) : (
                            <span className="text-sm font-black text-slate-400 group-hover:text-slate-500">{label}</span>
                          )}
                        </div>
                        <div className={`flex-1 text-lg font-black transition-colors duration-300 ${isSelected ? 'text-primary' : 'text-slate-600'}`}>
                          {option.text}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Footer Navigation */}
              <div className="mt-12 flex items-center justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="ghost"
                  className="text-slate-400 font-bold hover:bg-slate-100 hover:text-slate-700 h-14 px-8 rounded-2xl transition-all"
                >
                  ← Previous
                </Button>

                <div className="flex items-center gap-4">
                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={() => setShowSubmitConfirm(true)}
                      className="bg-[#10B981] hover:bg-[#059669] text-white h-14 px-12 rounded-none font-black text-lg shadow-sm shadow-emerald-100 transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                      Finish & Submit Test
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-primary hover:bg-primary/90 text-white h-14 px-12 rounded-none font-black text-lg shadow-sm shadow-purple-100 transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                      Save & Next →
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <Card className="max-w-lg w-full rounded-none border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden scale-in-center">
            <CardHeader className="text-center pt-12 pb-6 bg-white">
              <div className="w-28 h-28 bg-amber-50 rounded-none flex items-center justify-center mx-auto mb-8 border-4 border-amber-200 shadow-2xl">
                <AlertCircle className="w-16 h-16 text-amber-500" strokeWidth={3} />
              </div>
              <CardTitle className="text-4xl font-black text-slate-900 tracking-tighter">Submit Test?</CardTitle>
            </CardHeader>
            <CardContent className="px-12 pb-12 space-y-8 bg-white">
              <p className="text-center text-slate-600 font-bold text-lg leading-relaxed">
                You&apos;re about to submit your test. Once submitted, your score will be final and cannot be modified.
              </p>
              
              <div className="flex justify-center gap-12 py-8 bg-slate-50 rounded-none border-l-4 border-primary shadow-lg">
                <div className="text-center">
                  <div className="text-5xl font-black text-primary mb-2">{answeredCount}</div>
                  <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Answered</div>
                </div>
                <div className="w-[2px] bg-slate-200 my-2" />
                <div className="text-center">
                  <div className="text-5xl font-black text-slate-300 mb-2">{questions.length - answeredCount}</div>
                  <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Remaining</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleSubmit}
                  className="w-full h-16 rounded-none bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl uppercase tracking-wider border-b-4 border-primary/80"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Yes, Submit Test'}
                </Button>
                <Button
                  onClick={() => setShowSubmitConfirm(false)}
                  variant="ghost"
                  className="w-full h-14 rounded-none font-black text-slate-500 hover:text-slate-700 hover:bg-slate-100 uppercase tracking-wider transition-all duration-300"
                  disabled={isSubmitting}
                >
                  No, Keep Working
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Violation Warning Modal */}
      <ViolationWarningModal
        isOpen={showWarningModal}
        warningCount={warningCount}
        maxWarnings={3}
        violationType={currentViolationType}
        onClose={() => setShowWarningModal(false)}
        isMaxViolations={isMaxViolations}
      />
    </div>
  );
}

interface StatusTileProps {
  title: string;
  status: 'pass' | 'pending' | 'fail';
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

function StatusTile({ title, status, description, actions, children }: StatusTileProps) {
  const color =
    status === 'pass'
      ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-200 dark:bg-emerald-950/40'
      : status === 'fail'
      ? 'text-red-700 bg-red-50 dark:text-red-200 dark:bg-red-950/40'
      : 'text-amber-700 bg-amber-50 dark:text-amber-200 dark:bg-amber-950/40';

  return (
    <div className="space-y-2 rounded border p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${color}`}>
          {status === 'pass' ? 'Ready' : status === 'fail' ? 'Fix required' : 'Pending'}
        </span>
      </div>
      {actions}
      {children}
    </div>
  );
}
