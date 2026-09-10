import React, { useState, useEffect } from 'react';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { CareerManagerModal } from './components/CareerManagerModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { IttaDevView } from './components/IttaDevView';
import {
  INITIAL_PROFILE,
  INITIAL_CAREER,
  INITIAL_PROJECTS,
} from './data/portfolioData';
import { Project, ProfileData, CareerItem } from './types';
import {
  subscribeToProjects,
  subscribeToCareer,
  subscribeToProfile,
  saveAllProjectsToFirestore,
  saveAllCareerToFirestore,
  saveProfileToFirestore,
} from './lib/firebase';

const STORAGE_PROJECTS_KEY = 'iwamoto-portfolio-projects-v2';
const STORAGE_PROFILE_KEY = 'iwamoto-portfolio-profile-v2';
const STORAGE_CAREER_KEY = 'iwamoto-portfolio-career-v2';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall through to initial
    }
    return INITIAL_PROJECTS;
  });

  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.photoUrl || parsed.photoUrl.includes('unsplash.com')) {
          parsed.photoUrl = '/profile_avatar.jpg';
        }
        parsed.githubUrl = 'https://github.com/tuuchan252525cat-afk/';
        parsed.instagramUrl = 'https://www.instagram.com/yuto.2525727/';
        parsed.facebookUrl = 'https://www.facebook.com/profile.php?id=61577826275908';
        return parsed;
      }
    } catch {
      // Fall through to initial
    }
    return INITIAL_PROFILE;
  });

  const [career, setCareer] = useState<CareerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CAREER_KEY);
      if (saved) {
        const parsed: CareerItem[] = JSON.parse(saved);
        const tour = parsed.find((item) => item.id === 'miyazaki-hinata-tour');
        if (tour && (!tour.description.includes('大阪万博') || tour.description.includes('豊かな自然環境'))) {
          tour.description = '宮崎県から、小中学生とともに科学技術を学びに大阪万博やカップヌードルミュージアムを訪問。新たな視点の探究を行った。';
          tour.highlights = [
            '小中学生とともに大阪万博を訪問し最先端の科学技術を探究',
            'カップヌードルミュージアムでの創造的思考・発明プロセスの学習',
            '宮崎から関西へのフィールドワークを通じた新たな視点の探究と実践',
          ];
          tour.skills = ['科学技術探究', '大阪万博', 'カップヌードルミュージアム', 'フィールドワーク', '創造的探究'];
        }
        return parsed;
      }
    } catch {
      // Fall through to initial
    }
    return INITIAL_CAREER;
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isCareerManagerOpen, setIsCareerManagerOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [adminPortalTab, setAdminPortalTab] = useState<'food' | 'projects' | 'career' | 'profile'>('food');

  const handleOpenProjectManager = (projectId?: string) => {
    setEditingProjectId(projectId || null);
    setIsAdminOpen(true);
  };

  const handleOpenAdminPortal = (tab: 'food' | 'projects' | 'career' | 'profile' = 'food') => {
    setAdminPortalTab(tab);
    setIsAdminPortalOpen(true);
  };

  // Realtime Cloud Synchronization with Firebase Firestore
  useEffect(() => {
    const unsubProjects = subscribeToProjects((loadedProjects) => {
      if (loadedProjects && loadedProjects.length > 0) {
        setProjects(loadedProjects);
        try {
          localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(loadedProjects));
        } catch {
          // ignore
        }
      }
    });

    const unsubCareer = subscribeToCareer((loadedCareer) => {
      if (loadedCareer && loadedCareer.length > 0) {
        setCareer(loadedCareer);
        try {
          localStorage.setItem(STORAGE_CAREER_KEY, JSON.stringify(loadedCareer));
        } catch {
          // ignore
        }
      }
    });

    const unsubProfile = subscribeToProfile((loadedProfile) => {
      if (loadedProfile) {
        setProfile(loadedProfile);
        try {
          localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(loadedProfile));
        } catch {
          // ignore
        }
      }
    });

    return () => {
      unsubProjects();
      unsubCareer();
      unsubProfile();
    };
  }, []);

  // Sync projects to Firestore + localStorage
  const handleSaveProjects = async (newProjects: Project[]) => {
    setProjects(newProjects);
    if (selectedProject) {
      const refreshed = newProjects.find((p) => p.id === selectedProject.id);
      if (refreshed) setSelectedProject(refreshed);
    }
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(newProjects));
    } catch (e) {
      console.warn('Could not save projects to local storage', e);
    }
    try {
      await saveAllProjectsToFirestore(newProjects);
    } catch (e) {
      console.warn('Could not save projects to Firestore', e);
    }
  };

  // Sync career to Firestore + localStorage
  const handleSaveCareer = async (newCareer: CareerItem[]) => {
    setCareer(newCareer);
    try {
      localStorage.setItem(STORAGE_CAREER_KEY, JSON.stringify(newCareer));
    } catch (e) {
      console.warn('Could not save career to local storage', e);
    }
    try {
      await saveAllCareerToFirestore(newCareer);
    } catch (e) {
      console.warn('Could not save career to Firestore', e);
    }
  };

  const handleResetCareer = async () => {
    setCareer(INITIAL_CAREER);
    try {
      localStorage.removeItem(STORAGE_CAREER_KEY);
    } catch {
      // ignore
    }
    try {
      await saveAllCareerToFirestore(INITIAL_CAREER);
    } catch (e) {
      console.warn('Could not reset career in Firestore', e);
    }
  };

  const handleResetDefaults = async () => {
    setProjects(INITIAL_PROJECTS);
    setProfile(INITIAL_PROFILE);
    setCareer(INITIAL_CAREER);
    try {
      localStorage.removeItem(STORAGE_PROJECTS_KEY);
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      localStorage.removeItem(STORAGE_CAREER_KEY);
    } catch {
      // ignore
    }
    try {
      await saveAllProjectsToFirestore(INITIAL_PROJECTS);
      await saveAllCareerToFirestore(INITIAL_CAREER);
      await saveProfileToFirestore(INITIAL_PROFILE);
    } catch (e) {
      console.warn('Could not reset defaults in Firestore', e);
    }
  };

  const handleSaveProfile = async (newProfile: ProfileData) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
    } catch {
      // ignore
    }
    try {
      await saveProfileToFirestore(newProfile);
    } catch (e) {
      console.warn('Could not save profile to Firestore', e);
    }
  };

  const handleUpdatePhoto = async (newPhotoUrl: string) => {
    const updated = { ...profile, photoUrl: newPhotoUrl };
    await handleSaveProfile(updated);
  };

  // URL query parameter & hash support (?id=... / #admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      if (found) {
        setSelectedProject(found);
      }
    }
    if (params.get('admin') === 'true' || window.location.hash === '#admin') {
      setIsAdminPortalOpen(true);
    }
  }, [projects]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    const url = new URL(window.location.href);
    url.searchParams.set('id', project.id);
    window.history.pushState({}, '', url.toString());
  };

  const handleCloseProjectModal = () => {
    setSelectedProject(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url.toString());
  };

  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    handleSelectProject(projects[nextIndex]);
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    handleSelectProject(projects[prevIndex]);
  };

  return (
    <>
      {/* High-craft Simple Card Experience (itta.dev style) */}
      <IttaDevView
        profile={profile}
        careerList={career}
        projects={projects}
        onSelectProject={handleSelectProject}
        onUpdatePhoto={handleUpdatePhoto}
        onOpenCareerManager={() => setIsCareerManagerOpen(true)}
        onOpenProjectManager={handleOpenProjectManager}
        onOpenAdminPortal={handleOpenAdminPortal}
      />

      {/* Dedicated Admin & Food Management Portal Modal */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        profile={profile}
        projects={projects}
        careerList={career}
        onSaveProfile={handleSaveProfile}
        onSaveProjects={handleSaveProjects}
        onSaveCareer={handleSaveCareer}
        onOpenProjectManager={(id) => {
          handleOpenProjectManager(id);
        }}
        onOpenCareerManager={() => {
          setIsCareerManagerOpen(true);
        }}
        initialTab={adminPortalTab}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={handleCloseProjectModal}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
        onEditProject={(p) => {
          handleCloseProjectModal();
          handleOpenProjectManager(p.id);
        }}
      />

      {/* Project Manager CMS Modal */}
      <ProjectManagerModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setEditingProjectId(null);
        }}
        projects={projects}
        initialProjectId={editingProjectId}
        onSaveProjects={handleSaveProjects}
        onResetDefaults={handleResetDefaults}
      />

      {/* Career Manager CMS Modal */}
      <CareerManagerModal
        isOpen={isCareerManagerOpen}
        onClose={() => setIsCareerManagerOpen(false)}
        careerList={career}
        onSaveCareer={handleSaveCareer}
        onResetDefaults={handleResetCareer}
      />
    </>
  );
}
