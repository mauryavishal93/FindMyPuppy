import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty } from "../types";

// Initialize the API client
// Note: In a real production app, you might proxy this through a backend to protect the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const THEMES = [
  "A sunlit explorer's study room cluttered with ancient maps, compasses, and artifacts",
  "A cozy sunlit cottage kitchen with golden light streaming onto breakfast dishes",
  "A vibrant sunlit garden filled with blooming flowers, butterflies, and gardening tools",
  "A sunlit wooden hut in a forest clearing with hiking gear scattered around",
  "A bright sunlit beach cabana with seashells, nets, and summer toys",
  "A sunlit greenhouse packed with exotic plants, clay pots, and watering cans",
  "A sunlit attic with dust motes dancing in light beams among old trunks and treasures",
  "A sunlit village market stall overflowing with fresh fruits and colorful baskets",
  "A sunlit park picnic area with checkered blankets and picnic baskets",
  "A sunlit treehouse with wooden toys and leaves dappled in sunshine",
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
      The theme MUST be a bright, 'sunlit' environment (e.g. sunlit study, sunlit garden, sunlit hut, sunlit explorer's room). 
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
          { text: `Create a whimsical, highly detailed, cartoon-style digital illustration for a hidden object game background. 
          
          Visual Style Requirements:
          - Art Style: Warm, cozy, storybook illustration. Hand-drawn 2D aesthetic with soft outlines. Similar to Studio Ghibli or detailed European comic backgrounds.
          - Lighting: HEAVILY SUNLIT. Golden hour or bright morning sunlight streaming in through windows or leaves. Warm color palette (golds, oranges, warm greens).
          - Atmosphere: Adventurous, nostalgic, and cheerful.
          - Complexity: Highly cluttered with many small objects, patterns, and details (essential for a hidden object game).
          - Perspective: Wide shot, capturing a full room or landscape.
          - RESTRICTIONS: NO photorealism. NO 3D rendering style. NO dark or gloomy scenes. 

          Specific Scene: ${theme}.
          
          Ensure the image is unique and creative. Random Seed: ${randomness}. No text in image.` }
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