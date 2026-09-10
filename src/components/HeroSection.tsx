import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown, ExternalLink, Compass } from 'lucide-react';
import { Project } from '../types';

interface HeroSectionProps {
  featuredProject: Project;
  onSelectProject: (project: Project) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProject,
  onSelectProject,
}) => {
  return (
    <section
      id="hero"
      aria-label="ヒーローセクション"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-6 sm:px-8 z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left / Main Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          {/* Eyebrow badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-[#a2d7ff] uppercase bg-blue-500/10 border border-blue-400/20 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-sky-300" />
              Creative Portfolio
            </span>
            <span className="text-xs text-slate-400 tracking-wider">
              岩本 佑都 / Yuto Iwamoto
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
            星のあいだに、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e2e8f0] via-[#c2e2ff] to-[#7cc4ff]">
              制作の軌跡を。
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8 font-light">
            Web、映像、インタラクション。静かな宇宙の余白に、記憶に残る体験を設計します。
            宮崎から世界へ、思想とテクノロジーを結ぶデジタルクリエイティブ。
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider text-[#05070d] bg-[#a2d7ff] hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-sky-500/20"
            >
              <Compass className="w-4 h-4" />
              <span>制作実績を見る</span>
            </a>
            <a
              href="#profile"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-medium tracking-wider text-slate-200 border border-white/15 hover:border-sky-400/50 hover:text-white transition-all bg-white/[0.03] backdrop-blur-sm"
            >
              <span>プロフィール・経歴</span>
              <ArrowDown className="w-4 h-4 text-sky-400" />
            </a>
          </div>

          {/* Quick Highlight Pills */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-slate-400">
            <div>
              <span className="block text-slate-500 text-[10px] tracking-wider uppercase">Project</span>
              <span className="font-semibold text-slate-200 text-sm">Miyazaki frogs 2期 (AKATSUKI採択)</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
            <div>
              <span className="block text-slate-500 text-[10px] tracking-wider uppercase">Robotics</span>
              <span className="font-semibold text-slate-200 text-sm">WRO 全国大会出場</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
            <div>
              <span className="block text-slate-500 text-[10px] tracking-wider uppercase">Creation</span>
              <span className="font-semibold text-slate-200 text-sm">『君の52Hzが聞こえた廊下で』</span>
            </div>
          </div>
        </motion.div>

        {/* Right / Featured Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div
            onClick={() => onSelectProject(featuredProject)}
            className="group relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/10 to-white/5 cursor-pointer shadow-2xl shadow-blue-950/40 transform transition-all duration-500 hover:scale-[1.02] hover:border-sky-400/40"
          >
            {/* Visual Image */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-slate-900">
              <img
                src={featuredProject.image}
                alt={featuredProject.imageAlt || featuredProject.title}
                className="w-full h-full object-cover object-center filter saturate-90 group-hover:scale-105 group-hover:saturate-110 transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/30 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              {/* Scanline wave overlay as seen in reference */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent 0 4px, rgba(162, 215, 255, 0.15) 5px 6px)',
                }}
              />

              {/* Floating Orbit Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-black/60 backdrop-blur-md text-[#a2d7ff] border border-sky-400/30">
                  Featured Orbit / 2026
                </span>
              </div>
            </div>

            {/* Content overlay */}
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-[#a2d7ff] transition-colors">
                  {featuredProject.title}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                  {featuredProject.year}
                </span>
              </div>
              <p className="text-xs text-sky-300 mb-3 font-medium">
                {featuredProject.category}
              </p>
              <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed font-light mb-4">
                {featuredProject.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-slate-400 font-mono text-[11px] truncate max-w-[200px]">
                  {featuredProject.tech.split(',').slice(0, 2).join(' / ')}
                </span>
                <span className="inline-flex items-center gap-1 text-[#a2d7ff] group-hover:translate-x-0.5 transition-transform font-medium">
                  Explore Project <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
