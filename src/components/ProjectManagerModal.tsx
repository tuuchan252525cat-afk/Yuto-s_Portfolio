import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Check,
  Upload,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  Layers,
  Calendar,
  Tag,
  Link2,
  FileText,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  initialProjectId?: string | null;
  onSaveProjects: (projects: Project[]) => void;
  onResetDefaults: () => void;
}

// Curated high-quality image presets for quick selection
const IMAGE_PRESETS = [
  {
    name: '映画・シネマ',
    url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=86',
    thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=200&q=60',
  },
  {
    name: 'ロボティクス',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=86',
    thumb: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=60',
  },
  {
    name: '宇宙・サイエンス',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=86',
    thumb: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=200&q=60',
  },
  {
    name: 'Web / コード',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=86',
    thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=60',
  },
  {
    name: '自然・探究',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=86',
    thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=200&q=60',
  },
];

const CATEGORY_PRESETS = [
  'Video Production',
  'Robotics & Control',
  'Science & Data',
  'Web Experience',
  'Brand Website',
  'Editorial',
  'Hardware Engineering',
];

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  initialProjectId,
  onSaveProjects,
  onResetDefaults,
}) => {
  const [selectedId, setSelectedId] = useState<string>(() => {
    return initialProjectId || projects[0]?.id || '';
  });

  const [editingProject, setEditingProject] = useState<Project | null>(() => {
    const target = initialProjectId ? projects.find((p) => p.id === initialProjectId) : projects[0];
    return target ? { ...target } : null;
  });

  const [highlightsText, setHighlightsText] = useState<string>(() => {
    const target = initialProjectId ? projects.find((p) => p.id === initialProjectId) : projects[0];
    return target?.highlights ? target.highlights.join('\n') : '';
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when modal opens or initialProjectId/projects changes
  useEffect(() => {
    if (isOpen) {
      if (initialProjectId) {
        const found = projects.find((p) => p.id === initialProjectId);
        if (found) {
          setSelectedId(found.id);
          setEditingProject({ ...found });
          setHighlightsText(found.highlights ? found.highlights.join('\n') : '');
          return;
        }
      }

      const current = projects.find((p) => p.id === selectedId);
      if (current) {
        setEditingProject({ ...current });
        setHighlightsText(current.highlights ? current.highlights.join('\n') : '');
      } else if (projects.length > 0) {
        setSelectedId(projects[0].id);
        setEditingProject({ ...projects[0] });
        setHighlightsText(projects[0].highlights ? projects[0].highlights.join('\n') : '');
      } else {
        setSelectedId('');
        setEditingProject(null);
        setHighlightsText('');
      }
    }
  }, [isOpen, initialProjectId, projects]);

  if (!isOpen) return null;

  const handleSelectProject = (project: Project) => {
    setSelectedId(project.id);
    setEditingProject({ ...project });
    setHighlightsText(project.highlights ? project.highlights.join('\n') : '');
  };

  const handleStartAdd = () => {
    const newProject: Project = {
      id: 'project-' + Date.now(),
      title: '新しい制作物',
      year: `${new Date().getFullYear()}`,
      category: 'Web Experience',
      role: '企画・開発・制作',
      client: '自主制作',
      description: '作品の概要や見どころをここに入力してください。',
      longDescription:
        '作品の制作背景や探究の動機、乗り越えた技術的な課題やストーリーを詳しく入力してください。',
      tech: 'React, TypeScript, Tailwind CSS',
      image: IMAGE_PRESETS[0].url,
      link: '',
      highlights: ['制作の成果や注目ポイントを箇条書きで記載'],
    };

    const updated = [newProject, ...projects];
    onSaveProjects(updated);
    setSelectedId(newProject.id);
    setEditingProject(newProject);
    setHighlightsText(newProject.highlights?.join('\n') || '');
    setSuccessNotice('新規作品を作成しました。内容と画像を編集してください。');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = projects.find((p) => p.id === id);
    const targetTitle = target ? `「${target.title}」` : 'この作品';
    if (confirm(`${targetTitle}を削除してもよろしいですか？`)) {
      const updated = projects.filter((p) => p.id !== id);
      onSaveProjects(updated);
      if (selectedId === id) {
        if (updated.length > 0) {
          handleSelectProject(updated[0]);
        } else {
          setSelectedId('');
          setEditingProject(null);
          setHighlightsText('');
        }
      }
      setSuccessNotice(`${targetTitle}を削除しました`);
      setTimeout(() => setSuccessNotice(null), 3000);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onSaveProjects(updated);
  };

  // Image Processing: Safely resize large images with HTML Canvas to prevent localStorage overflow
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイル（PNG, JPG, WebPなど）を選択してください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxDimension = 1280;
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setEditingProject((prev) => (prev ? { ...prev, image: optimizedDataUrl } : null));
          setSuccessNotice('新しい画像を適用しました（保存ボタンで反映されます）');
          setTimeout(() => setSuccessNotice(null), 3000);
        } else {
          setEditingProject((prev) => (prev ? { ...prev, image: rawDataUrl } : null));
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim()) {
      alert('タイトルを入力してください。');
      return;
    }

    const parsedHighlights = highlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedItem: Project = {
      ...editingProject,
      title: editingProject.title.trim(),
      highlights: parsedHighlights,
    };

    const existingIndex = projects.findIndex((p) => p.id === updatedItem.id);
    let updated: Project[];
    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = updatedItem;
    } else {
      updated = [updatedItem, ...projects];
    }

    onSaveProjects(updated);
    setEditingProject(updatedItem);
    setSuccessNotice(`「${updatedItem.title}」の変更を保存しました`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 md:p-8">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#04060c]/90 backdrop-blur-xl transition-opacity"
        aria-hidden="true"
      />

      {/* Modal dialog */}
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-2xl bg-[#090d18] border border-white/20 shadow-2xl shadow-black text-slate-200 z-10 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#090d18] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">制作物の管理・編集</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#a2d7ff] border border-white/10">
                  {projects.length} 作品
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light">
                作品の文章・技術タグ・役割、および掲載画像の変更やアップロードを行えます
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetDefaults}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="初期の制作物データにリセット"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">初期状態に戻す</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="px-6 py-2.5 bg-teal-500/15 border-b border-teal-400/30 text-teal-300 text-xs flex items-center gap-2 font-medium shrink-0 animate-fadeIn">
            <Check className="w-4 h-4 text-teal-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Modal Body: Split Master-Detail Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
          {/* Left Column: Projects List (4 cols) */}
          <div className="lg:col-span-4 border-r border-white/10 flex flex-col bg-black/20 overflow-hidden">
            {/* Action Bar */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.01]">
              <span className="text-xs font-mono text-slate-400">作品一覧</span>
              <button
                onClick={handleStartAdd}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-400/20 text-teal-200 hover:bg-teal-400/30 border border-teal-400/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新規作品を追加</span>
              </button>
            </div>

            {/* Scrollable list of items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
              {projects.map((project, index) => {
                const isSelected = project.id === selectedId;
                return (
                  <div
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-teal-400/10 border-teal-400/40 shadow-sm'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-11 rounded-lg overflow-hidden bg-slate-900 border border-white/10 shrink-0 relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                          {project.year}
                        </span>
                        <span className="text-[10px] font-mono text-teal-300 truncate">
                          {project.category}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-bold truncate mt-0.5 ${
                          isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {project.title}
                      </h4>
                    </div>

                    {/* Reorder and Delete Controls */}
                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => handleMove(index, 'up', e)}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 hover:bg-white/10"
                        title="上へ移動"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleMove(index, 'down', e)}
                        disabled={index === projects.length - 1}
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 hover:bg-white/10"
                        title="下へ移動"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(project.id, e)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Edit Form (8 cols) */}
          <div className="lg:col-span-8 flex flex-col overflow-hidden bg-[#090d18]">
            {editingProject ? (
              <form onSubmit={handleSaveEdit} className="flex-1 flex flex-col overflow-hidden">
                {/* Form Body with scrolling */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-thin">
                  {/* SECTION 1: Image Uploader & Changer */}
                  <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-mono font-bold tracking-wider text-teal-300 uppercase flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>作品の画像（アップロード / 変更）</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-xs font-mono text-slate-400 hover:text-teal-300 underline cursor-pointer"
                      >
                        {showUrlInput ? 'ドラッグ＆ドロップに戻す' : '画像URLを直接入力する'}
                      </button>
                    </div>

                    {showUrlInput ? (
                      /* Direct URL Input Mode */
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingProject.image || ''}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, image: e.target.value })
                            }
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>ファイル選択</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop / Click Upload Area */
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group ${
                          isDragOver
                            ? 'border-teal-400 bg-teal-400/10'
                            : 'border-white/20 bg-black/30 hover:border-teal-400/50 hover:bg-black/40'
                        }`}
                      >
                        {/* Live Image Preview */}
                        <div className="relative aspect-video max-h-56 w-full flex items-center justify-center overflow-hidden bg-slate-950">
                          {editingProject.image ? (
                            <>
                              <img
                                src={editingProject.image}
                                alt={editingProject.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                              />
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <div className="p-3 rounded-full bg-teal-400/20 border border-teal-400/40 text-teal-300">
                                  <Upload className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold text-white">
                                  クリックまたは画像をドロップして差し替え
                                </span>
                                <span className="text-[11px] text-slate-300 font-mono">
                                  JPG, PNG, WebP に対応（自動最適化）
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="p-8 text-center flex flex-col items-center gap-2 text-slate-400">
                              <Upload className="w-8 h-8 text-teal-300" />
                              <span className="text-xs font-semibold text-slate-200">
                                画像をここにドラッグ＆ドロップ、またはクリックして選択
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                端末内の画像ファイルを選択できます
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Quick Image Presets */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">プリセット写真:</span>
                      {IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() =>
                            setEditingProject({ ...editingProject, image: preset.url })
                          }
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 hover:bg-teal-400/20 hover:text-teal-300 border border-white/10 transition-colors cursor-pointer"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 2: Core Details (Title, Year, Category) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Title */}
                    <div className="sm:col-span-8">
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        作品タイトル <span className="text-teal-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, title: e.target.value })
                        }
                        placeholder="例: 君の52Hzが聞こえた廊下で"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    {/* Year */}
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        制作年 / 期間
                      </label>
                      <input
                        type="text"
                        value={editingProject.year || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, year: e.target.value })
                        }
                        placeholder="例: 2025 - 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    {/* Category */}
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        カテゴリ
                      </label>
                      <input
                        type="text"
                        value={editingProject.category || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, category: e.target.value })
                        }
                        placeholder="例: Video Production"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                      {/* Quick category chips */}
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {CATEGORY_PRESETS.slice(0, 4).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() =>
                              setEditingProject({ ...editingProject, category: cat })
                            }
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Role / Responsibility */}
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        役割・担当 (Role)
                      </label>
                      <input
                        type="text"
                        value={editingProject.role || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, role: e.target.value })
                        }
                        placeholder="例: 企画・脚本・撮影・監督・編集"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    {/* Client / Context */}
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        所属・クライアント (Context)
                      </label>
                      <input
                        type="text"
                        value={editingProject.client || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, client: e.target.value })
                        }
                        placeholder="例: 自主制作映像作品 / WRO Japan"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    {/* Tech Stack */}
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        使用技術・ツール (カンマ区切り)
                      </label>
                      <input
                        type="text"
                        value={editingProject.tech || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, tech: e.target.value })
                        }
                        placeholder="例: Premiere Pro, DaVinci Resolve, 4K Cinema Camera"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>

                  {/* SECTION 3: Descriptions */}
                  <div className="space-y-4">
                    {/* Short Description */}
                    <div>
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        簡潔な説明 (カード表示用)
                      </label>
                      <textarea
                        rows={2}
                        value={editingProject.description || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, description: e.target.value })
                        }
                        placeholder="一覧カードに表示される短い要約文..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    {/* Long Description / Intent */}
                    <div>
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        詳細ストーリー・制作意図 (詳細モーダル用)
                      </label>
                      <textarea
                        rows={4}
                        value={editingProject.longDescription || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            longDescription: e.target.value,
                          })
                        }
                        placeholder="作品を開いた詳細画面に表示される制作背景やストーリー、探究プロセス..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    {/* Highlights (Bullet Points) */}
                    <div>
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        実績ハイライト・注目ポイント (1行に1項目)
                      </label>
                      <textarea
                        rows={3}
                        value={highlightsText}
                        onChange={(e) => setHighlightsText(e.target.value)}
                        placeholder="・自然光と陰影のコントラストを際立たせたシネマティックなトーン設計&#10;・52Hzの孤独なクジラをモチーフにした静寂と共鳴の脚本構成"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400 font-mono text-xs"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        ※ 改行するごとに、詳細モーダルで箇条書きリストとして表示されます
                      </span>
                    </div>

                    {/* External Link */}
                    <div>
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                        作品リンク・外部リンク (任意)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProject.link || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, link: e.target.value })
                          }
                          placeholder="https://... または #career"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-teal-400"
                        />
                        {editingProject.link && editingProject.link.startsWith('http') && (
                          <a
                            href={editingProject.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-teal-300 flex items-center justify-center border border-white/10"
                            title="リンク先をテスト"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Footer / Save Bar */}
                <div className="px-6 py-4 border-t border-white/10 bg-[#090d18] flex items-center justify-between shrink-0 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                      ID: {editingProject.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(editingProject.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="この作品を一覧から完全に削除します"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>この作品を削除</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      閉じる
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>変更を保存する</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <Layers className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm font-medium text-white">作品が選択されていません</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  左の一覧から編集したい作品を選択するか、「新規作品を追加」をクリックしてください。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
