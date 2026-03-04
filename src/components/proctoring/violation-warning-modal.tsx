'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import type { ViolationType } from '@/hooks/useViolationDetection';

interface ViolationWarningModalProps {
  isOpen: boolean;
  warningCount: number;
  maxWarnings: number;
  violationType: ViolationType | null;
  onClose?: () => void;
  isMaxViolations?: boolean;
}

const violationMessages: Record<ViolationType, string> = {
  fullscreen_exit: 'Fullscreen exit detected',
  tab_switch: 'Tab switching detected',
  window_blur: 'Window focus lost',
  look_away: 'Looking away from camera detected',
  copy_paste: 'Copy/Paste operation detected',
  right_click: 'Right click detected',
  keyboard_shortcut: 'Prohibited keyboard shortcut detected',
};

export function ViolationWarningModal({
  isOpen,
  warningCount,
  maxWarnings,
  violationType,
  onClose,
  isMaxViolations = false,
}: ViolationWarningModalProps) {

  useEffect(() => {
    if (isOpen && !isMaxViolations && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMaxViolations, onClose]);

  if (!isOpen) return null;

  const violationMessage = violationType ? violationMessages[violationType] : 'Violation detected';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md border-2 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full p-3 ${
                  isMaxViolations
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : 'bg-amber-100 dark:bg-amber-900/30'
                }`}
              >
                <AlertTriangle
                  className={`h-6 w-6 ${
                    isMaxViolations
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                />
              </div>
              <CardTitle
                className={`text-xl ${
                  isMaxViolations
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-amber-700 dark:text-amber-300'
                }`}
              >
                {isMaxViolations ? 'Maximum Violations Reached' : 'Warning'}
              </CardTitle>
            </div>
            {!isMaxViolations && onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`rounded-lg border-2 p-4 ${
              isMaxViolations
                ? 'border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800'
                : 'border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800'
            }`}
          >
            <p
              className={`font-semibold ${
                isMaxViolations
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-amber-800 dark:text-amber-200'
              }`}
            >
              {isMaxViolations ? (
                <>
                  You have reached the maximum number of violations ({maxWarnings}).
                  <br />
                  <br />
                  Your test will be automatically submitted now.
                </>
              ) : (
                <>
                  Warning {warningCount}/{maxWarnings}: {violationMessage}
                </>
              )}
            </p>
          </div>

          {!isMaxViolations && (
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Remaining warnings:</strong> {maxWarnings - warningCount}
                <br />
                If you reach {maxWarnings} warnings, your test will be automatically submitted.
              </p>
            </div>
          )}

          {isMaxViolations && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-300 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                All violations have been logged and will be reviewed by the exam administrator.
              </p>
            </div>
          )}

          {!isMaxViolations && onClose && (
            <Button
              onClick={onClose}
              className="w-full"
              variant="outline"
            >
              Acknowledge
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

