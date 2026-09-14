export interface Profile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  avatar_url: string;
  resume_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  sort_order: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  sort_order: number;
  created_at?: string;
}

export interface Experience {
  id: string;
  institution: string;
  role: string;
  year_start: string;
  year_end: string;
  location: string;
  description: string;
  sort_order: number;
  created_at?: string;
}

export interface Course {
  id: string;
  name: string;
  organizer: string;
  year: string;
  location: string;
  description: string;
  sort_order: number;
  created_at?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  sort_order: number;
  created_at?: string;
}

export type ContactType = 'whatsapp' | 'email' | 'instagram' | 'linkedin';

export interface Contact {
  id: string;
  type: ContactType;
  value: string;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  courses: Course[];
  languages: Language[];
  contacts: Contact[];
}
