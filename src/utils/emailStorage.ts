const GLOBAL_EMAIL_KEY = 'global_user_email';

export const storeEmail = (email: string): void => {
  try {
    localStorage.setItem(GLOBAL_EMAIL_KEY, email);
  } catch (error) {
    console.warn('Failed to store email in localStorage:', error);
  }
};

export const getStoredEmail = (): string | null => {
  try {
    return localStorage.getItem(GLOBAL_EMAIL_KEY);
  } catch (error) {
    console.warn('Failed to retrieve email from localStorage:', error);
    return null;
  }
};

export const clearStoredEmail = (): void => {
  try {
    localStorage.removeItem(GLOBAL_EMAIL_KEY);
  } catch (error) {
    console.warn('Failed to clear email from localStorage:', error);
  }
};