import React from 'react';
import { motion } from 'motion/react';
import { Compass, Lightbulb, Code2, Globe2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: Compass,
      title: '宇宙の余白と情報設計',
      desc: '要素を詰め込むのではなく、静謐な余白によって思考の巡るスペースを創出。視線が自然に導かれる明快な階層構造を構築します。',
    },
    {
      icon: Code2,
      title: 'モーション & インタラクション',
      desc: '過度な演出ではなく、触れた瞬間の心地よいレスポンスと物理的な慣性を計算。記憶に残るスムーズな手触りを追求します。',
    },
    {
      icon: Lightbulb,
      title: 'MIYAZAKI frogsの精神',
      desc: '地域から世界を見据え、本質的な課題を発見しテクノロジーで解を導く。アントレプレナーシップをすべてのクリエイティブの礎としています。',
    },
    {
      icon: Globe2,
      title: '持続可能で普遍的な造形',
      desc: '一過性のトレンドに消費されない、タイポグラフィとグリッドに基づいた端正な美意識。長期的な価値を生み出すデジタル体験を実装します。',
    },
  ];

  return (
    <section
      id="about"
      aria-label="制作思想について"
      className="relative py-28 max-w-7xl mx-auto px-6 sm:px-8 z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Heading */}
        <motion.div
          initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <span className="text-xs font-mono font-bold tracking-widest text-[#a2d7ff] uppercase">
            Philosophy
          </span>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight mt-3">
            遠い光を、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-300">
              近い体験に。
            </span>
          </h2>
          <div className="mt-6 space-y-4 text-slate-300 font-light leading-relaxed text-sm sm:text-base">
            <p>
              情報設計、タイポグラフィ、モーションを通して、見た人の記憶にやわらかく残る表現をつくります。
            </p>
            <p>
              宇宙のような奥行きと、作品をまっすぐ見せる編集的なレイアウトを両立させました。
              手描きの設計図から立ち上げた本ポートフォリオは、制作者としてのアイデンティティと未来への意志を具現化した空間です。
            </p>
          </div>
        </motion.div>

        {/* Right 4 Pillars */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, filter: 'blur(3px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-sky-400/30 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-[#a2d7ff] mb-4 group-hover:bg-[#a2d7ff] group-hover:text-[#05070d] transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#a2d7ff] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
