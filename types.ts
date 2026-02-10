

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum SectionId {
  HERO = 'hero',
  ABOUT = 'about',
  WORK = 'work',
  CONTACT = 'contact'
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Augment the global JSX namespace to allow all HTML and custom elements
// This fixes "Property '...' does not exist on type 'JSX.IntrinsicElements'" errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
