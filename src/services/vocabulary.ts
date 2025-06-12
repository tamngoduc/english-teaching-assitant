import type { VocabularyData } from "src/types";

import axios from "./axios";

/**
 * Get information about a specific word
 */
export const getWordInfo = async (word: string): Promise<VocabularyData> => {
  try {
    const response = await axios.get<VocabularyData>(
      `/vocabulary?word=${encodeURIComponent(word)}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching information for word "${word}":`, error);
    throw error; // Let the component handle the error
  }
};

/**
 * Fetch word details from external API (dictionary API)
 */
export const fetchWordDetails = async (word: string): Promise<VocabularyData> => {
  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { baseURL: "" } // Override base URL to use absolute URL
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching external dictionary data for word "${word}":`, error);
    throw error; // Let the component handle the error
  }
};
