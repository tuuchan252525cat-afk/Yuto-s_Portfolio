import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Calendar, Layers, Sparkles, ChevronLeft, ChevronRight, User, Edit3 } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onEditProject?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onNext,
  onPrev,
  onEditProject,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  const techList = project.tech.split(',').map((t) => t.trim());

  return (
    <AnimatePresence>
      <div
        id="project-detail-modal"
        className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#05070d]/90 backdrop-blur-xl"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#090d18] border border-white/20 shadow-2xl shadow-black text-slate-200 z-10 scrollbar-thin"
        >
          {/* Sticky Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#090d18]/95 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold tracking-wider text-[#a2d7ff] uppercase">
                {project.category}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400">
                {project.year}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onEditProject && (
                <button
                  onClick={() => onEditProject(project)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-400/15 hover:bg-teal-400/25 text-teal-300 border border-teal-400/30 transition-all cursor-pointer mr-1"
                  title="この作品を編集する"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>作品を編集</span>
                </button>
              )}
              {onPrev && (
                <button
                  onClick={onPrev}
                  aria-label="前の作品"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  aria-label="次の作品"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="閉じる"
                className="ml-2 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-10">
            {/* Title & Introduction */}
            <div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
                {project.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                {project.description}
              </p>
            </div>

            {/* Main Visual Image */}
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl aspect-[16/10] bg-slate-950 relative group">
              <img
                src={project.image}
                alt={project.imageAlt || project.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/60 to-transparent pointer-events-none" />
            </div>

            {/* Split Visual Images (as in reference site) */}
            {project.galleryImages && project.galleryImages.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.galleryImages.slice(0, 2).map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden border border-white/10 aspect-[4/3] bg-slate-950"
                  >
                    <img
                      src={imgUrl}
                      alt={`${project.title} Visual ${idx + 1}`}
                      className="w-full h-full object-cover filter saturate-90 hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Detailed Project Notes */}
            <div className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <span className="text-xs font-mono font-bold tracking-widest text-[#a2d7ff] uppercase">
                  Project Note
                </span>
                <h3 className="text-xl font-bold text-white mt-1 mb-4">
                  作品背景・設計
                </h3>

                {project.role && (
                  <div className="mb-4">
                    <span className="block text-[11px] text-slate-500 font-mono uppercase">Role</span>
                    <span className="text-sm font-medium text-slate-200">{project.role}</span>
                  </div>
                )}

                {project.client && (
                  <div className="mb-4">
                    <span className="block text-[11px] text-slate-500 font-mono uppercase">Client / Context</span>
                    <span className="text-sm font-medium text-slate-200">{project.client}</span>
                  </div>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#a2d7ff] text-[#05070d] hover:bg-white transition-colors"
                  >
                    <span>Visit Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="md:col-span-8 space-y-6">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                  {project.longDescription || project.description}
                </p>

                {project.highlights && project.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                      Key Highlights & Implementation
                    </h4>
                    <ul className="space-y-2">
                      {project.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                          <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {techList.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-sky-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
