import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Hammer,
  Award,
  ExternalLink,
  Sparkles,
  Send,
  Layers,
  Mail,
  Camera,
  Utensils,
  Flame,
  Edit3,
} from 'lucide-react';
import { ProfileData, CareerItem, Project } from '../types';

interface IttaDevViewProps {
  profile: ProfileData;
  careerList: CareerItem[];
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onUpdatePhoto: (newPhotoUrl: string) => void;
  onSwitchToFullView?: () => void;
  onOpenCareerManager?: () => void;
  onOpenProjectManager?: (projectId?: string) => void;
}

export const IttaDevView: React.FC<IttaDevViewProps> = ({
  profile,
  careerList,
  projects,
  onSelectProject,
  onUpdatePhoto,
  onSwitchToFullView,
  onOpenCareerManager,
  onOpenProjectManager,
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Food recommend form state
  const [foodInput, setFoodInput] = useState('');
  const [foodStatus, setFoodStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const cards = [
    { id: 'hello', title: 'こんにちは' },
    { id: 'works', title: '制作物' },
    { id: 'career', title: '経歴・活動実績' },
    { id: 'food', title: '今食べたいご飯' },
  ];

  const handleRecommendFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodInput.trim()) return;
    setFoodStatus('sending');
    setTimeout(() => {
      setFoodStatus('success');
      setFoodInput('');
      setTimeout(() => setFoodStatus('idle'), 4500);
    }, 600);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdatePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-teal-300 selection:text-teal-950 font-sans relative overflow-x-hidden">
      {/* Subtle ambient lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Main Container: Exact max-w-[800px] matching itta.dev */}
      <div className="w-full max-w-[800px] px-5 sm:px-8 md:px-9 mx-auto flex flex-col min-h-screen justify-between py-8 relative z-10">
        <div>
          {/* Top Tabs Bar: Clean, minimal pill navigation */}
          <div className="pt-4 pb-6 sm:py-8 flex flex-col items-center justify-center">
            <div className="flex items-center flex-wrap justify-center gap-2 bg-white/5 p-1.5 rounded-2xl sm:rounded-full border border-white/10 text-xs sm:text-sm shadow-lg backdrop-blur-md">
              {cards.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setCurrentCardIndex(i)}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                    currentCardIndex === i
                      ? 'bg-teal-300 text-teal-950 font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {c.id === 'food' ? '🍚 今食べたいご飯' : c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main Card Component */}
          <div className="relative rounded-2xl bg-[#101726]/95 border border-slate-700/60 p-6 sm:p-8 md:p-9 shadow-2xl backdrop-blur-md min-h-[420px] flex flex-col justify-between">
            {/* Inner Content Area */}
            <div>
              {/* Card Title with itta.dev characteristic underline badge */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="font-bold relative text-2xl inline-block before:absolute before:-left-2 before:-right-2 before:bottom-0 before:h-3.5 before:rounded-xs before:bg-slate-700 before:transform">
                  <span className="relative z-10 text-white">
                    {cards[currentCardIndex].title}
                  </span>
                </div>

                {/* Direct edit button for career card */}
                {cards[currentCardIndex].id === 'career' && onOpenCareerManager && (
                  <button
                    onClick={onOpenCareerManager}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-400/10 hover:bg-teal-400/20 text-teal-300 border border-teal-400/30 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>経歴を編集する</span>
                  </button>
                )}

                {/* Direct edit button for works card */}
                {cards[currentCardIndex].id === 'works' && onOpenProjectManager && (
                  <button
                    onClick={() => onOpenProjectManager()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-400/10 hover:bg-teal-400/20 text-teal-300 border border-teal-400/30 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>制作物を編集・追加</span>
                  </button>
                )}
              </div>

              {/* Animate Card Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={cards[currentCardIndex].id}
                  initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full pb-3"
                >
                  {/* CARD 1: こんにちは */}
                  {cards[currentCardIndex].id === 'hello' && (
                    <div className="flex justify-between md:items-start max-md:flex-col-reverse items-center gap-6">
                      {/* Left: Info Grid */}
                      <div className="flex flex-col flex-1">
                        <div className="font-bold mb-5 text-lg sm:text-xl text-white">
                          岩本 佑都 / Yuto Iwamoto{' '}
                          <span className="text-slate-400 text-sm sm:text-base font-normal">
                            (@yuto_iwamoto)
                          </span>
                        </div>

                        <div className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-4 text-sm text-slate-200">
                          {/* Tagline / Sparkle */}
                          <Sparkles className="w-[18px] h-[18px] text-teal-300 shrink-0 mt-0.5" />
                          <span className="font-semibold whitespace-pre-line text-slate-200">
                            Creator / Developer / Innovator
                          </span>

                          {/* Location */}
                          <MapPin className="w-[18px] h-[18px] text-teal-300 shrink-0 mt-0.5" />
                          <span className="font-semibold whitespace-pre-line text-slate-200">
                            Miyazaki, Japan (宮崎県)
                          </span>

                          {/* Tech / Hammer */}
                          <Hammer className="w-[18px] h-[18px] text-teal-300 shrink-0 mt-0.5" />
                          <span className="font-semibold whitespace-pre-line text-slate-200">
                            Robotics / Video Production / Web / Science
                          </span>

                          {/* Awards & History */}
                          <Award className="w-[18px] h-[18px] text-teal-300 shrink-0 mt-0.5" />
                          <div className="space-y-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                            <p className="font-semibold text-teal-200">
                              2025 Miyazaki frogs 2期 (AKATSUKI 2025 採択)
                            </p>
                            <p>
                              2024-2026 WRO Japan 南九州 準優勝・全国大会出場
                            </p>
                            <p>
                              2025 MJSA 宇宙コース・宇宙線クラス 1st / 2026 ボランティア
                            </p>
                            <p>
                              2026 動画制作『君の52Hzが聞こえた廊下で』
                            </p>
                            <p>
                              第3回 NIE宮崎県大会 クロストークパネリスト
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Iridescent Glowing Photo Container with user avatar */}
                      <div className="relative group shrink-0">
                        {/* Multi-color ambient aura blur */}
                        <div
                          className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-500 opacity-60 blur-md group-hover:opacity-85 transition-opacity"
                          aria-hidden="true"
                        />

                        {/* Photo container */}
                        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden border-2 border-white/20 bg-slate-900 shadow-xl">
                          <img
                            src={profile.photoUrl}
                            alt="岩本佑都のプロフィール画像"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />

                          {/* Scanline overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-400/5 to-slate-950/40 pointer-events-none" />

                          {/* Hover change photo button */}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs text-white gap-1 transition-opacity cursor-pointer">
                            <Camera className="w-5 h-5 text-teal-300" />
                            <span>写真を変更</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CARD 2: 制作物 (itta.dev 2-column Works style) */}
                  {cards[currentCardIndex].id === 'works' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {projects.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          className="group rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 hover:border-teal-400/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Project Thumbnail with glow */}
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-3 bg-slate-950 border border-white/5">
                              <img
                                src={p.image}
                                alt={p.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/70 text-teal-300 backdrop-blur-sm border border-white/10">
                                {p.category}
                              </span>
                            </div>

                            <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                              {p.title}
                            </h3>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2 font-light">
                              {p.description}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            {onOpenProjectManager && (
                              <button
                                onClick={() => onOpenProjectManager(p.id)}
                                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-300 transition-colors cursor-pointer"
                                title="この作品・画像の内容を編集"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>編集</span>
                              </button>
                            )}
                            <button
                              onClick={() => onSelectProject(p)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 border-b border-teal-400/40 border-dashed hover:opacity-80 transition cursor-pointer ml-auto"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>開く</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CARD 3: 経歴・活動実績 */}
                  {cards[currentCardIndex].id === 'career' && (
                    <div className="space-y-3.5">
                      {careerList.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-teal-400/30 transition-all"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-teal-300/15 text-teal-300 border border-teal-400/20">
                              {item.period}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {item.organization}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm sm:text-base text-white">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed font-light">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CARD 4: 今食べたいご飯 (Food Lover: Sushi & Indian Curry) */}
                  {cards[currentCardIndex].id === 'food' && (
                    <div className="space-y-5">
                      {/* Passion for food intro */}
                      <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-teal-300 font-bold text-sm sm:text-base mb-1.5">
                          <Utensils className="w-4 h-4" />
                          <span>食べることが人生最高のエネルギー源！</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                          制作やプログラミング、ロボットの調整で頭をフル回転させたあとに食べるご飯が何よりの至福です。
                          特に美味しく満たされる大好物のご飯には目がありません！
                        </p>
                      </div>

                      {/* Craving items list: 寿司 & インドカレー */}
                      <div>
                        <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2.5 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>今無性に食べたい大好物たち</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* 寿司 */}
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 hover:border-teal-400/40 transition-colors flex flex-col justify-between">
                            <div>
                              <div className="font-bold text-sm sm:text-base text-white flex items-center gap-2 mb-1.5">
                                <span className="text-xl">🍣</span>
                                <span>極上の寿司</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-light">
                                獲れたての旬の地魚の脂の旨味と、ほんのり温もりあるシャリの絶妙な調和。日向灘の新鮮な魚から大トロ、赤身、サーモンまで。制作や開発を頑張った後の最高のご褒美です。
                              </p>
                            </div>
                            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-teal-300 font-medium">
                              <span>🐟 旬のネタ・青島地魚・赤身漬け</span>
                            </div>
                          </div>

                          {/* インドカレー */}
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 hover:border-teal-400/40 transition-colors flex flex-col justify-between">
                            <div>
                              <div className="font-bold text-sm sm:text-base text-white flex items-center gap-2 mb-1.5">
                                <span className="text-xl">🍛</span>
                                <span>本格インドカレー</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-light">
                                タンドール窯で香ばしく焼き上げられた熱々の巨大ナンを、何種類ものスパイスをじっくり煮込んだバターチキンやキーマ、マトンカレーにたっぷり絡めて食べる至福。香辛料で疲労が一気に吹き飛びます。
                              </p>
                            </div>
                            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                              <span>🫓 焼きたてチーズナン & バターチキン</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommend Food Form (itta.dev style) */}
                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-xs font-semibold text-white mb-1">
                          美味しいご飯・おすすめのお店を教えてください！
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2.5">
                          美味しい寿司屋や絶品インドカレー店、全国のおすすめグルメ情報なら何でも大歓迎です！食べに行きます。
                        </p>

                        <form onSubmit={handleRecommendFood} className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="おすすめの店名、カレーや寿司のイチオシなど..."
                              value={foodInput}
                              onChange={(e) => setFoodInput(e.target.value)}
                              disabled={foodStatus === 'sending'}
                              className="flex-1 bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                            />
                            <button
                              type="submit"
                              disabled={foodStatus === 'sending' || !foodInput.trim()}
                              className="cursor-pointer active:scale-[98%] inline-flex font-bold items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-xs sm:text-sm transition-all bg-teal-300 hover:bg-teal-200 text-teal-900 px-3.5 py-2 disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{foodStatus === 'sending' ? '送信中...' : 'おすすめする 🍽️'}</span>
                            </button>
                          </div>

                          {foodStatus === 'success' && (
                            <p className="text-xs text-teal-300 font-medium">
                              ✓ うわぁ、めっちゃ美味しそう…！メモしました、必ず食べに行きます！😋🍽️
                            </p>
                          )}
                        </form>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Bar: 3 Rounded Square Social Buttons matching itta.dev */}
        <div className="my-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {/* X (Twitter) */}
            <a
              href={profile.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-md bg-white/10 border-t border-l border-white/5 hover:border-white/50 active:bg-teal-300 text-white hover:bg-teal-200 hover:text-teal-900 hover:shadow-lg hover:shadow-teal-500/40 transition-all flex items-center justify-center cursor-pointer"
              title="X (Twitter)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href={profile.githubUrl || 'https://github.com/tuuchan252525cat-afk/'}
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-md bg-white/10 border-t border-l border-white/5 hover:border-white/50 active:bg-teal-300 text-white hover:bg-teal-200 hover:text-teal-900 hover:shadow-lg hover:shadow-teal-500/40 transition-all flex items-center justify-center cursor-pointer"
              title="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={profile.instagramUrl || 'https://www.instagram.com/yuto.2525727/'}
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-md bg-white/10 border-t border-l border-white/5 hover:border-white/50 active:bg-teal-300 text-white hover:bg-teal-200 hover:text-teal-900 hover:shadow-lg hover:shadow-teal-500/40 transition-all flex items-center justify-center cursor-pointer"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={profile.facebookUrl || 'https://www.facebook.com/profile.php?id=61577826275908'}
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-md bg-white/10 border-t border-l border-white/5 hover:border-white/50 active:bg-teal-300 text-white hover:bg-teal-200 hover:text-teal-900 hover:shadow-lg hover:shadow-teal-500/40 transition-all flex items-center justify-center cursor-pointer"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Email / Mail */}
            <a
              href={`mailto:${profile.email}`}
              className="size-10 rounded-md bg-white/10 border-t border-l border-white/5 hover:border-white/50 active:bg-teal-300 text-white hover:bg-teal-200 hover:text-teal-900 hover:shadow-lg hover:shadow-teal-500/40 transition-all flex items-center justify-center cursor-pointer"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct button to open Project Manager */}
            {onOpenProjectManager && (
              <button
                onClick={() => onOpenProjectManager()}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 font-mono transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/5"
                title="制作物・画像の追加と編集"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">作品を編集</span>
              </button>
            )}

            {/* Direct button to open Career Manager */}
            {onOpenCareerManager && (
              <button
                onClick={onOpenCareerManager}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 font-mono transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/5"
                title="経歴・活動実績を編集"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">経歴を編集</span>
              </button>
            )}

            {/* Switch to Full / Cosmic View toggle */}
            {onSwitchToFullView && (
              <button
                onClick={onSwitchToFullView}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 font-mono transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>詳細表示に切替</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
