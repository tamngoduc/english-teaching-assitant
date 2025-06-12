import { createContext, useState, type ReactNode } from "react";

interface AudioAutoPlayContextType {
  autoPlayTTS: boolean;
  setAutoPlayTTS: (enabled: boolean) => void;
  handleAutoPlayToggle: (enabled: boolean) => void;
}

const AudioAutoPlayContext = createContext<AudioAutoPlayContextType | undefined>(
  undefined
);

interface AudioAutoPlayProviderProps {
  children: ReactNode;
}

export const AudioAutoPlayProvider = ({ children }: AudioAutoPlayProviderProps) => {
  const [autoPlayTTS, setAutoPlayTTS] = useState(true);

  const handleAutoPlayToggle = (enabled: boolean) => {
    setAutoPlayTTS(enabled);
  };

  const value: AudioAutoPlayContextType = {
    autoPlayTTS,
    setAutoPlayTTS,
    handleAutoPlayToggle,
  };

  return (
    <AudioAutoPlayContext.Provider value={value}>
      {children}
    </AudioAutoPlayContext.Provider>
  );
};

export { AudioAutoPlayContext };
export type { AudioAutoPlayContextType };
