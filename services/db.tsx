
// ------------------------------------------------------------------
// AUTH SERVICE - Client Side
// ------------------------------------------------------------------

export interface User {
  username: string;
  email: string;
  hints?: number;
  points?: number;
  premium?: boolean;
  levelPassedEasy?: number;
  levelPassedMedium?: number;
  levelPassedHard?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export const db = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Login failed" };
      }
      return data;
    } catch (error) {
      console.error("DB Login Error:", error);
      return { success: false, message: "Connection error. Is the backend running?" };
    }
  },

  signup: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Signup failed" };
      }
      return data;
    } catch (error) {
      console.error("DB Signup Error:", error);
      return { success: false, message: "Connection error. Is the backend running?" };
    }
  },

  updateHints: async (username: string, hints: number): Promise<{ success: boolean; message?: string; hints?: number }> => {
    try {
      const response = await fetch('/api/user/update-hints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, hints }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to update hints" };
      }
      return data;
    } catch (error) {
      console.error("DB Update Hints Error:", error);
      return { success: false, message: "Connection error. Is the backend running?" };
    }
  },

  updatePoints: async (username: string, points: number): Promise<{ success: boolean; message?: string; points?: number }> => {
    try {
      const response = await fetch('/api/user/update-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, points }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to update points" };
      }
      return data;
    } catch (error) {
      console.error("DB Update Points Error:", error);
      return { success: false, message: "Connection error. Is the backend running?" };
    }
  },

  updatePremium: async (username: string, premium: boolean): Promise<{ success: boolean; message?: string; premium?: boolean }> => {
    try {
      const response = await fetch('/api/user/update-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, premium }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to update premium status" };
      }
      return data;
    } catch (error) {
      console.error("DB Update Premium Error:", error);
      return { success: false, message: "Connection error. Is the backend running?" };
    }
  },

  updateLevelPassed: async (username: string, difficulty: string, levelPassed: number): Promise<{ success: boolean; message?: string; levelPassedEasy?: number; levelPassedMedium?: number; levelPassedHard?: number }> => {
    try {
      const response = await fetch('/api/user/update-level-passed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, difficulty, levelPassed }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to update level passed count" };
      }
      return data;
    } catch (error) {
      console.error("DB Update Level Passed Error:", error);
      return { success: false, message: "Connection error. Is the backend running?" };
    }
  },

  getUser: async (username: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    try {
      const response = await fetch(`/api/user/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to fetch user data" };
      }
      return data;
    } catch (error) {
      console.error("DB Get User Error:", error);
      return { success: false, message: "Connection error. Is the backend running?" };
    }
  }
};
