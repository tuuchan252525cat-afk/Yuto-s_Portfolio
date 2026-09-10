import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Check,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Calendar,
  Building,
  Tag,
  ListOrdered,
} from 'lucide-react';
import { CareerItem } from '../types';

interface CareerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerList: CareerItem[];
  onSaveCareer: (items: CareerItem[]) => void;
  onResetDefaults: () => void;
}

export const CareerManagerModal: React.FC<CareerManagerModalProps> = ({
  isOpen,
  onClose,
  careerList,
  onSaveCareer,
  onResetDefaults,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    careerList[0]?.id || ''
  );
  const [editingItem, setEditingItem] = useState<CareerItem | null>(() => {
    return careerList[0] ? { ...careerList[0] } : null;
  });
  const [highlightsInput, setHighlightsInput] = useState<string>(() => {
    return careerList[0]?.highlights ? careerList[0].highlights.join('\n') : '';
  });
  const [skillsInput, setSkillsInput] = useState<string>(() => {
    return careerList[0]?.skills ? careerList[0].skills.join(', ') : '';
  });
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectItem = (item: CareerItem) => {
    setSelectedId(item.id);
    setEditingItem({ ...item });
    setHighlightsInput(item.highlights ? item.highlights.join('\n') : '');
    setSkillsInput(item.skills ? item.skills.join(', ') : '');
  };

  const handleCreateNew = () => {
    const newItem: CareerItem = {
      id: 'career-' + Date.now(),
      period: `${new Date().getFullYear()}`,
      title: '新しい活動・経歴',
      organization: '所属組織・団体名',
      role: '役割・担当',
      description: '活動内容の詳細をここに入力してください。',
      highlights: ['主な成果・実績を箇条書きで記入'],
      skills: ['関連技術', 'キーワード'],
      isHighlighted: false,
    };
    const updated = [newItem, ...careerList];
    onSaveCareer(updated);
    setSelectedId(newItem.id);
    setEditingItem(newItem);
    setHighlightsInput(newItem.highlights.join('\n'));
    setSkillsInput(newItem.skills.join(', '));
    setSuccessNotice('新しい経歴項目を追加しました');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('この経歴項目を削除してもよろしいですか？')) {
      const updated = careerList.filter((item) => item.id !== id);
      onSaveCareer(updated);
      if (selectedId === id) {
        if (updated.length > 0) {
          handleSelectItem(updated[0]);
        } else {
          setEditingItem(null);
        }
      }
      setSuccessNotice('経歴項目を削除しました');
      setTimeout(() => setSuccessNotice(null), 3000);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= careerList.length) return;

    const updated = [...careerList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onSaveCareer(updated);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const parsedHighlights = highlightsInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedSkills = skillsInput
      .split(/[,、]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const savedItem: CareerItem = {
      ...editingItem,
      highlights: parsedHighlights,
      skills: parsedSkills,
    };

    const index = careerList.findIndex((item) => item.id === savedItem.id);
    let updated: CareerItem[];
    if (index >= 0) {
      updated = [...careerList];
      updated[index] = savedItem;
    } else {
      updated = [savedItem, ...careerList];
    }

    onSaveCareer(updated);
    setEditingItem(savedItem);
    setSuccessNotice('経歴データを保存・更新しました');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-[#05070d]/85 backdrop-blur-xl" />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#0c1220] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 text-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-400/10 text-teal-300 border border-teal-400/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>経歴・活動実績の編集</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-400/15 text-teal-300 border border-teal-400/30">
                  {careerList.length} 件
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                カード表示およびタイムラインに掲載される経歴情報を編集・管理できます
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-300 hover:bg-teal-200 text-teal-950 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">新しい経歴を追加</span>
              <span className="sm:hidden">追加</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Notice Banner */}
        {successNotice && (
          <div className="bg-teal-500/15 border-b border-teal-500/30 px-6 py-2 flex items-center gap-2 text-xs text-teal-300 font-medium">
            <Check className="w-4 h-4 text-teal-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Main Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Column: Items List */}
          <div className="md:col-span-5 p-4 sm:p-5 space-y-2.5 overflow-y-auto max-h-[40vh] md:max-h-[calc(90vh-130px)]">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-1">
              <span>登録されている経歴一覧</span>
              <button
                type="button"
                onClick={() => {
                  if (confirm('初期の経歴データに戻しますか？')) {
                    onResetDefaults();
                    setSuccessNotice('初期データにリセットしました');
                    setTimeout(() => setSuccessNotice(null), 3000);
                  }
                }}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>初期状態に戻す</span>
              </button>
            </div>

            {careerList.map((item, idx) => {
              const isSelected = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-400/50 shadow-md shadow-teal-950/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-400/15 text-teal-300 border border-teal-400/30">
                        {item.period}
                      </span>
                      {item.isHighlighted && (
                        <span className="text-[10px] text-amber-300 flex items-center gap-0.5 font-medium">
                          <Sparkles className="w-2.5 h-2.5" />
                          注目
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.organization}
                    </div>
                  </div>

                  {/* Actions: Reorder & Delete */}
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => handleMove(idx, 'up', e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="上へ移動"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === careerList.length - 1}
                      onClick={(e) => handleMove(idx, 'down', e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="下へ移動"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Edit Form */}
          <div className="md:col-span-7 p-5 sm:p-6 overflow-y-auto max-h-[50vh] md:max-h-[calc(90vh-130px)]">
            {editingItem ? (
              <form onSubmit={handleSaveForm} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="text-xs font-mono uppercase tracking-wider text-teal-300">
                    項目を編集中: {editingItem.title || '無題'}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={editingItem.isHighlighted || false}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isHighlighted: e.target.checked })
                      }
                      className="rounded border-slate-700 text-teal-400 focus:ring-teal-400 bg-slate-900"
                    />
                    <span>注目の経歴として強調表示</span>
                  </label>
                </div>

                {/* Period & Organization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1">
                      期間（例: 2025、2024 - 2026）
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={editingItem.period}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, period: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1">
                      主催 / 所属組織
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={editingItem.organization}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, organization: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">
                    タイトル・大会名・プロジェクト名
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">
                    役割・肩書（例: 2期生選抜生、チームリーダー、代表など）
                  </label>
                  <input
                    type="text"
                    value={editingItem.role}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, role: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">
                    活動内容の説明文
                  </label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-400 leading-relaxed"
                  />
                </div>

                {/* Highlights (multi-line) */}
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>主な実績・ハイライト（1行に1項目）</span>
                    <span className="text-[10px] text-slate-500">改行で箇条書きになります</span>
                  </label>
                  <textarea
                    rows={3}
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    placeholder="例:&#10;全国大会出場決定&#10;プログラム選抜採択"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-teal-400 font-mono"
                  />
                </div>

                {/* Skills / Tags */}
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>関連キーワード・スキル（カンマ区切り）</span>
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="例: ロボット工学, C++, 宇宙科学, 起業家育成"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-teal-300 hover:bg-teal-200 text-teal-950 shadow-md shadow-teal-900/30 transition-all active:scale-[98%]"
                  >
                    <Save className="w-4 h-4" />
                    <span>この経歴を保存して反映する</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
                <ListOrdered className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">左側のリストから編集したい項目を選択してください</p>
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="mt-3 px-4 py-2 rounded-lg text-xs font-bold bg-teal-300/20 text-teal-300 hover:bg-teal-300 hover:text-teal-950 transition-colors"
                >
                  新しい経歴を作成
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
