export interface Project {
  id: string;
  title: string;
  year: string;
  category: string;
  description: string;
  longDescription?: string;
  tech: string;
  image: string;
  imageAlt?: string;
  link?: string;
  role?: string;
  client?: string;
  highlights?: string[];
  galleryImages?: string[];
}

export interface CareerItem {
  id: string;
  period: string;
  title: string;
  organization: string;
  role: string;
  description: string;
  highlights: string[];
  skills: string[];
  isHighlighted?: boolean;
  link?: string;
}

export interface ProfileData {
  nameKanji: string;
  nameRomaji: string;
  roleTitle: string;
  tagline: string;
  bio: string;
  vision: string;
  photoUrl: string;
  location: string;
  email: string;
  githubUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  frogsCohort: string;
}
