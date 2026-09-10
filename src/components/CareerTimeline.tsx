import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Award,
  Film,
  Cpu,
  Trophy,
  BookOpen,
  Compass,
  Edit3,
} from 'lucide-react';
import { CareerItem } from '../types';

interface CareerTimelineProps {
  careerList: CareerItem[];
  onOpenCareerManager?: () => void;
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({
  careerList,
  onOpenCareerManager,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'frogs' | 'robotics' | 'creative'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('miyazaki-frogs');

  const filteredItems = careerList.filter((item) => {
    if (activeFilter === 'frogs') return item.id === 'miyazaki-frogs';
    if (activeFilter === 'robotics') return item.id === 'wro-japan' || item.id === 'mjsa-science';
    if (activeFilter === 'creative') return item.id === 'video-production' || item.id === 'nie-movement' || item.id === 'miyazaki-hinata-tour';
    return true;
  });

  const getIconForItem = (id: string) => {
    switch (id) {
      case 'miyazaki-frogs':
        return <Sparkles className="w-3.5 h-3.5 text-white" />;
      case 'wro-japan':
        return <Trophy className="w-3.5 h-3.5 text-amber-300" />;
      case 'mjsa-science':
        return <Cpu className="w-3.5 h-3.5 text-cyan-300" />;
      case 'video-production':
        return <Film className="w-3.5 h-3.5 text-pink-300" />;
      case 'nie-movement':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-300" />;
      case 'miyazaki-hinata-tour':
        return <Compass className="w-3.5 h-3.5 text-amber-200" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-[#a2d7ff]" />;
    }
  };

  return (
    <section
      id="career"
      aria-label="経歴タイムライン"
      className="relative py-20 max-w-7xl mx-auto px-6 sm:px-8 z-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a2d7ff] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#a2d7ff] uppercase">
              Milestones & Achievements
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
            掲載経歴・活動実績
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            ご提示いただいた経歴メモを完全網羅。Miyazaki frogs、WRO Japan、MJSA宇宙コース、映像制作、NIE運動の全実績をタイムラインで掲載。
          </p>
        </div>

        {/* Filter Pills & Edit Button */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#a2d7ff] text-[#05070d] font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All 全経歴 ({careerList.length})
            </button>
            <button
              onClick={() => setActiveFilter('frogs')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'frogs'
                  ? 'bg-[#a2d7ff] text-[#05070d] font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Miyazaki frogs (AKATSUKI)
            </button>
            <button
              onClick={() => setActiveFilter('robotics')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'robotics'
                  ? 'bg-[#a2d7ff] text-[#05070d] font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ロボット・宇宙 (WRO / MJSA)
            </button>
            <button
              onClick={() => setActiveFilter('creative')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'creative'
                  ? 'bg-[#a2d7ff] text-[#05070d] font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              映像・NIE運動・探究
            </button>
          </div>

          {onOpenCareerManager && (
            <button
              onClick={onOpenCareerManager}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-teal-400/15 hover:bg-teal-400/25 text-teal-300 border border-teal-400/30 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>経歴を編集する</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Timeline Container */}
      <div className="relative pl-6 sm:pl-10">
        {/* Glowing vertical spine line */}
        <motion.div
          initial={{ scaleY: 0, originY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute left-[11px] sm:left-[19px] top-2 bottom-6 w-[2px] bg-gradient-to-b from-[#a2d7ff] via-blue-500/40 to-white/10"
        />

        <div className="space-y-10">
          {filteredItems.map((item, index) => {
            const isFrogs = item.id === 'miyazaki-frogs';
            const isWro = item.id === 'wro-japan';
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 32, filter: 'blur(3px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                whileHover={{ y: -3, transition: { duration: 0.25 } }}
                transition={{
                  duration: 0.6,
                  delay: (index % 4) * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative group"
              >
                {/* Timeline node pin */}
                <div
                  className={`absolute -left-[27px] sm:-left-[35px] top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-125 ${
                    isFrogs
                      ? 'bg-blue-600 border-[#a2d7ff] shadow-lg shadow-sky-500/50'
                      : isWro
                      ? 'bg-amber-600/80 border-amber-300 shadow-md shadow-amber-500/30'
                      : 'bg-[#05070d] border-blue-400/60 group-hover:border-[#a2d7ff]'
                  }`}
                >
                  {getIconForItem(item.id)}
                </div>

                {/* Timeline Card */}
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isFrogs
                      ? 'border-blue-400/40 bg-gradient-to-br from-blue-950/40 via-[#0a1124] to-[#05070d] shadow-xl shadow-blue-950/30 ring-1 ring-blue-400/20'
                      : isWro
                      ? 'border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-[#0c0d16] to-[#05070d] shadow-lg shadow-amber-950/20'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="p-6 sm:p-8">
                    {/* Top Row: Period & Special badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/10 text-slate-200 border border-white/10">
                          <Calendar className="w-3 h-3 text-sky-400" />
                          {item.period}
                        </span>

                        {isFrogs && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#a2d7ff] text-[#05070d]">
                            <Award className="w-3 h-3" />
                            AKATSUKI プロジェクト 2025 採択
                          </span>
                        )}

                        {isWro && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            <Trophy className="w-3 h-3 text-amber-400" />
                            全国大会出場（2025）
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-slate-400 font-mono">
                        {item.organization}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#a2d7ff] transition-colors mb-2">
                      {item.title}
                    </h3>

                    {/* Role */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-sky-200 font-medium mb-4">
                      <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                      <span>{item.role}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 leading-relaxed font-light mb-5">
                      {item.description}
                    </p>

                    {/* Highlights breakdown */}
                    <div className="space-y-2 mb-5">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a2d7ff] hover:underline cursor-pointer"
                      >
                        <span>{isExpanded ? '詳細実績をたたむ' : '実績の内訳・ハイライトを見る'}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-3 space-y-2.5 border-t border-white/10"
                          >
                            {item.highlights.map((highlight, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                              >
                                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                                <span className="leading-normal font-light">{highlight}</span>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Skills footer */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/5 text-slate-300 border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
