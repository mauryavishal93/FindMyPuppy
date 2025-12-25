import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty } from "../types";

// Initialize the API client
// Note: In a real production app, you might proxy this through a backend to protect the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const THEMES = [
  "A cozy living room filled with colorful toys and blankets",
  "A messy kitchen after a baking session with flour everywhere",
  "A vibrant sunny park with bushes, flowers, and picnic baskets",
  "A magical candy forest with giant lollipops and gummy bears",
  "A futuristic robot workshop with scattered parts and neon lights",
  "An ancient library with stacks of books and scrolls",
  "A crowded beach day with umbrellas and sandcastles",
  "A snowy village square with market stalls",
  "A dense jungle with exotic plants and ruins",
  "A space station cafeteria with alien food",
];

export const generateLevelTheme = async (levelId: number, difficulty: Difficulty): Promise<string> => {
  // If API key is missing, return a deterministic fallback to allow UI testing
  if (!process.env.API_KEY) {
    return THEMES[(levelId + (difficulty.length)) % THEMES.length];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, vivid description (1 sentence) for a hidden object game background scene. 
      Theme ID: ${levelId}. Difficulty: ${difficulty}. 
      Make it cluttered and detailed, suitable for hiding small objects.`,
    });
    return response.text?.trim() || THEMES[0];
  } catch (error) {
    console.error("Gemini Theme Generation Error:", error);
    return THEMES[levelId % THEMES.length];
  }
};

export const generateLevelImage = async (theme: string): Promise<string> => {
  // Fallback for missing key
  if (!process.env.API_KEY) {
    // Return a random picsum image that is consistent for the theme string length
    // Added Date.now() to fallback to ensure uniqueness even in mock mode if called repeatedly
    return `https://picsum.photos/seed/${theme.replace(/\s/g, '')}${Date.now()}/1024/1024`;
  }

  try {
    // Random noise prevents caching and ensures uniqueness
    const randomness = Math.floor(Math.random() * 1000000);
    
    // Using gemini-2.5-flash-image for standard image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Create a highly detailed, cartoon-style 2D illustration for a hidden object game. The scene is: ${theme}. View is wide-angle. The image should be colorful, full of objects, patterns, and clutter to make finding hidden items challenging. Ensure this image is unique variation. Random Seed: ${randomness}. No text in image.` }
        ]
      },
      config: {
         // No specific aspect ratio needed as we'll cover, but 1:1 is standard safe bet for 2.5 flash image
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
     // Fallback to picsum on error
    return `https://picsum.photos/seed/${theme.replace(/\s/g, '')}/1024/1024`;
  }
};