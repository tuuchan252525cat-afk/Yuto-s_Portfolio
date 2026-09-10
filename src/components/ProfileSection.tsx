import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, MapPin, Mail, Award, CheckCircle2, Sparkles, ArrowDown } from 'lucide-react';
import { ProfileData } from '../types';

interface ProfileSectionProps {
  profile: ProfileData;
  onUpdatePhoto?: (newPhotoUrl: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onUpdatePhoto,
}) => {
  const [photoError, setPhotoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCustomPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdatePhoto) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdatePhoto(reader.result);
        setPhotoError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="profile"
      aria-label="プロフィールセクション"
      className="relative py-20 md:py-28 max-w-7xl mx-auto px-6 sm:px-8 z-10"
    >
      {/* Section Header */}
      <div className="mb-12">
        <span className="text-xs font-mono font-bold tracking-widest text-[#a2d7ff] uppercase">
          Profile & Philosophy
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
          About Creator
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          手描きスケッチの構想を忠実に再現したプロフィールと制作理念
        </p>
      </div>

      {/* Main Profile Layout based on the sketch:
          [ 写真 (Photo) ]   [ 岩本 佑都 (Yuto Iwamoto) ]
      */}
      <div className="relative rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Subtle decorative glow in top-right */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left: 写真 (Photo) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <div
              className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-slate-900 transition-all duration-500 hover:border-[#a2d7ff]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {!photoError && profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.nameKanji}
                  referrerPolicy="no-referrer"
                  onError={() => setPhotoError(true)}
                  className="w-full h-full object-cover object-center filter saturate-[0.95] group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-blue-300">岩本</span>
                  </div>
                  <span className="text-xs font-medium text-slate-300">写真 (Photo)</span>
                  <span className="text-[11px] text-slate-500 mt-1">{profile.nameKanji}</span>
                </div>
              )}

              {/* Scanline overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent 0 3px, rgba(162, 215, 255, 0.1) 4px 5px)',
                }}
              />

              {/* Photo change overlay */}
              <label
                htmlFor="profile-photo-input"
                className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white p-4 text-center z-10"
              >
                <Camera className="w-6 h-6 text-[#a2d7ff] mb-1.5" />
                <span className="text-xs font-semibold">写真を変更する</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Click to upload photo</span>
              </label>
              <input
                type="file"
                id="profile-photo-input"
                accept="image/*"
                onChange={handleCustomPhoto}
                className="hidden"
              />

              {/* Status Badge */}
              <div className="absolute bottom-2 left-2 z-20">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active / 2026
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{profile.location}</span>
            </div>
          </div>

          {/* Right: 岩本 佑都 (Name & Details) */}
          <div className="md:col-span-8 flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-[#a2d7ff] border border-blue-400/30">
                <Sparkles className="w-3 h-3 text-sky-400" />
                {profile.frogsCohort}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {profile.roleTitle}
              </span>
            </div>

            {/* Kanji & Romaji Name */}
            <div className="mb-4">
              <div className="flex items-baseline gap-4 flex-wrap">
                <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                  {profile.nameKanji}
                </h3>
                <span className="text-lg sm:text-xl font-light tracking-widest text-slate-400 uppercase">
                  {profile.nameRomaji}
                </span>
              </div>
              <p className="text-sm sm:text-base text-sky-200 mt-2 font-medium">
                {profile.tagline}
              </p>
            </div>

            {/* Bio */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light mb-6">
              {profile.bio}
            </p>

            {/* Vision statement */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 mb-6">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                “{profile.vision}”
              </p>
            </div>

            {/* Skills & Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                'Miyazaki frogs 2期 (AKATSUKI 2025採択)',
                'WRO Japan 全国大会出場 (エキスパート準優勝)',
                'MJSA 宇宙コース・宇宙線クラス 1st',
                '動画制作『君の52Hzが聞こえた廊下で』',
                '第3回 NIE宮崎県大会 パネリスト',
                'ロボット工学 & プログラミング',
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-slate-300 hover:border-[#a2d7ff]/40 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Transition indicator matching the hand-drawn sketch:
            Wavy line separator + Downward Arrow labeled "下に経歴" (Timeline Below)
        */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/25 text-[#a2d7ff] text-xs font-semibold tracking-wider">
            <ArrowDown className="w-4 h-4 animate-bounce text-sky-400" />
            <span>下に経歴 (Career Timeline)</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-sky-400" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            手描き図面の矢印指示に基づき、MIYAZAKI frogs 2期生からの軌跡を時系列で展開
          </p>
        </div>
      </div>
    </section>
  );
};
