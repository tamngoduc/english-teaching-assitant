// Speech synthesis utilities
type SpeechCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (e: SpeechSynthesisErrorEvent) => void;
};

// Get speech synthesis instance
const getSynthesis = () => window.speechSynthesis;

// Create speech recognition instance
export const createSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  const recognition = new SpeechRecognition();
  Object.assign(recognition, {
    continuous: true,
    interimResults: true,
    lang: "en-US",
    maxAlternatives: 1,
  });
  return recognition;
};

// Create utterance with default settings
const createUtterance = (text: string): SpeechSynthesisUtterance => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  return utterance;
};

// Add event listeners to utterance
const addUtteranceListeners = (
  utterance: SpeechSynthesisUtterance,
  callbacks?: SpeechCallbacks
) => {
  if (callbacks?.onStart) utterance.onstart = callbacks.onStart;
  if (callbacks?.onEnd) utterance.onend = callbacks.onEnd;
  if (callbacks?.onError) utterance.onerror = callbacks.onError;
};

// Main speak function
export const speak = (text: string, callbacks?: SpeechCallbacks) => {
  const synthesis = getSynthesis();
  if (!synthesis) return;

  // Stop any current speech
  synthesis.cancel();

  const utterance = createUtterance(text);
  addUtteranceListeners(utterance, callbacks);

  // Handle potential browser restrictions
  try {
    synthesis.speak(utterance);

    // Workaround for some browsers that need a small delay
    setTimeout(() => {
      if (synthesis.paused) {
        synthesis.resume();
      }
    }, 100);
  } catch (error) {
    console.error("Error starting speech synthesis:", error);
    callbacks?.onError?.(error as SpeechSynthesisErrorEvent);
  }
};

// Stop speech function
export const stopSpeech = () => getSynthesis()?.cancel();

// Check if currently speaking
export const isSpeaking = () => getSynthesis()?.speaking ?? false;
