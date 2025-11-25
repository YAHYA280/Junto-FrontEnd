export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  imageUrl: string;
  expiresAt: Date;
  merchantName: string;
  merchantLogo?: string;
  isFeatured?: boolean;
  tags?: string[];
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
  dealsCount?: number;
}

export interface NavRoute {
  name: string;
  icon: string;
  label: string;
}

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}
