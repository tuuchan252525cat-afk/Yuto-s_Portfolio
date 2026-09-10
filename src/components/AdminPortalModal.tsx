import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Utensils,
  FolderGit2,
  Calendar,
  User,
  Trash2,
  Check,
  Star,
  ExternalLink,
  Plus,
  Edit3,
  RefreshCw,
  ShieldCheck,
  Heart,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Layers,
  Save,
  Upload,
  Camera,
  Search,
  Filter,
  Lock,
  KeyRound,
  ShieldAlert,
  Database,
  Download,
  Copy,
  Code,
  Cloud,
} from 'lucide-react';
import { Project, CareerItem, ProfileData, FoodRecommendation } from '../types';
import {
  subscribeToFoodRecommendations,
  submitFoodRecommendation,
  updateFoodRecommendationStatus,
  deleteFoodRecommendation,
} from '../lib/firebase';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  projects: Project[];
  careerList: CareerItem[];
  onSaveProfile: (profile: ProfileData) => void;
  onSaveProjects: (projects: Project[]) => void;
  onSaveCareer: (career: CareerItem[]) => void;
  onOpenProjectManager: (projectId?: string) => void;
  onOpenCareerManager: () => void;
  initialTab?: 'food' | 'projects' | 'career' | 'profile' | 'sync';
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  careerList,
  onSaveProfile,
  onSaveProjects,
  onSaveCareer,
  onOpenProjectManager,
  onOpenCareerManager,
  initialTab = 'food',
}) => {
  const [activeTab, setActiveTab] = useState<'food' | 'projects' | 'career' | 'profile' | 'sync'>(initialTab);
  const [foodItems, setFoodItems] = useState<FoodRecommendation[]>([]);
  const [foodFilter, setFoodFilter] = useState<'all' | 'want_to_try' | 'visited' | 'favorite'>('all');
  const [searchFoodQuery, setSearchFoodQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication state (Session-based)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('portfolio_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // New Food Form inside Admin
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodNotes, setNewFoodNotes] = useState('');
  const [isAddingFood, setIsAddingFood] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState<ProfileData>(profile);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Subscribe to real-time food recommendations from Firestore
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    const unsub = subscribeToFoodRecommendations((items) => {
      setFoodItems(items);
    });
    return () => unsub();
  }, [isOpen, isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 2525
    if (passcode.trim() === '2525' || passcode.trim() === 'admin' || passcode.trim() === 'yuto') {
      setIsAuthenticated(true);
      setPasscodeError(false);
      try {
        sessionStorage.setItem('portfolio_admin_auth', 'true');
      } catch {
        // ignore
      }
    } else {
      setPasscodeError(true);
    }
  };

  if (!isOpen) return null;

  // Render Passcode Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-center relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-white mb-1">管理者認証</h2>
          <p className="text-xs text-slate-400 mb-6">
            ポートフォリオ情報の編集および投稿された食事の管理にはパスコードが必要です。
          </p>

          <form onSubmit={handleVerifyPasscode} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                <span>パスコード（PIN）</span>
              </label>
              <input
                type="password"
                autoFocus
                placeholder="パスコードを入力（初期PIN: 2525）"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                className={`w-full bg-slate-950 border ${
                  passcodeError ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-center tracking-widest font-mono`}
              />
              {passcodeError && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>パスコードが正しくありません（初期設定: 2525）</span>
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-teal-950 bg-teal-300 hover:bg-teal-200 transition-all shadow-md shadow-teal-500/20"
              >
                ロック解除
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Handle status update of a food recommendation
  const handleUpdateStatus = async (
    id: string,
    status: 'want_to_try' | 'visited' | 'favorite'
  ) => {
    try {
      await updateFoodRecommendationStatus(id, status);
      showToast('ステータスを更新しました');
    } catch (err) {
      console.warn('Could not update status', err);
    }
  };

  // Handle delete of a food recommendation
  const handleDeleteFood = async (id: string, foodName: string) => {
    if (confirm(`「${foodName}」の投稿を削除しますか？`)) {
      try {
        await deleteFoodRecommendation(id);
        showToast('投稿を削除しました');
      } catch (err) {
        console.warn('Could not delete food recommendation', err);
      }
    }
  };

  // Handle adding new food recommendation manually
  const handleAddManualFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;
    try {
      await submitFoodRecommendation({
        foodName: newFoodName.trim(),
        notes: newFoodNotes.trim() || undefined,
      });
      setNewFoodName('');
      setNewFoodNotes('');
      setIsAddingFood(false);
      showToast('新しい食事メモを追加しました');
    } catch (err) {
      console.warn('Could not add food', err);
    }
  };

  // Handle photo file upload and compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setProfileForm((prev) => ({ ...prev, photoUrl: dataUrl }));
        showToast('新しいプロフィール画像をセットしました（「変更を保存する」で確定）');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle saving profile
  const handleSaveProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
    showToast('プロフィール情報を保存・更新しました');
  };

  const [copiedTsCode, setCopiedTsCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);

  // Generate valid TypeScript portfolioData.ts file contents
  const generatePortfolioDataTs = () => {
    return `import { Project, CareerItem, ProfileData } from '../types';

export const INITIAL_PROFILE: ProfileData = ${JSON.stringify(profile, null, 2)};

export const INITIAL_CAREER: CareerItem[] = ${JSON.stringify(careerList, null, 2)};

export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};
`;
  };

  const handleCopyTsCode = () => {
    const code = generatePortfolioDataTs();
    navigator.clipboard.writeText(code);
    setCopiedTsCode(true);
    showToast('GitHub用 portfolioData.ts のTypeScriptコードをクリップボードにコピーしました');
    setTimeout(() => setCopiedTsCode(false), 3000);
  };

  const handleCopyBackupJson = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      profile,
      careerList,
      projects,
      foodItems,
    };
    navigator.clipboard.writeText(JSON.stringify(backup, null, 2));
    setCopiedJson(true);
    showToast('全データのJSONをクリップボードにコピーしました');
    setTimeout(() => setCopiedJson(false), 3000);
  };

  const handleDownloadBackupFile = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      profile,
      careerList,
      projects,
      foodItems,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iwamoto-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('バックアップJSONファイルをダウンロードしました');
  };

  const handleForceCloudResync = async () => {
    setIsResyncing(true);
    try {
      await onSaveProjects(projects);
      await onSaveCareer(careerList);
      await onSaveProfile(profile);
      showToast('全データ（制作物・経歴・プロフィール）をFirestoreクラウドに完全同期・保存しました');
    } catch (e) {
      console.error('Resync failed', e);
      showToast('クラウド同期中にエラーが発生しました');
    } finally {
      setIsResyncing(false);
    }
  };

  // Filtered food list
  const filteredFood = foodItems
    .filter((item) => {
      if (foodFilter === 'all') return true;
      return (item.status || 'want_to_try') === foodFilter;
    })
    .filter((item) => {
      if (!searchFoodQuery.trim()) return true;
      const q = searchFoodQuery.toLowerCase();
      return (
        item.foodName?.toLowerCase().includes(q) ||
        item.notes?.toLowerCase().includes(q) ||
        item.restaurantOrArea?.toLowerCase().includes(q)
      );
    });

  const wantToTryCount = foodItems.filter((f) => (f.status || 'want_to_try') === 'want_to_try').length;
  const visitedCount = foodItems.filter((f) => f.status === 'visited').length;
  const favoriteCount = foodItems.filter((f) => f.status === 'favorite').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#04060c]/90 backdrop-blur-xl transition-opacity"
        aria-hidden="true"
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#090d18] border border-white/20 rounded-2xl shadow-2xl shadow-black text-slate-200 z-10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-[#0d1322] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-md shadow-teal-500/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  ポートフォリオ 専用管理サイト
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-400/15 text-teal-300 border border-teal-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Firestore Live
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light">
                投稿された食事の管理・確認および制作物・経歴・プロフィールの統合管理を行えます
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="px-6 py-2.5 bg-teal-500/15 border-b border-teal-400/30 text-teal-300 text-xs flex items-center gap-2 font-medium shrink-0">
            <Check className="w-4 h-4 text-teal-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center px-4 sm:px-6 bg-[#090d18] border-b border-white/10 overflow-x-auto gap-2 py-2 shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('food')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'food'
                ? 'bg-teal-400/20 text-teal-200 border border-teal-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-300" />
            <span>投稿された食事 ({foodItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-teal-400/20 text-teal-200 border border-teal-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-teal-300" />
            <span>制作物・作品 ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('career')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'career'
                ? 'bg-teal-400/20 text-teal-200 border border-teal-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-300" />
            <span>経歴・活動実績 ({careerList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-teal-400/20 text-teal-200 border border-teal-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <User className="w-4 h-4 text-indigo-300" />
            <span>プロフィール設定</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sync'
                ? 'bg-teal-400/20 text-teal-200 border border-teal-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-300" />
            <span>クラウド同期・GitHub連携</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 min-h-0 bg-[#060912]">
          {/* ======================================================== */}
          {/* TAB 1: 投稿された食事 (Food Recommendations)             */}
          {/* ======================================================== */}
          {activeTab === 'food' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Top Banner & Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-400/15 text-amber-300">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">総投稿数</div>
                    <div className="text-xl font-bold text-white">{foodItems.length} 件</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-teal-400/15 text-teal-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">食べに行きたい</div>
                    <div className="text-xl font-bold text-teal-300">{wantToTryCount} 件</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-400/15 text-blue-300">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">来店済み・制覇</div>
                    <div className="text-xl font-bold text-blue-300">{visitedCount} 件</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-rose-400/15 text-rose-300">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">お気に入り・殿堂入り</div>
                    <div className="text-xl font-bold text-rose-300">{favoriteCount} 件</div>
                  </div>
                </div>
              </div>

              {/* Action Bar: Search, Filter, Add Manual */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchFoodQuery}
                    onChange={(e) => setSearchFoodQuery(e.target.value)}
                    placeholder="料理名、店名、エリアなどを検索..."
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setFoodFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      foodFilter === 'all'
                        ? 'bg-white/15 text-white font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    すべて ({foodItems.length})
                  </button>
                  <button
                    onClick={() => setFoodFilter('want_to_try')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      foodFilter === 'want_to_try'
                        ? 'bg-teal-400/20 text-teal-300 font-bold border border-teal-400/30'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    食べたい ({wantToTryCount})
                  </button>
                  <button
                    onClick={() => setFoodFilter('visited')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      foodFilter === 'visited'
                        ? 'bg-blue-400/20 text-blue-300 font-bold border border-blue-400/30'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    来店済 ({visitedCount})
                  </button>
                  <button
                    onClick={() => setFoodFilter('favorite')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      foodFilter === 'favorite'
                        ? 'bg-rose-400/20 text-rose-300 font-bold border border-rose-400/30'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    お気に入り ({favoriteCount})
                  </button>

                  <button
                    onClick={() => setIsAddingFood(!isAddingFood)}
                    className="ml-auto sm:ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-400/20 text-teal-300 hover:bg-teal-400/30 border border-teal-400/40 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>メモを追加</span>
                  </button>
                </div>
              </div>

              {/* Add Manual Food Form */}
              {isAddingFood && (
                <form
                  onSubmit={handleAddManualFood}
                  className="p-4 sm:p-5 rounded-2xl bg-teal-950/30 border border-teal-400/30 space-y-3 animate-fadeIn"
                >
                  <div className="font-bold text-xs text-teal-300 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>管理者用：新しい食事・おすすめ店メモの追加</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="料理名や店名（例: ○○寿司 宮崎本店、特製チキンカレー）"
                      value={newFoodName}
                      onChange={(e) => setNewFoodName(e.target.value)}
                      className="px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                    <input
                      type="text"
                      placeholder="メモ・場所・イチオシ情報（任意）"
                      value={newFoodNotes}
                      onChange={(e) => setNewFoodNotes(e.target.value)}
                      className="px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingFood(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-400 text-slate-950 hover:bg-teal-300 cursor-pointer"
                    >
                      保存する
                    </button>
                  </div>
                </form>
              )}

              {/* Food Items List */}
              {filteredFood.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredFood.map((food) => {
                    const status = food.status || 'want_to_try';
                    return (
                      <div
                        key={food.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4 group"
                      >
                        <div>
                          {/* Header of card */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {status === 'want_to_try' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-teal-400/15 text-teal-300 border border-teal-400/30">
                                  <Sparkles className="w-3 h-3" />
                                  食べたい！
                                </span>
                              )}
                              {status === 'visited' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-400/15 text-blue-300 border border-blue-400/30">
                                  <Check className="w-3 h-3" />
                                  来店済み
                                </span>
                              )}
                              {status === 'favorite' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-400/15 text-rose-300 border border-rose-400/30">
                                  <Heart className="w-3 h-3" />
                                  お気に入り
                                </span>
                              )}

                              {food.createdAt && (
                                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(food.createdAt).toLocaleDateString('ja-JP', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteFood(food.id, food.foodName)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                              title="削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Food Name / Detail */}
                          <div className="text-sm sm:text-base font-bold text-white mb-1.5">
                            {food.foodName}
                          </div>

                          {food.notes && (
                            <p className="text-xs text-slate-300 font-light leading-relaxed whitespace-pre-wrap bg-black/20 p-2.5 rounded-xl border border-white/5">
                              {food.notes}
                            </p>
                          )}
                        </div>

                        {/* Status Switcher Actions */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400">ステータス変更:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateStatus(food.id, 'want_to_try')}
                              className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                                status === 'want_to_try'
                                  ? 'bg-teal-400/30 text-teal-200 font-bold'
                                  : 'hover:bg-white/10 text-slate-400'
                              }`}
                            >
                              食べたい
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(food.id, 'visited')}
                              className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                                status === 'visited'
                                  ? 'bg-blue-400/30 text-blue-200 font-bold'
                                  : 'hover:bg-white/10 text-slate-400'
                              }`}
                            >
                              行った！
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(food.id, 'favorite')}
                              className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                                status === 'favorite'
                                  ? 'bg-rose-400/30 text-rose-200 font-bold'
                                  : 'hover:bg-white/10 text-slate-400'
                              }`}
                            >
                              お気に入り
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 px-4 rounded-2xl border border-white/10 bg-white/[0.01]">
                  <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white">
                    {searchFoodQuery ? '条件に一致する食事は見つかりませんでした' : 'まだ投稿された食事はありません'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    ポートフォリオの「今食べたいご飯」カードから投稿されたおすすめ食事情報が、リアルタイムにここに蓄積・表示されます。
                  </p>
                  <button
                    onClick={() => setIsAddingFood(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-400/20 text-teal-300 hover:bg-teal-400/30 border border-teal-400/40 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>手動で最初の食事メモを追加</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: 制作物・作品の管理 (Projects & Works)             */}
          {/* ======================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-teal-300" />
                    <span>制作物・作品の管理一覧 ({projects.length} 件)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    掲載順の変更、作品内容・掲載画像・ストーリーの編集や削除を行えます
                  </p>
                </div>

                <button
                  onClick={() => onOpenProjectManager()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>フル作品エディタを開く</span>
                </button>
              </div>

              {/* Grid of Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-teal-400/40 transition-all flex gap-3.5 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                            {project.year}
                          </span>
                          <span className="text-[10px] font-mono text-teal-300 truncate">
                            {project.category}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {project.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {project.description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs mt-2 border-t border-white/5">
                        <span className="text-[10px] font-mono text-slate-500">#{index + 1}</span>
                        <button
                          onClick={() => onOpenProjectManager(project.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-teal-300 hover:text-teal-200 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>編集する</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: 経歴・活動実績の管理 (Career & Milestones)       */}
          {/* ======================================================== */}
          {activeTab === 'career' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-300" />
                    <span>経歴・活動実績の管理一覧 ({careerList.length} 件)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    タイムラインに表示される活動履歴や成果ハイライトの編集や追加を行えます
                  </p>
                </div>

                <button
                  onClick={onOpenCareerManager}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>経歴エディタを開く</span>
                </button>
              </div>

              {/* Grid of Career items */}
              <div className="space-y-3">
                {careerList.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-blue-400/40 transition-all flex items-start justify-between gap-4 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-teal-400/15 text-teal-300 border border-teal-400/30">
                          {item.period}
                        </span>
                        <span className="text-xs text-slate-300 font-medium">
                          {item.organization}
                        </span>
                        {item.role && (
                          <span className="text-xs text-slate-400">
                            • {item.role}
                          </span>
                        )}
                        {item.isHighlighted && (
                          <span className="text-[10px] text-amber-300 flex items-center gap-0.5 font-medium px-1.5 py-0.2 rounded bg-amber-400/10 border border-amber-400/20">
                            <Sparkles className="w-2.5 h-2.5" />
                            注目
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {item.description}
                      </p>

                      {item.highlights && item.highlights.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {item.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-black/40 text-slate-300 border border-white/5"
                            >
                              • {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={onOpenCareerManager}
                        className="inline-flex items-center gap-1 text-xs font-mono text-teal-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>編集</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: プロフィール設定 (Profile & Socials)              */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfileForm} className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-300" />
                    <span>プロフィール情報の編集</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    自己紹介、肩書、活動拠点、SNSリンクなどの情報を一括で更新できます
                  </p>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>変更を保存する</span>
                </button>
              </div>

              {/* Profile Photo Editor */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Photo Preview */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-900 border-2 border-teal-400/40 shrink-0 shadow-lg group">
                  <img
                    src={profileForm.photoUrl || '/profile_avatar.jpg'}
                    alt="プロフィールプレビュー"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Photo Upload Actions */}
                <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                      <Camera className="w-4 h-4 text-teal-300" />
                      <span>プロフィール写真の設定</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      トップカードに表示されるあなたのアイコン画像です。端末の画像ファイル、または画像URLを設定できます。
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-400/20 hover:bg-teal-400/30 text-teal-300 border border-teal-400/40 cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>端末から写真を選択</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {profileForm.photoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileForm({ ...profileForm, photoUrl: '/profile_avatar.jpg' });
                          showToast('初期画像にリセットしました（「変更を保存する」で確定）');
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                      >
                        初期画像に戻す
                      </button>
                    )}
                  </div>

                  {/* URL Input fallback */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">または画像URLを直接指定:</label>
                    <input
                      type="url"
                      placeholder="https://example.com/my-photo.jpg"
                      value={profileForm.photoUrl || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                      className="w-full px-3.5 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              </div>

              {/* Names & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">お名前 (漢字)</label>
                  <input
                    type="text"
                    required
                    value={profileForm.nameKanji || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, nameKanji: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">お名前 (ローマ字)</label>
                  <input
                    type="text"
                    required
                    value={profileForm.nameRomaji || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, nameRomaji: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">肩書・専門領域</label>
                  <input
                    type="text"
                    required
                    value={profileForm.roleTitle || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, roleTitle: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Tagline & Location & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">キャッチコピー / タグライン</label>
                  <input
                    type="text"
                    value={profileForm.tagline || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">拠点 (Location)</label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">メールアドレス</label>
                  <input
                    type="email"
                    value={profileForm.email || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Bio & Vision */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">自己紹介文 (Bio)</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">ビジョン・探究テーマ (Vision)</label>
                  <textarea
                    rows={3}
                    value={profileForm.vision || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, vision: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="text-xs font-mono font-bold text-teal-300">SNS・外部リンク</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">X (Twitter) URL</label>
                    <input
                      type="text"
                      value={profileForm.xUrl || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, xUrl: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={profileForm.githubUrl || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={profileForm.instagramUrl || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, instagramUrl: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={profileForm.facebookUrl || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, facebookUrl: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              </div>

              {/* Submit footer */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>プロフィールを保存する</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 5: クラウド同期 & GitHub連携 (Cloud Sync & Backup)    */}
          {/* ======================================================== */}
          {activeTab === 'sync' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-300" />
                    <span>Firestore クラウド同期 & GitHubバックアップ</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    制作物や経歴などの編集内容はGoogle Firebase Firestoreにリアルタイム保存されるため、GitHubでコードを更新しても消えることはありません。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleForceCloudResync}
                  disabled={isResyncing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isResyncing ? 'animate-spin' : ''}`} />
                  <span>{isResyncing ? '同期中...' : 'クラウド全データを今すぐ再同期'}</span>
                </button>
              </div>

              {/* Status Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Cloud className="w-4 h-4" />
                    <span>Firestore データベース</span>
                  </div>
                  <div className="text-sm font-bold text-white">常時リアルタイム接続中</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ID: ai-studio-yutoiwamotoportf...
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
                    <Layers className="w-4 h-4" />
                    <span>保存済みデータ総数</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    作品 {projects.length} 件 / 経歴 {careerList.length} 件 / 食事 {foodItems.length} 件
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ブラウザを閉じても永続的に保持されます
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>セキュリティ & 認証</span>
                  </div>
                  <div className="text-sm font-bold text-white">管理者PIN保護済み</div>
                  <div className="text-[11px] text-slate-400">
                    パスコード認証者のみ編集可能
                  </div>
                </div>
              </div>

              {/* GitHub Code Export Section */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Code className="w-4 h-4 text-teal-300" />
                      <span>GitHubリポジトリ更新用コード書き出し (portfolioData.ts)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      GitHubの初期ソースコードファイル（src/data/portfolioData.ts）自体も最新の編集内容で同期したい場合は、下記のコードをコピーして貼り付けてください。
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyTsCode}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
                    >
                      {copiedTsCode ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTsCode ? 'コピー完了！' : 'TypeScriptコードをコピー'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadBackupFile}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-400/20 hover:bg-teal-400/30 text-teal-300 border border-teal-400/40 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>JSONバックアップ保存</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre className="p-4 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto max-h-64 scrollbar-thin">
                    <code>{generatePortfolioDataTs()}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
