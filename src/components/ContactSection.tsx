import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, CheckCircle2, Copy, Check, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';

interface ContactSectionProps {
  email?: string;
  githubUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  xUrl?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  email = 'yuto.iwamoto.work@gmail.com',
  githubUrl = 'https://github.com/tuuchan252525cat-afk/',
  instagramUrl = 'https://www.instagram.com/yuto.2525727/',
  facebookUrl = 'https://www.facebook.com/profile.php?id=61577826275908',
  xUrl = 'https://x.com',
}) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Web制作・コラボレーションのご相談',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: 'Web制作・コラボレーションのご相談',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 6000);
    }, 900);
  };

  return (
    <section
      id="contact"
      aria-label="コンタクトセクション"
      className="relative py-28 max-w-7xl mx-auto px-6 sm:px-8 border-t border-white/10 z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Side: Headline & Mail Link */}
        <motion.div
          initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 space-y-6"
        >
          <span className="text-xs font-mono font-bold tracking-widest text-[#a2d7ff] uppercase">
            Contact
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            次の軌道を、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-sky-400">
              一緒に描きましょう。
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-lg">
            新規プロジェクトのご依頼、クリエイティブ開発やUI設計に関するご相談、MIYAZAKI frogs関連のネットワーキングなど、お気軽にご連絡ください。
          </p>

          {/* Big Email Link */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-xl sm:text-2xl font-mono text-[#a2d7ff] border-b border-[#a2d7ff]/50 hover:border-[#a2d7ff] pb-1 transition-all group"
            >
              <span>{email}</span>
              <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            <button
              onClick={handleCopyEmail}
              aria-label="メールアドレスをコピー"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Social Profiles */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-mono text-slate-400 mr-1">Social:</span>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              title="GitHub"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              title="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              title="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>

            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              title="X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X</span>
            </a>
          </div>

          <div className="pt-6 flex items-center gap-6 text-xs text-slate-400 font-mono">
            <span>Response time: Within 24-48 hours</span>
            <span>•</span>
            <span>Location: Miyazaki / Remote</span>
          </div>
        </motion.div>

        {/* Right Side: Interactive Inquiry Form */}
        <motion.div
          initial={{ opacity: 0, y: 36, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#a2d7ff]" />
              メッセージを送信
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              入力いただいた内容に返信いたします。フォームからダイレクトにお問い合わせいただけます。
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">送信が完了しました</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm">
                  お問い合わせありがとうございます。内容を確認のうえ、担当（岩本）より折り返しご連絡差し上げます。
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-full text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  新しいメッセージを書く
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-slate-400 mb-1.5">
                    お名前 / Name <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    placeholder="例: 山田 太郎"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#a2d7ff] focus:ring-1 focus:ring-[#a2d7ff] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-slate-400 mb-1.5">
                    メールアドレス / Email <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#a2d7ff] focus:ring-1 focus:ring-[#a2d7ff] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-400 mb-1.5">
                    ご用件 / Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-[#a2d7ff] focus:ring-1 focus:ring-[#a2d7ff] transition-colors"
                  >
                    <option value="Web制作・コラボレーションのご相談" className="bg-[#090d18] text-white">
                      Web制作・コラボレーションのご相談
                    </option>
                    <option value="UI/UXデザイン・フロントエンド開発のご依頼" className="bg-[#090d18] text-white">
                      UI/UXデザイン・フロントエンド開発のご依頼
                    </option>
                    <option value="MIYAZAKI frogs / アントレプレナーシップ関連" className="bg-[#090d18] text-white">
                      MIYAZAKI frogs / アントレプレナーシップ関連
                    </option>
                    <option value="その他のお問い合わせ" className="bg-[#090d18] text-white">
                      その他のお問い合わせ
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono text-slate-400 mb-1.5">
                    メッセージ内容 / Message <span className="text-sky-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="ご相談内容やプロジェクト概要をご記入ください"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#a2d7ff] focus:ring-1 focus:ring-[#a2d7ff] transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-6 rounded-lg text-xs sm:text-sm font-semibold tracking-wider text-[#05070d] bg-[#a2d7ff] hover:bg-white disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  {isSubmitting ? (
                    <span>送信処理中...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>メッセージを送信する</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
