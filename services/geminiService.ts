
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
  // If API key is missing, return a deterministic fallback
  if (!process.env.API_KEY) {
    return THEMES[(levelId - 1) % THEMES.length];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, vivid description (1 sentence) for a hidden object game background scene. 
      Theme ID: ${levelId}. Difficulty: ${difficulty}. 
      The theme MUST be a bright, 'sunlit' environment related to exploration, nature, or cozy living, in the style of a Studio Ghibli movie.
      Examples: Sunlit explorer's study, Sunlit garden, Sunlit hut.
      Make it cluttered and detailed, suitable for hiding small objects.`,
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
    // Return a random picsum image that is consistent for the theme string length
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
          { text: `Generate a highly detailed digital illustration for a hidden object game background.
          
          Visual Style specifications:
          - Art Style: Studio Ghibli background art (Kazuo Oga style), anime background, hand-painted watercolor/gouache.
          - Lighting: Bright SUNLIT atmosphere. Sunbeams, dappled sunlight, warm and bright. High visibility.
          - Vibe: Explorer, adventure, cozy, nostalgic, peaceful.
          - Colors: Vibrant, lush greens, sky blues, warm earthy tones.
          - Detail: Extremely cluttered and detailed. Packed with small items.
          - Perspective: Wide angle, immersive.
          
          Specific Scene: ${theme}.
          
          RESTRICTIONS:
          - NO text.
          - NO 3D CGI or photorealistic rendering.
          - Must be 2D anime style.

          Random Seed: ${randomness}.` }
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
