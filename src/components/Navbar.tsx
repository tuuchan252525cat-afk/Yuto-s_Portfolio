import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles, Send, User } from 'lucide-react';

interface NavbarProps {
  onOpenContactModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContactModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'Profile', href: '#profile' },
    { label: 'Career 経歴', href: '#career' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#05070d]/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          id="brand-logo"
          className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a2d7ff] rounded-md"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/30 to-indigo-950 border border-blue-400/40 flex items-center justify-center overflow-hidden group-hover:border-blue-300 transition-colors">
            <span className="text-xs font-bold tracking-wider text-blue-200">YI</span>
            <div className="absolute inset-0 bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-widest text-sm sm:text-base text-white group-hover:text-[#a2d7ff] transition-colors">
              YUTO IWAMOTO
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 font-light">
              岩本 佑都 / Portfolio
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav
          id="desktop-nav"
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-1 sm:gap-2"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 text-xs tracking-wider uppercase text-slate-300 hover:text-[#a2d7ff] transition-colors relative group rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-[#a2d7ff]"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-3.5 right-3.5 h-[1.5px] bg-[#a2d7ff] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
          ))}

          <a
            href="#career"
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-blue-500/10 text-[#a2d7ff] border border-blue-400/25 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all"
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>frogs 2期生</span>
          </a>

          {onOpenContactModal && (
            <button
              onClick={onOpenContactModal}
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-white text-[#05070d] hover:bg-[#a2d7ff] transition-colors shadow-sm cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Contact</span>
            </button>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="メニューを開く"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-[#05070d]/95 backdrop-blur-2xl px-6 py-5 overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-sm tracking-wider text-slate-200 hover:text-[#a2d7ff] transition-colors flex items-center justify-between border-b border-white/5"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-slate-500">→</span>
                </a>
              ))}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-sky-400">MIYAZAKI frogs 2期生</span>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-[#a2d7ff] border border-blue-400/30"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
