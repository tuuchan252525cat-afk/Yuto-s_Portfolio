import React, { useState, useEffect } from 'react';
import { CosmosCanvas } from './components/CosmosCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectsGrid } from './components/ProjectsGrid';
import { ProfileSection } from './components/ProfileSection';
import { CareerTimeline } from './components/CareerTimeline';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { CareerManagerModal } from './components/CareerManagerModal';
import { IttaDevView } from './components/IttaDevView';
import {
  INITIAL_PROFILE,
  INITIAL_CAREER,
  INITIAL_PROJECTS,
} from './data/portfolioData';
import { Project, ProfileData, CareerItem } from './types';
import { Sparkles, Layers } from 'lucide-react';

const STORAGE_PROJECTS_KEY = 'iwamoto-portfolio-projects-v2';
const STORAGE_PROFILE_KEY = 'iwamoto-portfolio-profile-v2';
const STORAGE_CAREER_KEY = 'iwamoto-portfolio-career-v2';
const STORAGE_VIEW_MODE_KEY = 'iwamoto-portfolio-viewmode-v1';

export default function App() {
  const [viewMode, setViewMode] = useState<'simple' | 'full'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VIEW_MODE_KEY);
      if (saved === 'full' || saved === 'simple') return saved;
    } catch {
      // ignore
    }
    // Default to 'simple' (itta.dev style requested by user)
    return 'simple';
  });

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

  // Sync viewMode to localStorage
  const handleToggleViewMode = (mode: 'simple' | 'full') => {
    setViewMode(mode);
    try {
      localStorage.setItem(STORAGE_VIEW_MODE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const handleOpenProjectManager = (projectId?: string) => {
    setEditingProjectId(projectId || null);
    setIsAdminOpen(true);
  };

  // Sync projects to localStorage
  const handleSaveProjects = (newProjects: Project[]) => {
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
  };

  // Sync career to localStorage
  const handleSaveCareer = (newCareer: CareerItem[]) => {
    setCareer(newCareer);
    try {
      localStorage.setItem(STORAGE_CAREER_KEY, JSON.stringify(newCareer));
    } catch (e) {
      console.warn('Could not save career to local storage', e);
    }
  };

  const handleResetCareer = () => {
    setCareer(INITIAL_CAREER);
    try {
      localStorage.removeItem(STORAGE_CAREER_KEY);
    } catch {
      // ignore
    }
  };

  const handleResetDefaults = () => {
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
  };

  const handleUpdatePhoto = (newPhotoUrl: string) => {
    const updated = { ...profile, photoUrl: newPhotoUrl };
    setProfile(updated);
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // URL query parameter support (?id=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      if (found) {
        setSelectedProject(found);
      }
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
      {/* View Mode Switcher Pill (Floating in top-right) */}
      <aside aria-label="表示モード切替" className="fixed top-4 right-4 z-50 flex items-center bg-[#101726]/90 border border-slate-700/80 rounded-full p-1 backdrop-blur-md shadow-xl text-xs">
        <button
          onClick={() => handleToggleViewMode('simple')}
          className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
            viewMode === 'simple'
              ? 'bg-teal-300 text-teal-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="https://itta.dev 風のシンプルカード形式"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>シンプル (itta.dev風)</span>
        </button>
        <button
          onClick={() => handleToggleViewMode('full')}
          className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
            viewMode === 'full'
              ? 'bg-[#a2d7ff] text-[#05070d] font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="詳細スクロールギャラリー形式"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>詳細ギャラリー</span>
        </button>
      </aside>

      {/* RENDER VIEW ACCORDING TO VIEW MODE */}
      {viewMode === 'simple' ? (
        /* 1. SIMPLE ITTA.DEV STYLE VIEW (Requested by User) */
        <IttaDevView
          profile={profile}
          careerList={career}
          projects={projects}
          onSelectProject={handleSelectProject}
          onUpdatePhoto={handleUpdatePhoto}
          onSwitchToFullView={() => handleToggleViewMode('full')}
          onOpenCareerManager={() => setIsCareerManagerOpen(true)}
          onOpenProjectManager={handleOpenProjectManager}
        />
      ) : (
        /* 2. FULL COSMIC SCROLL EDITORIAL VIEW */
        <div className="relative min-h-screen bg-[#05070d] text-[#e2e8f0] selection:bg-[#a2d7ff] selection:text-[#05070d] overflow-x-hidden">
          {/* Interactive Cosmos Background Canvas */}
          <CosmosCanvas />

          {/* Floating Nebula Background Glows */}
          <div className="nebula nebula-a" aria-hidden="true" />
          <div className="nebula nebula-b" aria-hidden="true" />

          {/* Background Subtle Grid Texture */}
          <div className="fixed inset-0 cosmic-grid-bg pointer-events-none z-0 opacity-40" />

          {/* Primary Header & Navigation */}
          <Navbar
            onOpenContactModal={() => {
              const contactEl = document.getElementById('contact');
              contactEl?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Main Page Flow */}
          <main className="relative z-10">
            {/* 1. Hero Section (Cosmic Editorial Showcase) */}
            <HeroSection
              featuredProject={projects[0] || INITIAL_PROJECTS[0]}
              onSelectProject={handleSelectProject}
            />

            {/* 2. Works & Projects Grid */}
            <ProjectsGrid
              projects={projects}
              onSelectProject={handleSelectProject}
              onOpenProjectManager={() => handleOpenProjectManager()}
            />

            {/* 3. Profile Section (Hand-drawn sketch layout: 写真 on left, 岩本佑都 on right, 下に経歴) */}
            <ProfileSection
              profile={profile}
              onUpdatePhoto={handleUpdatePhoto}
            />

            {/* 4. Career Timeline (Starting prominently with MIYAZAKI frogs 2期生) */}
            <CareerTimeline
              careerList={career}
              onOpenCareerManager={() => setIsCareerManagerOpen(true)}
            />

            {/* 5. About & Philosophy */}
            <AboutSection />

            {/* 6. Contact Section */}
            <ContactSection
              email={profile.email}
              githubUrl={profile.githubUrl}
              instagramUrl={profile.instagramUrl}
              facebookUrl={profile.facebookUrl}
              xUrl={profile.xUrl}
            />
          </main>

          {/* Footer */}
          <Footer
            profile={profile}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onOpenCareerManager={() => setIsCareerManagerOpen(true)}
          />
        </div>
      )}

      {/* Project Detail Modal (Opens in both views) */}
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
