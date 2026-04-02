export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  purpose: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  deliverables: string[];
  icon: string;
  sortOrder: number;
  published: boolean;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "news" | "article" | "newsletter";
  imageUrl: string | null;
  publishDate: string | null;
  published: boolean;
  createdAt: Date;
}

export interface WorkItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category:
    | "strategic-planning"
    | "procedural-guides"
    | "annual-plans"
    | "community-initiatives"
    | "motion-graphics";
  imageUrl: string | null;
  fileUrl: string | null;
  published: boolean;
  createdAt: Date;
}

export interface DigitalSolution {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  solutionType: "case-study" | "publication" | "platform";
  imageUrl: string | null;
  link: string | null;
  published: boolean;
  createdAt: Date;
}
