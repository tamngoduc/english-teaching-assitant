export interface User {
  user_id: number;
  username: string;
  password: string;
  email: string;
  created_at: string;
}

export interface Conversation {
  conversation_id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
}

export interface Message {
  message_id: number;
  conversation_id: number;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface VocabularyData {
  meaning: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms: string[];
      antonyms: string[];
      example: string;
    }[];
  }[];
  pronunciation: {
    text: string;
    audio: string;
    sourceUrl: string;
    license: {
      name: string;
      url: string;
    };
  }[];
  translation: string;
}
