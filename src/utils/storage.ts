export const setLocalItem = (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("setLocalItem error:", e);
    }
  };
  
export const getLocalItem = <T = unknown>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as T : null;
    } catch (e) {
      console.error("getLocalItem error:", e);
      return null;
    }
  };
  
export const removeLocalItem = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("removeLocalItem error:", e);
    }
  };
  
export const setSessionItem = (key: string, value: unknown): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("setSessionItem error:", e);
    }
  };
  
export const getSessionItem = <T = unknown>(key: string): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) as T : null;
    } catch (e) {
      console.error("getSessionItem error:", e);
      return null;
    }
  };
  
export const removeSessionItem = (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.error("removeSessionItem error:", e);
    }
  };