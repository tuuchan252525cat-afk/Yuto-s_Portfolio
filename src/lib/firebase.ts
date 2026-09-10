import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { Project, CareerItem, ProfileData } from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_CAREER,
  INITIAL_PROFILE,
} from '../data/portfolioData';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db: Firestore = getFirestore(
  app,
  firebaseConfigData.firestoreDatabaseId || '(default)'
);

// Collections
export const PROJECTS_COLLECTION = 'projects';
export const CAREERS_COLLECTION = 'careers';
export const PROFILE_COLLECTION = 'profile';
export const INQUIRIES_COLLECTION = 'inquiries';

// ----------------------------------------------------
// Realtime Projects Sync
// ----------------------------------------------------
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onError?: (error: Error) => void
) {
  const projectsCol = collection(db, PROJECTS_COLLECTION);
  return onSnapshot(
    projectsCol,
    async (snapshot) => {
      if (snapshot.empty) {
        // First-time seed
        console.log('Seeding initial projects to Firestore...');
        try {
          await seedInitialProjects();
        } catch (e) {
          console.warn('Could not auto-seed projects', e);
        }
        onUpdate(INITIAL_PROJECTS);
      } else {
        const loaded: Project[] = [];
        snapshot.forEach((d) => {
          loaded.push({ ...(d.data() as Project), id: d.id });
        });
        // Sort if needed by order or year
        onUpdate(loaded);
      }
    },
    (err) => {
      console.warn('Firestore projects subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export async function seedInitialProjects() {
  const batch = writeBatch(db);
  for (const project of INITIAL_PROJECTS) {
    const docRef = doc(db, PROJECTS_COLLECTION, project.id);
    batch.set(docRef, project, { merge: true });
  }
  await batch.commit();
}

export async function saveProjectToFirestore(project: Project) {
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  await setDoc(
    docRef,
    {
      ...project,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function deleteProjectFromFirestore(projectId: string) {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await deleteDoc(docRef);
}

export async function saveAllProjectsToFirestore(projects: Project[]) {
  const batch = writeBatch(db);
  for (const p of projects) {
    const docRef = doc(db, PROJECTS_COLLECTION, p.id);
    batch.set(docRef, { ...p, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
}

// ----------------------------------------------------
// Realtime Career Sync
// ----------------------------------------------------
export function subscribeToCareer(
  onUpdate: (career: CareerItem[]) => void,
  onError?: (error: Error) => void
) {
  const careerCol = collection(db, CAREERS_COLLECTION);
  return onSnapshot(
    careerCol,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log('Seeding initial career items to Firestore...');
        try {
          await seedInitialCareer();
        } catch (e) {
          console.warn('Could not auto-seed career', e);
        }
        onUpdate(INITIAL_CAREER);
      } else {
        const loaded: CareerItem[] = [];
        snapshot.forEach((d) => {
          loaded.push({ ...(d.data() as CareerItem), id: d.id });
        });
        onUpdate(loaded);
      }
    },
    (err) => {
      console.warn('Firestore career subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export async function seedInitialCareer() {
  const batch = writeBatch(db);
  for (const item of INITIAL_CAREER) {
    const docRef = doc(db, CAREERS_COLLECTION, item.id);
    batch.set(docRef, item, { merge: true });
  }
  await batch.commit();
}

export async function saveCareerItemToFirestore(item: CareerItem) {
  const docRef = doc(db, CAREERS_COLLECTION, item.id);
  await setDoc(
    docRef,
    {
      ...item,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function deleteCareerItemFromFirestore(itemId: string) {
  const docRef = doc(db, CAREERS_COLLECTION, itemId);
  await deleteDoc(docRef);
}

export async function saveAllCareerToFirestore(careerItems: CareerItem[]) {
  const batch = writeBatch(db);
  for (const item of careerItems) {
    const docRef = doc(db, CAREERS_COLLECTION, item.id);
    batch.set(docRef, { ...item, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
}

// ----------------------------------------------------
// Realtime Profile Sync
// ----------------------------------------------------
export function subscribeToProfile(
  onUpdate: (profile: ProfileData) => void,
  onError?: (error: Error) => void
) {
  const profileDoc = doc(db, PROFILE_COLLECTION, 'main');
  return onSnapshot(
    profileDoc,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(profileDoc, INITIAL_PROFILE, { merge: true });
        } catch (e) {
          console.warn('Could not seed profile', e);
        }
        onUpdate(INITIAL_PROFILE);
      } else {
        onUpdate(snapshot.data() as ProfileData);
      }
    },
    (err) => {
      console.warn('Firestore profile subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveProfileToFirestore(profile: ProfileData) {
  const docRef = doc(db, PROFILE_COLLECTION, 'main');
  await setDoc(docRef, { ...profile, updatedAt: new Date().toISOString() }, { merge: true });
}

// ----------------------------------------------------
// Contact Inquiries
// ----------------------------------------------------
export interface ContactInquiry {
  name: string;
  email: string;
  subject?: string;
  category?: string;
  message: string;
  createdAt?: string;
}

export async function submitContactInquiry(inquiry: ContactInquiry) {
  const inquiriesCol = collection(db, INQUIRIES_COLLECTION);
  return await addDoc(inquiriesCol, {
    ...inquiry,
    createdAt: new Date().toISOString(),
    serverTimestamp: serverTimestamp(),
  });
}
