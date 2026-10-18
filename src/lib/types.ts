export type Review = {
  id: string;
  name: string | null;
  role: string | null;
  company: string | null;
  rating: number;
  message: string;
  anonymous: boolean;
  published: boolean;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  reason: string;
  message: string;
  createdAt: string;
  emailed: boolean;
};

export type NewReview = {
  name?: string | null;
  role?: string | null;
  company?: string | null;
  rating: number;
  message: string;
  anonymous: boolean;
};

export type NewContactMessage = {
  name: string;
  email: string;
  reason: string;
  message: string;
};
