
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty } from "../types";

// Initialize the API client
// Note: In a real production app, you might proxy this through a backend to protect the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Fallback themes with embedded style keywords to ensure even fallbacks look good if passed to image gen (if theme gen fails but image gen works)
const THEMES = [
  "A sun-drenched explorer's study room cluttered with ancient maps, brass compasses, and potted ferns in a hand-painted anime style",
  "A cozy sunlit cottage kitchen with golden light streaming onto breakfast dishes, copper pans, and herbs",
  "A vibrant sunlit secret garden filled with overgrown blooming flowers, butterflies, and old stone statues",
  "A bright sunlit wooden hut in a lush forest clearing with hiking gear and walking sticks scattered around",
  "A sunlit seaside beach cabana with colorful flags, seashells, fishing nets, and summer toys under a blue sky",
  "A sunlit glass greenhouse packed with exotic plants, clay pots, watering cans, and vines",
  "A dusty sunlit attic with distinct sunbeams illuminating old trunks, books, and forgotten treasures",
  "A bustling sunlit village market stall overflowing with fresh fruits, woven baskets, and hanging cloth",
  "A peaceful sunlit park picnic area with checkered blankets, wicker baskets, and dappled light through trees",
  "A whimsical sunlit treehouse interior with wooden toys, storybooks, and leaves dappled in sunshine",
];

export const generateLevelTheme = async (levelId: number, difficulty: Difficulty): Promise<string> => {
  // If API key is missing, return a deterministic fallback
  if (!process.env.API_KEY) {
    return THEMES[(levelId - 1) % THEMES.length];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a detailed visual description (1 sentence) for a hidden object game background scene. 
      Theme ID: ${levelId}. Difficulty: ${difficulty}. 
      
      MANDATORY REQUIREMENTS:
      1. STYLE: Studio Ghibli / Kazuo Oga (hand-painted, watercolor, detailed).
      2. LIGHTING: Bright, sunlit, "sun-drenched", with visible sunbeams or dappled light.
      3. MOOD: Explorer, adventure, cozy, peaceful.
      4. CONTENT: Cluttered with small objects (perfect for hiding things).
      
      Example output: "A sun-drenched inventor's workshop filled with brass gears, blueprints, and potted plants, illuminated by bright shafts of sunlight."`,
    });
    return response.text?.trim() || THEMES[(levelId - 1) % THEMES.length];
  } catch (error) {
    console.error("Gemini Theme Generation Error:", error);
    return THEMES[(levelId - 1) % THEMES.length];
  }
};

export const generateLevelImage = async (theme: string): Promise<string> => {
  // Fallback for missing key
  if (!process.env.API_KEY) {
    const seed = theme.replace(/\s/g, '').substring(0, 10);
    return `https://picsum.photos/seed/${seed}/1024/1024`;
  }

  try {
    // Random noise prevents caching and ensures uniqueness
    const randomness = Math.floor(Math.random() * 1000000);
    
    // Using gemini-2.5-flash-image for standard image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Create a digital illustration for a hidden object game.
          
          PROMPT:
          Style: Masterpiece Studio Ghibli background art, Kazuo Oga style, hand-painted anime aesthetic, watercolor and gouache textures.
          Setting: ${theme}
          Lighting: BRIGHT SUNLIT ATMOSPHERE. Distinct sunbeams, god rays, dappled sunlight filtering through leaves or windows. Warm, golden, and airy.
          Colors: Vibrant emerald greens, azure blues, warm wood tones, creamy whites. High saturation but natural palette.
          Detail: EXTREMELY HIGH. Cluttered with hundreds of small distinct items. Sharp details (no blur).
          Perspective: Wide-angle, immersive.
          
          NEGATIVE PROMPT:
          text, watermark, signature, blurry, depth of field, bokeh, dark, gloomy, night, horror, 3d render, photorealistic, low resolution, distorted.

          Random Seed: ${randomness}` }
        ]
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    // Fallback
    const seed = theme.replace(/\s/g, '').substring(0, 10);
    return `https://picsum.photos/seed/${seed}/1024/1024`;
  }
};
