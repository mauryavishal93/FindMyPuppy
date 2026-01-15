import { Difficulty } from "../types";

// --- THEMES ---
const THEMES = [
  "A sunlit cottage kitchen table in morning light",
  "A cozy explorer's desk by a window in autumn",
  "A vintage sewing corner bathed in soft afternoon sun",
  "A lush secret garden nook with blooming hydrangeas",
  "A storybook herbalist's hut interior",
  "A peaceful sunroom filled with ferns",
  "A picnic on a checkered blanket in evening light",
  "A dusty attic window seat with soft sunbeams",
  "A greenhouse shelf crowded with succulents",
  "A bakery counter in a village",
  "A magical potion shop counter",
  "A rustic toolshed workbench",
  "A vintage candy shop display",
  "A painter's easel in a meadow",
  "A cozy reading nook with a plush armchair",
  "A forest floor covered in moss and mushrooms",
  "A seaside rock pool with colorful shells",
  "A vintage vanity table with perfume bottles",
  "A cluttered antique shop shelf",
  "A festive holiday fireplace mantle",
  "A treehouse floor scattered with toys",
  "A japanese tea ceremony set",
  "A wizard's alchemy table",
  "A farmer's market stall",
  "A cozy bedroom window sill"
];

// Curated list of high-quality background images for game levels
// Using local assets from public/asset folder (works for both web and Android)
const FALLBACK_BG_IMAGES = [
  "/asset/1.png",
  "/asset/2.png",
  "/asset/3.png",
  "/asset/4.png",
  "/asset/5.png",
  "/asset/6.png",
  "/asset/7.png",
  "/asset/8.png",
  "/asset/9.png",
  "/asset/10.png",
  "/asset/11.png",
  "/asset/12.png",
  "/asset/13.png",
  "/asset/14.png",
  "/asset/15.png",
  "/asset/16.png",
  "/asset/17.png",
  "/asset/18.png",
  "/asset/19.png",
  "/asset/20.png",
  "/asset/21.png",
  "/asset/22.png",
  "/asset/23.png",
  "/asset/24.png",
  "/asset/25.png",
  "/asset/26.png"
];


export const generateLevelTheme = async (levelId: number, _difficulty: Difficulty): Promise<string> => {
  return THEMES[(levelId - 1) % THEMES.length];
};

export const generateLevelImage = async (theme: string, levelId: number, timestamp?: number): Promise<string> => {
  // Use seeded random to select image based on level and timestamp for consistency
  // This ensures the same level gets the same image, but different levels get different images
  const seed = levelId * 1000 + (timestamp ? timestamp % 1000 : 0);
  const randomIndex = seed % FALLBACK_BG_IMAGES.length;
  return FALLBACK_BG_IMAGES[randomIndex];
};