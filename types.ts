export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  details: string[];
  specs: Record<string, string>;
  isSpotlight?: boolean;
  stock?: number;
  status?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

export type ModalType = 
  | 'about' 
  | 'contact' 
  | 'faq' 
  | 'blog' 
  | 'privacy' 
  | 'terms' 
  | 'shipping' 
  | 'return' 
  | 'checkout'
  | 'auth'
  | 'profile'
  | 'gmail-info'
  | 'none';

export interface UserProfile {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  isVerified: boolean;
  verificationCode?: string;
  signupDate: string;
  role?: 'Customer' | 'Admin';
}

