import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowUpRight, Filter, Edit3 } from 'lucide-react';
import { Project } from '../types';

interface ProjectsGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenProjectManager?: () => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  onSelectProject,
  onOpenProjectManager,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Video Production',
    'Robotics & Control',
    'Science & Data',
    'Web Experience',
    'Brand Website',
    'Editorial',
  ];

  const filteredProjects = projects.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section
      id="projects"
      aria-label="制作実績ギャラリー"
      className="relative py-24 max-w-7xl mx-auto px-6 sm:px-8 z-10"
    >
      {/* Intro Header matching reference site */}
      <motion.div
        initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16"
      >
        <div className="md:col-span-7">
          <p className="text-xs font-mono font-bold tracking-widest text-[#a2d7ff] uppercase mb-2">
            All Projects
          </p>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Works
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-sm text-slate-400 leading-relaxed font-light">
            作品を選ぶと、制作背景や使用技術、ビジュアルの詳細へ進めます。宇宙の静謐さとタイポグラフィの余白を融合した制作群。
          </p>
        </div>
      </motion.div>

      {/* Category Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center justify-between gap-3 mb-12"
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1 mr-2 shrink-0">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-[#05070d] font-bold shadow-md shadow-white/10'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {onOpenProjectManager && (
          <button
            onClick={onOpenProjectManager}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
            title="作品データの編集・画像変更"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#a2d7ff]" />
            <span>作品を編集・追加</span>
          </button>
        )}
      </motion.div>

      {/* Projects Grid with Staggered Visual Layout & Scroll In Animations */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            // Apply slight offset to 2nd card in each row on desktop for editorial rhythm
            const isOffset = index % 3 === 1;

            return (
              <motion.article
                layout
                initial={{ opacity: 0, y: 36, filter: 'blur(3px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
                transition={{
                  duration: 0.65,
                  delay: (index % 3) * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`group cursor-pointer flex flex-col ${
                  isOffset ? 'lg:translate-y-8' : ''
                }`}
              >
                {/* Image Card */}
                <div className="relative aspect-[1.18] rounded-xl overflow-hidden border border-white/15 bg-gradient-to-br from-slate-900 to-indigo-950/60 shadow-lg group-hover:border-sky-400/50 group-hover:shadow-sky-500/15 transition-all duration-500">
                  <img
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center filter saturate-[0.88] group-hover:scale-105 group-hover:saturate-110 group-hover:brightness-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Corner Arrow Icon */}
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#a2d7ff] group-hover:text-[#05070d] group-hover:border-transparent transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  {/* Year Tag in Image */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* Metadata below image */}
                <div className="pt-4 flex flex-col">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#a2d7ff] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <span className="text-xs text-sky-300/80 font-mono tracking-wider shrink-0">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-light">
                    {project.description}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500 font-mono truncate">
                    <span>{project.tech}</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
