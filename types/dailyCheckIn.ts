// Daily Check-In Types

export interface DailyCheckInData {
  lastPlayedDate: string | null; // YYYY-MM-DD format
  currentMissionDay: number; // 1-10, then cycles
  hintStreak: number;
  totalHints: number; // This is the user's premiumHints from UserProgress
}

export interface HiddenObject {
  id: string;
  name: string;
  icon: string; // Emoji or icon for the object
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  found: boolean;
}

export interface DailyMission {
  day: number;
  title: string;
  description: string;
  objects: HiddenObject[];
  animation: string; // Description of animation
  backgroundImage: string; // Image URL for the scene background
}

export type DailyCheckInState = 'ready' | 'completed' | 'missed';

export const DAILY_MISSIONS: DailyMission[] = [
  {
    day: 1,
    title: "Feed the Puppy",
    description: "Help the puppy get his meal!",
    backgroundImage: "", // Will be set by getMissionByDay
    objects: [
      { id: 'bowl', name: 'Bowl', icon: '🥣', x: 25, y: 60, found: false },
      { id: 'dogFood', name: 'Dog Food', icon: '🍖', x: 50, y: 55, found: false },
      { id: 'waterBottle', name: 'Water Bottle', icon: '💧', x: 75, y: 50, found: false },
      { id: 'napkin', name: 'Napkin', icon: '🧻', x: 40, y: 70, found: false }
    ],
    animation: "Puppy eats & wags tail, boy happy"
  },
  {
    day: 2,
    title: "Going for Walk",
    description: "Find everything for the walk!",
    backgroundImage: "",
    objects: [
      { id: 'puppy', name: 'Puppy', icon: '🐕', x: 30, y: 50, found: false },
      { id: 'leash', name: 'Leash', icon: '🦮', x: 60, y: 45, found: false },
      { id: 'collar', name: 'Collar', icon: '🔗', x: 45, y: 60, found: false },
      { id: 'shoes', name: 'Shoes', icon: '👟', x: 20, y: 70, found: false },
      { id: 'poopBag', name: 'Poop Bag', icon: '🗑️', x: 70, y: 65, found: false }
    ],
    animation: "Boy & puppy walk happily"
  },
  {
    day: 3,
    title: "Bath & Groom",
    description: "Prepare bath time for the puppy!",
    backgroundImage: "",
    objects: [
      { id: 'shampoo', name: 'Shampoo', icon: '🧴', x: 25, y: 40, found: false },
      { id: 'brush', name: 'Brush', icon: '🪮', x: 55, y: 45, found: false },
      { id: 'towel', name: 'Towel', icon: '🧺', x: 40, y: 65, found: false },
      { id: 'soap', name: 'Soap', icon: '🧼', x: 70, y: 50, found: false },
      { id: 'duckToy', name: 'Duck Toy', icon: '🦆', x: 35, y: 55, found: false }
    ],
    animation: "Puppy shakes water, boy laughs"
  },
  {
    day: 4,
    title: "Toy Hunt",
    description: "Find puppy's favorite toys!",
    backgroundImage: "",
    objects: [
      { id: 'ball', name: 'Ball', icon: '⚽', x: 30, y: 50, found: false },
      { id: 'ropeToy', name: 'Rope Toy', icon: '🪢', x: 50, y: 45, found: false },
      { id: 'squeakyBone', name: 'Squeaky Bone', icon: '🦴', x: 70, y: 55, found: false },
      { id: 'rubberRing', name: 'Rubber Ring', icon: '⭕', x: 25, y: 65, found: false },
      { id: 'teddy', name: 'Teddy', icon: '🧸', x: 60, y: 70, found: false }
    ],
    animation: "Puppy plays joyfully"
  },
  {
    day: 5,
    title: "Vet Visit",
    description: "Pack items for the vet!",
    backgroundImage: "",
    objects: [
      { id: 'carrier', name: 'Carrier', icon: '📦', x: 25, y: 50, found: false },
      { id: 'treats', name: 'Treats', icon: '🍪', x: 50, y: 45, found: false },
      { id: 'vaccinationCard', name: 'Vaccination Card', icon: '💳', x: 70, y: 40, found: false },
      { id: 'water', name: 'Water', icon: '💧', x: 40, y: 60, found: false },
      { id: 'toy', name: 'Toy', icon: '🎾', x: 60, y: 65, found: false }
    ],
    animation: "Vet thumbs up"
  },
  {
    day: 6,
    title: "Birthday Party",
    description: "Prepare the puppy's party!",
    backgroundImage: "",
    objects: [
      { id: 'partyHat', name: 'Party Hat', icon: '🎩', x: 30, y: 35, found: false },
      { id: 'cupcake', name: 'Cupcake', icon: '🧁', x: 50, y: 50, found: false },
      { id: 'balloon', name: 'Balloon', icon: '🎈', x: 70, y: 40, found: false },
      { id: 'giftBox', name: 'Gift Box', icon: '🎁', x: 40, y: 65, found: false }
    ],
    animation: "Puppy wearing hat eating cake"
  },
  {
    day: 7,
    title: "Training Day",
    description: "Get training tools ready!",
    backgroundImage: "",
    objects: [
      { id: 'clicker', name: 'Clicker', icon: '🔘', x: 30, y: 45, found: false },
      { id: 'treatPouch', name: 'Treat Pouch', icon: '🎒', x: 55, y: 50, found: false },
      { id: 'whistle', name: 'Whistle', icon: '🔊', x: 70, y: 45, found: false },
      { id: 'noteSheet', name: 'Note Sheet', icon: '📝', x: 40, y: 60, found: false }
    ],
    animation: "Puppy sits or rolls over"
  },
  {
    day: 8,
    title: "Photo Shoot",
    description: "Prepare for a photo session!",
    backgroundImage: "",
    objects: [
      { id: 'camera', name: 'Camera', icon: '📷', x: 35, y: 40, found: false },
      { id: 'bowTie', name: 'Bow Tie', icon: '🎀', x: 55, y: 50, found: false },
      { id: 'sunglasses', name: 'Sunglasses', icon: '🕶️', x: 25, y: 55, found: false },
      { id: 'backdrop', name: 'Backdrop', icon: '🎬', x: 70, y: 60, found: false },
      { id: 'toy', name: 'Toy', icon: '🎾', x: 45, y: 65, found: false }
    ],
    animation: "Puppy poses, camera flash"
  },
  {
    day: 9,
    title: "Camping Adventure",
    description: "Pack for the camping trip!",
    backgroundImage: "",
    objects: [
      { id: 'tent', name: 'Tent', icon: '⛺', x: 25, y: 45, found: false },
      { id: 'lantern', name: 'Lantern', icon: '🕯️', x: 50, y: 40, found: false },
      { id: 'puppyBlanket', name: 'Puppy Blanket', icon: '🛏️', x: 35, y: 60, found: false },
      { id: 'snacks', name: 'Snacks', icon: '🍿', x: 65, y: 55, found: false },
      { id: 'water', name: 'Water', icon: '💧', x: 55, y: 70, found: false }
    ],
    animation: "Puppy & boy around campfire"
  },
  {
    day: 10,
    title: "Hide & Seek",
    description: "Find where the puppy hid!",
    backgroundImage: "",
    objects: [
      { id: 'tail', name: 'Tail', icon: '🐕', x: 30, y: 50, found: false },
      { id: 'blanket', name: 'Blanket', icon: '🛏️', x: 50, y: 45, found: false },
      { id: 'chewToy', name: 'Chew Toy', icon: '🦴', x: 70, y: 55, found: false },
      { id: 'pillow', name: 'Pillow', icon: '🛋️', x: 25, y: 60, found: false },
      { id: 'flashlight', name: 'Flashlight', icon: '🔦', x: 60, y: 65, found: false }
    ],
    animation: "Puppy jumps out & hugs boy"
  }
];

// Background images from the game
const BACKGROUND_IMAGES = [
  "https://mauryavishal93.github.io/FindMyPuppy/asset/1.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/2.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/3.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/4.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/5.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/6.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/7.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/8.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/9.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/10.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/11.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/12.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/13.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/14.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/15.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/16.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/17.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/18.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/19.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/20.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/21.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/22.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/23.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/24.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/25.png",
  "https://mauryavishal93.github.io/FindMyPuppy/asset/26.png"
];

// Seeded random number generator for consistent randomization per day
const seededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

// Generate random position within safe bounds (avoid edges)
const getRandomPosition = (random: () => number, existingPositions: Array<{x: number, y: number}>, minDistance: number = 5): {x: number, y: number} => {
  let attempts = 0;
  let x: number, y: number;
  
  do {
    x = 10 + random() * 80; // 10% to 90% to avoid edges
    y = 15 + random() * 75; // 15% to 90% to avoid top/bottom edges
    attempts++;
    
    // Check distance from existing positions
    const tooClose = existingPositions.some(pos => {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      return distance < minDistance;
    });
    
    if (!tooClose || attempts > 50) break;
  } while (attempts < 50);
  
  return { x, y };
};

// Helper function to get mission by day (cycles after day 10)
export const getMissionByDay = (day: number): DailyMission => {
  const missionIndex = ((day - 1) % DAILY_MISSIONS.length);
  const mission = { ...DAILY_MISSIONS[missionIndex] };
  
  // Assign a background image based on day (cycles through available images)
  const bgIndex = (day - 1) % BACKGROUND_IMAGES.length;
  mission.backgroundImage = BACKGROUND_IMAGES[bgIndex];
  
  // Randomize object positions based on day (seeded random for consistency)
  const random = seededRandom(day * 1000);
  const existingPositions: Array<{x: number, y: number}> = [];
  
  mission.objects = mission.objects.map(obj => {
    const newPos = getRandomPosition(random, existingPositions, 8);
    existingPositions.push(newPos);
    return {
      ...obj,
      x: Math.round(newPos.x * 10) / 10, // Round to 1 decimal
      y: Math.round(newPos.y * 10) / 10
    };
  });
  
  return mission;
};

// Helper function to get today's date string (YYYY-MM-DD)
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to check if date is tomorrow
export const isTomorrow = (dateString: string): boolean => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  const tomorrowString = `${year}-${month}-${day}`;
  return dateString === tomorrowString;
};

// Helper function to check if date is more than 1 day ago
export const isMoreThanOneDayAgo = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  const diffTime = today.getTime() - date.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays > 1;
};
