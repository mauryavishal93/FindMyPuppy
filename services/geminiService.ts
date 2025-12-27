import { GoogleGenAI } from "@google/genai";
import { Difficulty } from "../types";

// Initialize Gemini API
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

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

// Curated list of high-quality images to use when AI generation fails (Quota limit/Error)
// These act as the "local bgImages" folder
const FALLBACK_BG_IMAGES = [
  "https://i.pinimg.com/1200x/a1/5a/a7/a15aa757cbe31b1f01a70747e5f2285e.jpg",
  "https://i.pinimg.com/1200x/0b/1e/9a/0b1e9ab6b24c5243207512208a281f2a.jpg",
  "https://i.pinimg.com/736x/24/20/1b/24201b2d3ffa5717f91d869169748a44.jpg",
  "https://i.pinimg.com/1200x/f8/d9/53/f8d9536cf847c759bf648a13278800f8.jpg",
  "https://i.pinimg.com/736x/5e/24/66/5e24661d7e60573574f785e192659d6f.jpg",
  "https://i.pinimg.com/736x/cd/e3/41/cde34175f01981e4d4388453210902b9.jpg",
  "https://i.pinimg.com/736x/63/4c/b2/634cb28ec99c014bca55f29f38a022a1.jpg",
  "https://i.pinimg.com/1200x/8c/f9/0f/8cf90f7fda56f0c16c2cf567c119fffc.jpg",
  "https://i.pinimg.com/1200x/3b/d1/62/3bd1627edcb6105e94b3571764e23445.jpg",
  "https://i.pinimg.com/1200x/0a/2f/fb/0a2ffbe057f5f5b5e7def0366f20d25e.jpg",
  "https://i.pinimg.com/1200x/1e/90/ac/1e90acddbf954fdd3ddbaa8142a9e2fe.jpg",
  "https://i.pinimg.com/1200x/f4/b7/9c/f4b79ca82021062bb448cbf75d087e49.jpg",
  "https://i.pinimg.com/1200x/b5/8d/1e/b58d1e36a15f1dcb95f182620357ad16.jpg",
  "https://i.pinimg.com/736x/f6/ce/d3/f6ced38951c83fa6d4200c1a60f1d700.jpg",
  "https://i.pinimg.com/736x/d7/d4/9f/d7d49fa3f3f28448455c3fddf6858f7f.jpg",
  "https://i.pinimg.com/1200x/0a/42/22/0a42228911f2b349aa509bcb5bcddc8d.jpg",
  "https://i.pinimg.com/736x/c8/d9/20/c8d920bf98f717e5e966346e12051042.jpg"
];

// --- BROWSER CACHE IMPLEMENTATION (IndexedDB) ---
const DB_NAME = 'FindMyPuppyDB';
const STORE_NAME = 'bg_images';
const DB_VERSION = 1;

// Helper to open DB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

// Save image data to cache
const saveToCache = async (imageData: string) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.add({ data: imageData, timestamp: Date.now() });
    console.log("Image saved to browser cache.");
  } catch (err) {
    console.error("Failed to save image to cache:", err);
  }
};

// Get a random image from cache
const getRandomFromCache = async (): Promise<string | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const keyRequest = store.getAllKeys();
      
      keyRequest.onsuccess = () => {
        const keys = keyRequest.result;
        if (keys.length === 0) {
          resolve(null);
          return;
        }
        // Pick a random key
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const dataRequest = store.get(randomKey);
        dataRequest.onsuccess = () => {
           resolve(dataRequest.result?.data || null);
        };
        dataRequest.onerror = () => resolve(null);
      };
      keyRequest.onerror = () => resolve(null);
    });
  } catch (err) {
    console.error("Failed to read from cache:", err);
    return null;
  }
};

export const generateLevelTheme = async (levelId: number, _difficulty: Difficulty): Promise<string> => {
  return THEMES[(levelId - 1) % THEMES.length];
};

export const generateLevelImage = async (theme: string, levelId: number): Promise<string> => {
  try {
    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a detailed, top-down view illustration suitable for a hidden object game background. 
                   The scene is: ${theme}. 
                   Variation ID: ${levelId}-${Math.random().toString(36).substring(7)}.
                   Style: Colorful, cozy, semi-realistic or detailed artistic style. 
                   Composition: Cluttered with many small objects and textures to make finding items challenging. 
                   Perspective: Top-down or high-angle isometric. 
                   Important: Do not include any dogs or puppies in the background image itself. 
                   Do not include text or UI elements.`
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const generatedImage = `data:image/png;base64,${part.inlineData.data}`;
        // Save to browser cache for future offline/fallback use
        saveToCache(generatedImage);
        return generatedImage;
      }
    }
    
    throw new Error("No image generated by Gemini.");
  } catch (error) {
    console.warn("Gemini image generation failed (likely quota exceeded or network issue). Trying cache...", error);
    
    // 1. Try Cache
    const cachedImage = await getRandomFromCache();
    if (cachedImage) {
        console.log("Successfully loaded image from Browser Cache.");
        return cachedImage;
    }

    // 2. Fallback to hardcoded list if cache is empty
    console.warn("Cache empty. Switching to fallback list.");
    const randomIndex = Math.floor(Math.random() * FALLBACK_BG_IMAGES.length);
    return FALLBACK_BG_IMAGES[randomIndex];
  }
};