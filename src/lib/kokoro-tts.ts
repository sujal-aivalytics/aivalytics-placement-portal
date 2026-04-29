interface SpeakWithKokoroOptions {
  voice?: string;
  speed?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (e: Error) => void;
}

/**
 * Pre-processes LLM output for natural-sounding TTS.
 * 1. Prepend warm opener if first sentence.
 * 2. Add [pause] after question marks.
 * 3. Replace dashes with commas.
 * 4. Insert "hmm, " in long sentences.
 * 5. Strip markdown.
 * 6. Replace internal [pause] markers with periods.
 */
export function humanizeText(rawText: string, isFirst?: boolean): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Warm opener for first sentence
  if (isFirst) {
    const openers = ["Alright,", "Sure,", "Okay,", "Right,"];
    const opener = openers[Math.floor(Math.random() * openers.length)];
    text = `${opener} ${text}`;
  }

  // 2. Append [pause] after every '?' that ends a sentence
  text = text.replace(/\?\s/g, '? [pause] ').replace(/\?$/g, '? [pause]');

  // 3. Replace ' — ' with ', '
  text = text.replace(/ — /g, ', ');

  // 4. If text > 80 chars, insert "hmm, " before the last clause
  if (text.length > 80) {
    const lastIndex = Math.max(text.lastIndexOf(', '), text.lastIndexOf('. '));
    if (lastIndex !== -1) {
      text = text.slice(0, lastIndex + 2) + "hmm, " + text.slice(lastIndex + 2);
    }
  }

  // 5. Remove markdown: strip **, *, #, backticks
  text = text.replace(/(\*\*|\*|#|`)/g, '');

  // 6. Strip [pause] markers and replace with ". "
  text = text.replace(/\[pause\]/g, '. ');

  // 7. Return cleaned string
  return text.trim();
}

/**
 * Splits text into sentences for low-latency streaming.
 */
export function chunkTextForStreaming(text: string): string[] {
  if (!text) return [];
  // Split on . ! ? followed by space or end of string
  const chunks = text.split(/(?<=[.!?])\s+/);
  return chunks.map(c => c.trim()).filter(c => c.length > 0);
}

/**
 * Plays text using Kokoro TTS API with a fallback to window.speechSynthesis.
 */
export async function speakWithKokoro(
  text: string,
  options: SpeakWithKokoroOptions = {}
): Promise<() => void> {
  const voice = options.voice ?? "af_heart";
  const speed = options.speed ?? 0.93;
  
  let sourceNode: AudioBufferSourceNode | null = null;
  let audioCtx: AudioContext | null = null;
  let isStopped = false;

  const stop = () => {
    isStopped = true;
    if (sourceNode) {
      try {
        sourceNode.stop();
      } catch (e) {
        // Already stopped or not started
      }
    }
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  try {
    const response = await fetch('/api/tts-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text, 
        voice, 
        speed,
        model: "model_q8f16" // Included for API compatibility
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    
    if (isStopped) return stop;

    // Use standard AudioContext
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    audioCtx = new AudioContextClass();
    
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    if (isStopped) {
      audioCtx.close();
      return stop;
    }

    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioCtx.destination);
    
    sourceNode.onended = () => {
      if (!isStopped) {
        options.onEnd?.();
        audioCtx?.close();
      }
    };

    options.onStart?.();
    sourceNode.start(0);

    return stop;

  } catch (error) {
    console.error("[KokoroTTS] Falling back to browser TTS", error);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => options.onStart?.();
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = (e) => options.onError?.(new Error('SpeechSynthesis error'));
      
      window.speechSynthesis.speak(utterance);
      
      return () => {
        window.speechSynthesis.cancel();
      };
    }

    options.onError?.(error as Error);
    return () => {};
  }
}
