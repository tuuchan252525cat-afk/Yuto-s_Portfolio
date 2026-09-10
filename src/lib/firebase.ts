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
import { Project, CareerItem, ProfileData, FoodRecommendation } from '../types';
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
export const FOOD_COLLECTION = 'food_recommendations';

// ----------------------------------------------------
// Realtime Projects Sync
// ----------------------------------------------------
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onError?: (error: Error) => void
) {
  const projectsCol = collection(db, PROJECTS_COLLECTION);
  let isFirstLoad = true;
  return onSnapshot(
    projectsCol,
    async (snapshot) => {
      if (snapshot.empty) {
        if (isFirstLoad) {
          isFirstLoad = false;
          // First-time seed
          console.log('Seeding initial projects to Firestore...');
          try {
            await seedInitialProjects();
          } catch (e) {
            console.warn('Could not auto-seed projects', e);
          }
          onUpdate(INITIAL_PROJECTS);
        } else {
          onUpdate([]);
        }
      } else {
        isFirstLoad = false;
        const loaded: (Project & { order?: number })[] = [];
        snapshot.forEach((d) => {
          loaded.push({ ...(d.data() as Project), id: d.id });
        });
        // Sort by order
        loaded.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
  INITIAL_PROJECTS.forEach((project, index) => {
    const docRef = doc(db, PROJECTS_COLLECTION, project.id);
    batch.set(docRef, { ...project, order: index, updatedAt: new Date().toISOString() }, { merge: true });
  });
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
  try {
    const projectsCol = collection(db, PROJECTS_COLLECTION);
    const snapshot = await getDocs(projectsCol);
    const newProjectIds = new Set(projects.map((p) => p.id));

    const batch = writeBatch(db);

    // Delete removed documents from Firestore
    for (const docSnap of snapshot.docs) {
      if (!newProjectIds.has(docSnap.id)) {
        batch.delete(docSnap.ref);
      }
    }

    // Upsert remaining projects with explicit order
    projects.forEach((p, index) => {
      const docRef = doc(db, PROJECTS_COLLECTION, p.id);
      batch.set(docRef, { ...p, order: index, updatedAt: new Date().toISOString() }, { merge: true });
    });

    await batch.commit();
  } catch (err) {
    console.error('Error saving projects to Firestore:', err);
    throw err;
  }
}

// ----------------------------------------------------
// Realtime Career Sync
// ----------------------------------------------------
export function subscribeToCareer(
  onUpdate: (career: CareerItem[]) => void,
  onError?: (error: Error) => void
) {
  const careerCol = collection(db, CAREERS_COLLECTION);
  let isFirstLoad = true;
  return onSnapshot(
    careerCol,
    async (snapshot) => {
      if (snapshot.empty) {
        if (isFirstLoad) {
          isFirstLoad = false;
          console.log('Seeding initial career items to Firestore...');
          try {
            await seedInitialCareer();
          } catch (e) {
            console.warn('Could not auto-seed career', e);
          }
          onUpdate(INITIAL_CAREER);
        } else {
          onUpdate([]);
        }
      } else {
        isFirstLoad = false;
        const loaded: (CareerItem & { order?: number })[] = [];
        snapshot.forEach((d) => {
          loaded.push({ ...(d.data() as CareerItem), id: d.id });
        });
        loaded.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
  INITIAL_CAREER.forEach((item, index) => {
    const docRef = doc(db, CAREERS_COLLECTION, item.id);
    batch.set(docRef, { ...item, order: index, updatedAt: new Date().toISOString() }, { merge: true });
  });
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
  try {
    const careerCol = collection(db, CAREERS_COLLECTION);
    const snapshot = await getDocs(careerCol);
    const newIds = new Set(careerItems.map((c) => c.id));

    const batch = writeBatch(db);

    // Delete removed items
    for (const docSnap of snapshot.docs) {
      if (!newIds.has(docSnap.id)) {
        batch.delete(docSnap.ref);
      }
    }

    // Upsert remaining career items with order
    careerItems.forEach((c, index) => {
      const docRef = doc(db, CAREERS_COLLECTION, c.id);
      batch.set(docRef, { ...c, order: index, updatedAt: new Date().toISOString() }, { merge: true });
    });

    await batch.commit();
  } catch (err) {
    console.error('Error saving career to Firestore:', err);
    throw err;
  }
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

// ----------------------------------------------------
// Food Recommendations
// ----------------------------------------------------
export function subscribeToFoodRecommendations(
  onUpdate: (items: FoodRecommendation[]) => void,
  onError?: (error: Error) => void
) {
  const foodCol = collection(db, FOOD_COLLECTION);
  return onSnapshot(
    foodCol,
    (snapshot) => {
      const items: FoodRecommendation[] = [];
      snapshot.forEach((d) => {
        items.push({
          id: d.id,
          ...(d.data() as Omit<FoodRecommendation, 'id'>),
        });
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore food recommendations subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export async function submitFoodRecommendation(food: {
  foodName: string;
  restaurantOrArea?: string;
  notes?: string;
}) {
  const foodCol = collection(db, FOOD_COLLECTION);
  return await addDoc(foodCol, {
    ...food,
    status: 'want_to_try',
    createdAt: new Date().toISOString(),
    serverTimestamp: serverTimestamp(),
  });
}

export async function updateFoodRecommendationStatus(
  id: string,
  status: 'want_to_try' | 'visited' | 'favorite'
) {
  const docRef = doc(db, FOOD_COLLECTION, id);
  await setDoc(docRef, { status, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deleteFoodRecommendation(id: string) {
  const docRef = doc(db, FOOD_COLLECTION, id);
  await deleteDoc(docRef);
}
