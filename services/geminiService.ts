
import { GoogleGenAI } from "@google/genai";
import { Difficulty } from "../types";

// Initialize the API client
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

/**
 * Strictly returns one of the 10 predefined themes based on levelId.
 */
export const generateLevelTheme = async (levelId: number, _difficulty: Difficulty): Promise<string> => {
  // Use modulo to cycle through the 10 themes for 25 levels
  // levelId is 1-indexed, so we subtract 1 for the array index
  const themeIndex = (levelId - 1) % THEMES.length;
  return THEMES[themeIndex];
};

/**
 * Generates a unique image using Gemini based on the selected theme.
 */
export const generateLevelImage = async (theme: string): Promise<string> => {
  // Fallback for missing key
  if (!process.env.API_KEY) {
    return `https://picsum.photos/seed/${theme.replace(/\s/g, '')}${Date.now()}/1024/1024`;
  }

  try {
    const randomness = Math.floor(Math.random() * 1000000);
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Create a whimsical, highly detailed, cartoon-style digital illustration for a hidden object game background. 
          
          Visual Style Requirements:
          - Art Style: Warm, cozy, storybook illustration. Hand-drawn 2D aesthetic with soft outlines. Similar to Studio Ghibli.
          - Lighting: HEAVILY SUNLIT. Golden hour or bright morning sunlight streaming in. Warm color palette.
          - Complexity: Highly cluttered with many small objects, patterns, and details (essential for a hidden object game).
          - Perspective: Wide shot, capturing a full room or landscape.
          - RESTRICTIONS: NO photorealism. NO 3D rendering style. NO dark or gloomy scenes. NO text in image.

          Specific Scene: ${theme}.
          
          Random Seed: ${randomness}.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
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
    return `https://picsum.photos/seed/${theme.replace(/\s/g, '')}/1024/1024`;
  }
};
