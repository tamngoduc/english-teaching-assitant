import { useContext } from "react";

import { AudioAutoPlayContext } from "src/contexts/AudioAutoPlayContext";

export const useAudioAutoPlay = () => {
  const context = useContext(AudioAutoPlayContext);
  if (context === undefined) {
    throw new Error("useAudioAutoPlay must be used within an AudioAutoPlayProvider");
  }
  return context;
};
