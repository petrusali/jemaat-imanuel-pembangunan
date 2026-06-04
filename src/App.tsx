/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Wallet, 
  CheckCircle2, 
  ChevronRight, 
  Package, 
  Languages, 
  Clock,
  Home,
  History,
  Info,
  Camera,
  Briefcase,
  Church,
  Heart,
  ChevronLeft,
  Bell,
  QrCode,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Plus,
  Minus,
  User,
  HeartHandshake,
  X,
  MessageSquare
} from 'lucide-react';
import { Language, translations } from './types';
import LiveVideoSection from './components/LiveVideoSection';

// Mock Data
const USER_DATA = {
  name: "Jacob Anthonius M.",
  commitmentPerMonth: 2000000,
  totalDuration: 24,
  monthsPassed: 14,
  isThisMonthPaid: false
};

const PROJECT_DATA = {
  totalGoal: 55000000000, 
  collectedAmount: 25000000000,
  totalFloors: 7, 
  currentFloor: 2,
  realizationPercent: 30,
  materials: [
    { id: 1, name: "AC Split", needed: 50, fulfilled: 12, unit: "Unit", price: 5000000, spec: "1.5 PK, Inverter, Eco-friendly, Brand Tier 1" },
    { id: 2, name: "Kursi", needed: 600, fulfilled: 320, unit: "Pcs", price: 350000, spec: "Ergonomic, Stackable, Stainless Steel Frame, High Density Foam" },
    { id: 3, name: "Sanitasi", needed: 1, fulfilled: 0, unit: "Set", price: 150000000, spec: "Full Toilet Set (TOTO/Equivalent), Fittings, Piping System" },
    { id: 4, name: "Semen", needed: 1000, fulfilled: 650, unit: "Sak", price: 75000, spec: "PPC Type, 40kg, SNI Standard" },
  ],
  announcements: [
    { id: 1, date: "12 Mei 2026", title: "Rapat Koordinasi Pembangunan", content: "Undangan rapat koordinasi seluruh panitia pembangunan." },
    { id: 2, date: "10 Mei 2026", title: "Target Lantai 2", content: "Pengecoran tiang penyangga lantai 2 dimulai minggu ini." }
  ],
  prayerSubjects: [
    { id: 1, subject: "Kesehatan panitia & pekerja" },
    { id: 2, subject: "Kelancaran pendanaan" },
    { id: 3, subject: "Kerukunan seluruh jemaat" }
  ],
  jobs: [
    { id: 1, position: "Staff Administrasi", deadline: "30 Mei 2026" },
    { id: 2, position: "Security", deadline: "25 Mei 2026" }
  ]
};

const TIMELINE_DATA = [
  { id: 1, label: 'Basement', planned: 100, actual: 100, status: 'completed', image: 'https://picsum.photos/seed/church_basement_done/400/400' },
  { id: 2, label: 'Lantai 1', planned: 100, actual: 100, status: 'completed', image: 'https://picsum.photos/seed/church_floor1_done/400/400' },
  { id: 3, label: 'Lantai 2', planned: 80, actual: 40, status: 'in-progress', image: 'https://picsum.photos/seed/church_floor2_const/400/400' },
  { id: 4, label: 'Lantai 3', planned: 20, actual: 0, status: 'next' },
  { id: 5, label: 'Lantai 4', planned: 0, actual: 0, status: 'future' },
  { id: 6, label: 'Lantai 5', planned: 0, actual: 0, status: 'future' },
  { id: 7, label: 'Lantai 6', planned: 0, actual: 0, status: 'future' },
];

type Tab = 'home' | 'info' | 'profile' | 'history';

function AppContent({ t, lang, activeTab, setActiveTab, setLang, formatCurrency, onViewMaterial, onPayCommitment, userData, setUserData }: any) {
  const totalCommitment = userData.commitmentPerMonth * userData.totalDuration;
  const realizedDonation = userData.commitmentPerMonth * userData.monthsPassed;
  const remainingDonation = totalCommitment - realizedDonation;

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData.name);
  const [editedPhone, setEditedPhone] = useState(userData.phone);
  const [editedAddress, setEditedAddress] = useState(userData.address);
  const [editedSector, setEditedSector] = useState(userData.sector);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [msgTab, setMsgTab] = useState<'notif' | 'chat'>('notif');
  const [chatInput, setChatInput] = useState('');
  const [isPanitiaTyping, setIsPanitiaTyping] = useState(false);
  const [chatLog, setChatLog] = useState<any[]>([
    { id: '1', sender: 'Panitia', text: lang === 'ID' ? 'Shalom Bapak Jacob, terima kasih telah menghubungi Panitia Pembangunan GMI Imanuel. Ada yang bisa kami bantu hari ini?' : '主内平安 Jacob 先生，感谢您联系 GMI Imanuel 堂会建设委员会。请问今天有什么我们可以协助您的？', time: '09:00' }
  ]);

  const handleSendChat = (e: any) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'Saya',
      text: chatInput,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChatLog(prev => [...prev, userMsg]);
    const originalInput = chatInput.toLowerCase();
    setChatInput('');
    setIsPanitiaTyping(true);

    setTimeout(() => {
      let responseText = '';
      if (lang === Language.ID) {
        if (originalInput.includes('kapan') || originalInput.includes('selesai') || originalInput.includes('rampung')) {
          responseText = "Puji Tuhan! Progres pilar utama Lantai 2 ditargetkan selesai akhir Agustus 2026, sedangkan serah terima fisik seluruh gedung dijadwalkan pertengahan tahun 2027. Mohon dukungan doanya, Pak Jacob.";
        } else if (originalInput.includes('komitmen') || originalInput.includes('bayar') || originalInput.includes('janji')) {
          responseText = "Terima kasih atas kepedulian Bpk Jacob. Bapak memiliki sisa komitmen Janji Iman sebesar Rp 20.000.000 untuk 10 bulan ke depan (bulan ke-15 aktif). Bapak dapat memantau dan melunasinya via menu 'Janji Iman' di bar navigasi bawah.";
        } else if (originalInput.includes('rekening') || originalInput.includes('mandiri') || originalInput.includes('transfer')) {
          responseText = "Ya betul Pak Jacob, rekening resmi khusus dana pembangunan GMI Imanuel adalah Bank Mandiri AC: 115-00-8888-2026 atas nama GMI Imanuel Pembangunan.";
        } else if (originalInput.includes('semen') || originalInput.includes('material') || originalInput.includes('donasi')) {
          responseText = "Tentu Pak Jacob! Sumbangan material berupa semen, AC, kursi paten, hingga toilet set dapat langsung dipilih melalui menu 'Informasi' di bagian Material Konstruksi fisik.";
        } else {
          responseText = "Shalom Bapak Jacob, terima kasih atas pertanyaannya. Pesan Bapak telah kami catat di database sekretariat. Kami akan membantu menjawab lebih mendalam via WhatsApp di nomor " + userData.phone + " sesegera mungkin. Tuhan memberkati!";
        }
      } else {
        if (originalInput.includes('什么时候') || originalInput.includes('完成') || originalInput.includes('竣工')) {
          responseText = "感谢真主赞美！二层主要立柱预估在2026年8月底完工，整个教堂主体的竣工交付计划于2027年中旬。谢谢 Jacob 先生的祈祷支持。";
        } else if (originalInput.includes('承诺') || originalInput.includes('付款') || originalInput.includes('认献')) {
          responseText = "十分感谢 Jacob 先生的奉献心志。您目前剩余信愿认献金额为 20,000,000 印尼盾（剩余10个月）。您可以通过底部导航栏的“信愿认献”菜单直接查询并支持。";
        } else if (originalInput.includes('账户') || originalInput.includes('转账') || originalInput.includes('银行')) {
          responseText = "是的 Jacob 先生，GMI Imanuel 教堂建设的官方专用银行账户为：曼迪利银行（Bank Mandiri）帐号：115-00-8888-2026，户名：GMI Imanuel Pembangunan。";
        } else {
          responseText = "主内平安 Jacob 先生，谢谢您的咨询。我们已在堂会秘书处登记。稍后我们会通过您登记的微信/WhatsApp（" + userData.phone + "）直接与您取得详尽联系。愿主赐福！";
        }
      }

      const panitiaMsg = {
        id: String(Date.now() + 1),
        sender: 'Panitia',
        text: responseText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setChatLog(prev => [...prev, panitiaMsg]);
      setIsPanitiaTyping(false);
    }, 1500);
  };

  const startEditing = () => {
    setEditedName(userData.name);
    setEditedPhone(userData.phone);
    setEditedAddress(userData.address);
    setEditedSector(userData.sector);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: any) => {
    e.preventDefault();
    setUserData((prev: any) => ({
      ...prev,
      name: editedName,
      phone: editedPhone,
      address: editedAddress,
      sector: editedSector
    }));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center gap-1 flex-1 py-3 transition-colors ${
        activeTab === id ? 'text-[#B8860B]' : 'text-slate-400'
      }`}
    >
      <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 2} />
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
      {activeTab === id && (
        <motion.div layoutId="activeNav" className="w-1 h-1 bg-[#B8860B] rounded-full mt-1" />
      )}
    </button>
  );

  return (
    <div className="pb-24 relative">
      <header className="sticky top-0 z-50 bg-[#020617]/70 backdrop-blur-xl border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#B8860B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#B8860B]/20">
              <Church size={20} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black leading-tight text-white uppercase tracking-wider">
                {t.programTitle}
              </h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-[#B8860B] uppercase tracking-[0.1em]">
                {t.churchName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMessageOpen(true)}
              className="relative p-2 rounded-full border border-blue-500/20 hover:bg-white/5 transition-colors text-slate-300 flex items-center justify-center w-9 h-9"
              title={lang === Language.ID ? "Notifikasi & Tanya Panitia" : "通知与咨询委员会"}
            >
              <MessageSquare size={16} className="text-[#B8860B]" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#020617] animate-pulse" />
            </button>

            <button 
              onClick={() => setLang(lang === Language.ID ? Language.ZH : Language.ID)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 hover:bg-white/5 transition-colors text-xs font-bold text-slate-300 h-9"
            >
              <Languages size={14} />
              <span>{lang === Language.ID ? "ZH" : "ID"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Hero Church Render */}
              <div className="relative h-64 sm:h-96 w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-blue-100/50 group">
                <img 
                  src="/src/assets/images/church_facade_1780029344237.png" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt="Church Render"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Concept Render</span>
                  </div>
                  <h3 className="text-white font-black text-xl tracking-tight uppercase">Gedung Gereja Baru</h3>
                </div>
              </div>

              {/* Advanced Timeline (Moved to top under Hero render) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <History size={18} className="text-[#B8860B]" />
                  <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs">{t.timelineTitle}</h3>
                </div>

                <div className="bg-blue-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-blue-400/20 shadow-sm space-y-6">
                  {TIMELINE_DATA.map((item) => (
                    <div key={item.id} className="relative flex gap-6">
                      {item.image && item.status === 'completed' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm ring-2 ring-emerald-500/20"
                        >
                          <img src={item.image} className="w-full h-full object-cover opacity-80" alt={item.label} referrerPolicy="no-referrer" />
                        </motion.div>
                      )}
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-black uppercase tracking-widest ${
                            item.status === 'completed' ? 'text-emerald-400' : 
                            item.status === 'in-progress' ? 'text-[#B8860B]' : 'text-blue-300/40'
                          }`}>
                            {item.label}
                          </span>
                          <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-[#B8860B]">{item.actual}%</span>
                            <span className="text-[10px] font-medium text-blue-300/40">/ {item.planned}%</span>
                          </div>
                        </div>
                        
                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.planned}%` }}
                            className="absolute h-full bg-blue-400/5"
                          />
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.actual}%` }}
                            className={`absolute h-full rounded-full ${
                               item.actual >= item.planned ? 'bg-emerald-400' : 'bg-[#B8860B]'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Monitoring Video Section */}
              <LiveVideoSection lang={lang} />

              {/* Progress Summary Card & Bento Layout */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Progress Summary Card */}
                <div className="bg-blue-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-blue-400/20 shadow-sm relative overflow-hidden group md:col-span-1 flex flex-col justify-between">
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-blue-300/50 uppercase tracking-[0.2em]">{t.constructionProgress}</p>
                        <h2 className="text-3xl font-black text-white">{PROJECT_DATA.realizationPercent}% <span className="text-sm text-[#B8860B] font-bold">REALISASI</span></h2>
                      </div>
                      <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white transition-all duration-500">
                        <Building2 size={24} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-400/10 p-4 rounded-2xl border border-blue-400/10">
                        <p className="text-[10px] font-bold text-blue-300/60 uppercase mb-1">{t.currentFloorLabel}</p>
                        <p className="text-xl font-black text-[#B8860B]">{PROJECT_DATA.currentFloor}</p>
                      </div>
                      <div className="bg-blue-400/10 p-4 rounded-2xl border border-blue-400/10">
                        <p className="text-[10px] font-bold text-blue-300/60 uppercase mb-1">{t.totalFloorLabel}</p>
                        <p className="text-xl font-black text-white">{PROJECT_DATA.totalFloors}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl" />
                </div>

                {/* Gallery & Church-wide financial progress bar */}
                <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
                  {/* Photos Gallery */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { seed: 'basement_view', label: 'Basement' },
                      { seed: 'floor1_view', label: 'Lantai 1' },
                      { seed: 'rebar_work', label: 'Lt.2 Pengecoran' }
                    ].map((photo, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:scale-[1.02] transition-transform relative group">
                        <img src={`https://picsum.photos/seed/${photo.seed}/400/400`} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt={photo.label} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[8px] font-black text-white uppercase tracking-tighter">{photo.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Church-wide Fundraising Progress */}
                  <div className="bg-blue-900/40 backdrop-blur-md rounded-[2rem] p-6 border border-blue-400/20 shadow-sm space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-widest">{t.collected}</p>
                        <p className="text-lg font-black text-white">{formatCurrency(PROJECT_DATA.collectedAmount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-blue-300/50 uppercase tracking-widest">{t.totalGoal}</p>
                        <p className="text-xs font-bold text-blue-300/60">{formatCurrency(PROJECT_DATA.totalGoal)} ({Math.round((PROJECT_DATA.collectedAmount / PROJECT_DATA.totalGoal) * 100)}%)</p>
                      </div>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(PROJECT_DATA.collectedAmount / PROJECT_DATA.totalGoal) * 100}%` }}
                        className="h-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Material Donation List */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Package size={18} className="text-[#B8860B]" />
                  <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs">{t.materialDonationTitle}</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {PROJECT_DATA.materials.map(item => {
                    const progress = (item.fulfilled / item.needed) * 100;
                    return (
                      <div key={item.id} className="bg-blue-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-blue-400/20 flex flex-col gap-4 hover:border-[#B8860B]/30 transition-all group shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-400/10 rounded-xl flex items-center justify-center text-blue-300/60 group-hover:bg-[#B8860B]/10 group-hover:text-[#B8860B] transition-colors shrink-0">
                            <Package size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white">{item.name}</p>
                            <p className="text-[10px] text-blue-300/50 font-bold uppercase tracking-widest">{item.needed - item.fulfilled} {item.unit} Tersisa</p>
                          </div>
                          <button 
                            onClick={() => onViewMaterial(item)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B8860B] transition-all transform active:scale-95 shadow-md"
                          >
                            Sumbang
                          </button>
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-blue-300/40">
                            <span>{item.fulfilled} / {item.needed} {item.unit}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-[#B8860B] rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Prayer Subjects (Moved to the very bottom of home tab as requested) */}
              <div className="bg-blue-900/40 backdrop-blur-md rounded-3xl p-8 text-white relative overflow-hidden border border-blue-400/20 shadow-sm">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-[#B8860B]" />
                    <h3 className="font-bold uppercase tracking-widest text-xs text-blue-300/80">{t.prayerSubjects}</h3>
                  </div>
                  <div className="space-y-4">
                    {PROJECT_DATA.prayerSubjects.map((ps, i) => (
                      <div key={ps.id} className="flex gap-4 group">
                        <span className="text-[#B8860B] font-bold">0{i+1}</span>
                        <p className="text-sm text-blue-100/80 font-medium group-hover:text-white transition-colors">{ps.subject}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 blur-[80px]" />
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-black text-white uppercase tracking-widest px-2">{t.navHistory}</h2>
              
              {/* Monthly Reminder if unpaid / Tunggakan Notifikasi */}
              {!userData.isThisMonthPaid && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#D32F2F] p-8 rounded-[2rem] text-white shadow-xl shadow-red-900/10 flex flex-col sm:flex-row items-center gap-6"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 animate-bounce">
                    <AlertCircle size={32} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-black uppercase tracking-widest text-sm mb-1">
                      {lang === Language.ID ? 'Tagihan Bulan Ini' : '本月账单'}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">
                      {lang === Language.ID 
                        ? `Bapak/Ibu ${userData.name}, mohon selesaikan komitmen bulan ke-15 (Agustus 2027) sebesar ${formatCurrency(2000000)}.`
                        : `尊敬的 ${userData.name}，请完成第15个月（2027年8月）的承诺款 ${formatCurrency(2000000)}。`}
                    </p>
                  </div>
                  <button 
                    onClick={() => onPayCommitment(15)}
                    className="px-8 py-3 bg-white text-[#D32F2F] rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all transform active:scale-95 shrink-0 shadow-lg"
                  >
                    {t.payNow}
                  </button>
                </motion.div>
              )}

              {/* Personal Commitment Financial Resume */}
              <div className="bg-blue-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-blue-400/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 blur-3xl -z-10" />
                
                <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                  <Wallet size={16} className="text-[#B8860B]" />
                  <span>{lang === Language.ID ? 'Status Komitmen Pribadi' : '个人承诺状态'}</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-400/10 rounded-2xl border border-blue-400/10">
                    <p className="text-[10px] font-bold text-blue-300/60 uppercase mb-1">{t.commitmentTitle}</p>
                    <p className="font-black text-white">{formatCurrency(totalCommitment)}</p>
                  </div>
                  <div className="p-4 bg-[#B8860B]/10 rounded-2xl border border-[#B8860B]/20">
                    <p className="text-[10px] font-bold text-[#B8860B] uppercase mb-1">{t.realizationTitle}</p>
                    <p className="font-black text-[#B8860B]">{formatCurrency(realizedDonation)}</p>
                  </div>
                  <div className="p-4 bg-blue-400/10 rounded-2xl border border-blue-400/10 col-span-2 md:col-span-1">
                    <p className="text-[10px] font-bold text-blue-300/60 uppercase mb-1">{t.remainingTitle}</p>
                    <p className="font-black text-white">{formatCurrency(remainingDonation)}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-blue-300/60 uppercase tracking-wider">{lang === Language.ID ? 'Realisasi Komitmen' : '已承诺交付占比'}</span>
                    <span className="text-[#B8860B]">{Math.round((realizedDonation / totalCommitment) * 100)}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(realizedDonation / totalCommitment) * 100}%` }}
                      className="h-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]"
                    />
                  </div>
                </div>
              </div>

              {/* Histori Sumbangan List */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <History size={18} className="text-[#B8860B]" />
                  <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs">{t.historyTitle}</h3>
                </div>

                <div className="bg-blue-900/40 backdrop-blur-md rounded-3xl border border-blue-400/20 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-blue-400/10 border-b border-blue-400/10">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-blue-300/60 uppercase tracking-widest">{t.month}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-blue-300/60 uppercase tracking-widest">{t.amount}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-blue-300/60 uppercase tracking-widest">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(24)].map((_, i) => {
                        const monthNum = i + 1;
                        const isPaid = monthNum <= userData.monthsPassed;
                        const date = new Date(2026, 5 + i, 1); // Start June 2026
                        const monthLabel = date.toLocaleDateString(lang === Language.ID ? 'id-ID' : 'zh-CN', {
                          month: 'long',
                          year: 'numeric'
                        });
                        
                        return (
                          <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">M-{monthNum}</span>
                                <span className="text-[10px] text-blue-300/40 font-medium">{monthLabel}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-blue-200/80">{formatCurrency(userData.commitmentPerMonth)}</td>
                            <td className="px-6 py-4">
                              {isPaid ? (
                                  <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                                      {t.fulfilled}
                                  </span>
                              ) : (
                                  <button 
                                    onClick={() => onPayCommitment(monthNum)}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-[#B8860B]/20 text-[#B8860B] rounded-full text-[10px] font-black uppercase ring-1 ring-[#B8860B]/30 hover:bg-[#B8860B]/30 hover:text-white transition-colors"
                                  >
                                      <Clock size={10} />
                                      <span>{t.pay}</span>
                                  </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div 
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6"
            >
              {/* Announcements */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Bell size={18} className="text-[#B8860B]" />
                  <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs">{t.announcements}</h3>
                </div>
                  {PROJECT_DATA.announcements.map(ann => (
                    <div key={ann.id} className="bg-blue-900/40 backdrop-blur-md p-6 rounded-3xl border border-blue-400/20">
                      <p className="text-[10px] font-bold text-[#B8860B] uppercase mb-1">{ann.date}</p>
                      <h4 className="font-bold text-white mb-2">{ann.title}</h4>
                      <p className="text-sm text-blue-200/60 leading-relaxed font-medium">{ann.content}</p>
                    </div>
                  ))}
                </div>

              {/* Prayer Subjects */}
              <div className="bg-blue-900/40 backdrop-blur-md rounded-3xl p-8 text-white relative overflow-hidden border border-blue-400/20 shadow-sm">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-[#B8860B]" />
                    <h3 className="font-bold uppercase tracking-widest text-xs text-blue-300/80">{t.prayerSubjects}</h3>
                  </div>
                  <div className="space-y-4">
                    {PROJECT_DATA.prayerSubjects.map((ps, i) => (
                      <div key={ps.id} className="flex gap-4 group">
                        <span className="text-[#B8860B] font-bold">0{i+1}</span>
                        <p className="text-sm text-blue-100/80 font-medium group-hover:text-white transition-colors">{ps.subject}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 blur-[80px]" />
              </div>

              {/* Jobs */}
              <div className="bg-blue-900/40 backdrop-blur-md p-8 rounded-3xl border border-blue-400/20 space-y-6">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-[#B8860B]" />
                  <h3 className="font-bold text-blue-300 uppercase tracking-widest text-xs">{t.jobOpenings}</h3>
                </div>
                <div className="space-y-4">
                  {PROJECT_DATA.jobs.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-blue-400/10 rounded-2xl border border-blue-400/10">
                      <div>
                        <p className="text-sm font-bold text-white">{job.position}</p>
                        <p className="text-[10px] font-bold text-blue-300/40">Deadline: {job.deadline}</p>
                      </div>
                      <ChevronRight size={16} className="text-blue-300/60" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Profile Card Header */}
              <div className="bg-blue-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-blue-400/20 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-blue-400/25 rounded-2xl flex items-center justify-center text-[#B8860B] shadow-inner shrink-0 ring-4 ring-blue-400/15">
                  <User size={30} />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-xs font-bold text-blue-300/60 uppercase tracking-widest">{lang === Language.ID ? "Profil Anggota Jemaat" : "信徒个人尊容"}</p>
                  <h2 className="text-3xl font-black text-white">{userData.name}</h2>
                  <p className="text-blue-300/40 text-xs mt-1 font-bold">Anggota Jemaat Aktif GMI Imanuel</p>
                </div>
              </div>

              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-emerald-500/15 border border-emerald-500/25 rounded-3xl text-emerald-300 text-sm font-bold flex items-center gap-3 shadow-md"
                >
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
                  <div>
                    <p className="font-extrabold">{lang === Language.ID ? "Perubahan Data Berhasil Disimpan!" : "修改资料保存成功！"}</p>
                    <p className="text-xs text-emerald-300/80 font-normal mt-0.5">
                      {lang === Language.ID 
                        ? "Data jemaat Anda telah berhasil diperbarui di sistem local dan pengajuan penyesuaian telah diteruskan ke Sekretariat GMI Imanuel." 
                        : "您的信徒资料已成功在系统更新，且变更申请已提交给堂会秘书处。"}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Congregation Data & Form Panel */}
              <div className="bg-blue-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-blue-400/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 blur-3xl -z-10" />
                
                <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-6 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User size={16} className="text-[#B8860B]" />
                    <span>{lang === Language.ID ? 'Data Keanggotaan Jemaat' : '信会基本档案'}</span>
                  </span>
                  {!isEditing && (
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full">
                      {lang === Language.ID ? 'Terverifikasi' : '已验证'}
                    </span>
                  )}
                </h3>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest block px-1">Nama Lengkap</label>
                        <input 
                          type="text" 
                          value={editedName} 
                          onChange={(e) => setEditedName(e.target.value)} 
                          required
                          className="w-full bg-[#020617]/60 border border-blue-400/20 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all font-medium text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest block px-1">Wilayah / Sektor Keanggotaan</label>
                        <input 
                          type="text" 
                          value={editedSector} 
                          onChange={(e) => setEditedSector(e.target.value)} 
                          required
                          className="w-full bg-[#020617]/60 border border-blue-400/20 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all font-medium text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest block px-1">No. Telepon / WhatsApp</label>
                        <input 
                          type="text" 
                          value={editedPhone} 
                          onChange={(e) => setEditedPhone(e.target.value)} 
                          required
                          className="w-full bg-[#020617]/60 border border-blue-400/20 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all font-medium text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest block px-1">Alamat Rumah / Domisili</label>
                        <textarea 
                          value={editedAddress} 
                          onChange={(e) => setEditedAddress(e.target.value)} 
                          required
                          rows={3}
                          className="w-full bg-[#020617]/60 border border-blue-400/20 rounded-2xl p-4 text-white focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all font-medium text-sm resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-blue-400/10">
                      <button 
                        type="submit"
                        className="flex-1 py-3.5 bg-[#B8860B] hover:bg-[#B8860B]/80 text-white rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95"
                      >
                        {lang === Language.ID ? 'Simpan Perubahan' : '保存修改'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-3.5 border border-white/10 hover:bg-white/5 text-slate-300 rounded-full font-bold uppercase tracking-widest text-xs transition-colors"
                      >
                        {lang === Language.ID ? 'Batal' : '取消'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest">{lang === Language.ID ? "ID / No. Anggota Jemaat" : "信徒卡号"}</p>
                        <p className="text-sm font-semibold text-white">{userData.memberId}</p>
                      </div>
                      <div className="space-y-1 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest">{lang === Language.ID ? "Sektor Keanggotaan" : "所属教区/片区"}</p>
                        <p className="text-sm font-semibold text-white">{userData.sector}</p>
                      </div>
                      <div className="space-y-1 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest">{lang === Language.ID ? "No. Telepon / WhatsApp" : "电话号码"}</p>
                        <p className="text-sm font-semibold text-white">{userData.phone}</p>
                      </div>
                      <div className="space-y-1 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest">{lang === Language.ID ? "Status Keanggotaan" : "会友状态"}</p>
                        <p className="text-sm font-semibold text-[#B8860B]">{userData.status}</p>
                      </div>
                      <div className="space-y-1 p-4 bg-white/5 rounded-2xl border border-white/5 md:col-span-2">
                        <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest">{lang === Language.ID ? "Alamat Domisili" : "家庭住址"}</p>
                        <p className="text-sm font-semibold text-white leading-relaxed">{userData.address}</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-blue-400/10">
                      <button 
                        onClick={startEditing}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95"
                      >
                        <Languages size={14} className="rotate-180" />
                        <span>{lang === Language.ID ? "Gubah / Usulkan Perubahan Data" : "修改/申请资料变更"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Interactive Message & Notification Center Side Drawer */}
      <AnimatePresence>
        {isMessageOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div 
              key="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMessageOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
            />

            {/* Slide-over Panel */}
            <motion.div 
              key="chat-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-[#020617] border-l border-blue-500/10 shadow-2xl z-[101] flex flex-col pt-safe"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-blue-500/10 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-white text-base tracking-wide uppercase">
                    {lang === Language.ID ? "Sekretariat & Panitia" : "堂会建设秘书处"}
                  </h3>
                  <p className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider">
                    GMI IMANUEL PEMBANGUNAN
                  </p>
                </div>
                <button 
                  onClick={() => setIsMessageOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-blue-500/10 p-2 bg-slate-950/40">
                <button 
                  onClick={() => setMsgTab('notif')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all relative ${
                    msgTab === 'notif' ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === Language.ID ? "Notifikasi" : "通知消息"}
                  {msgTab === 'notif' && (
                    <motion.div layoutId="msgTabLine" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#B8860B] rounded-full" />
                  )}
                  {/* Unread indicator */}
                  <span className="absolute top-2.5 right-6 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>

                <button 
                  onClick={() => setMsgTab('chat')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all relative ${
                    msgTab === 'chat' ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === Language.ID ? "Tanya Panitia" : "咨询委员会"}
                  {msgTab === 'chat' && (
                    <motion.div layoutId="msgTabLine" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#B8860B] rounded-full" />
                  )}
                </button>
              </div>

              {/* Content Panel Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {msgTab === 'notif' ? (
                  <div className="space-y-4">
                    {/* Notification 1 */}
                    <div className="p-4 bg-blue-900/20 rounded-2xl border border-blue-500/10 space-y-2 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#B8860B]" />
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-[#B8860B] bg-[#B8860B]/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          JANJI IMAN
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">M-15 Active</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white">{lang === Language.ID ? "Sisa Komitmen Bulan Ke-15 Telah Aktif" : "第15个月认献已生效"}</h4>
                      <p className="text-xs text-slate-400/90 leading-relaxed font-semibold">
                        {lang === Language.ID 
                          ? "Yth. Bpk Jacob, sisa komitmen Janji Iman Anda bulan ke-15 (Agustus 2027) telah aktif dan dapat dibayarkan lewat Tab Janji Iman. Terima kasih atas berkat ketaatan Anda."
                          : "尊敬的 Jacob 先生，您第15个月（2027年8月）的信愿认献承诺已生效。您可以通过底部导航的主日奉献菜单完成支持。感恩您的慷慨奉献。"}
                      </p>
                    </div>

                    {/* Notification 2 */}
                    <div className="p-4 bg-blue-900/20 rounded-2xl border border-blue-500/10 space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          STRUKTUR
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">Hari ini</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white">{lang === Language.ID ? "Pengecoran Kolom Utama Lantai 2 Selesai" : "二层支柱浇筑大功告成"}</h4>
                      <p className="text-xs text-slate-400/90 leading-relaxed font-semibold">
                        {lang === Language.ID 
                          ? "Puji Tuhan! Pengecoran tiang pancang struktur utama area jemaat di Lantai 2 telah selesai dikerjakan 100% secara aman dan presisi."
                          : "感谢真主赞美！会众区二层承重柱立柱混凝土浇筑工作已安全且极高精准度地百分百完工。"}
                      </p>
                    </div>

                    {/* Notification 3 */}
                    <div className="p-4 bg-blue-900/20 rounded-2xl border border-blue-500/10 space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-blue-300 bg-blue-400/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          DONASI MATERIAL
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">2 hari lalu</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white">{lang === Language.ID ? "Kebutuhan AC Split & Sanitasi Dibuka" : "分体空调及卫浴工程认献开启"}</h4>
                      <p className="text-xs text-slate-400/90 leading-relaxed font-medium">
                        {lang === Language.ID 
                          ? "Panitia merilis detail spesifikasi AC Split (1.5 PK) dan Set Toilet TOTO. Jemaat dapat bersyukur mendukung berupa kuantitas item di Tab Informasi."
                          : "建委会已发布分体空调（1.5匹）以及TOTO卫浴套装的详细参数，欢迎在下方的“信息”界面查阅具体捐助所需。"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-between -m-6 p-6">
                    {/* Chat log list */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                      {chatLog.map((chat) => (
                        <div 
                          key={chat.id} 
                          className={`flex flex-col max-w-[85%] ${
                            chat.sender === 'Saya' ? 'ml-auto items-end' : 'mr-auto items-start'
                          }`}
                        >
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                            {chat.sender === 'Saya' ? (lang === Language.ID ? "Saya" : "我") : "Panitia"}
                          </p>
                          <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                            chat.sender === 'Saya' 
                              ? 'bg-[#B8860B] text-slate-950 rounded-tr-none' 
                              : 'bg-white/5 border border-white/5 text-white rounded-tl-none'
                          }`}>
                            {chat.text}
                          </div>
                          <span className="text-[9px] font-bold text-slate-600 mt-1">{chat.time}</span>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {isPanitiaTyping && (
                        <div className="flex flex-col items-start max-w-[85%]">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Panitia</p>
                          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-1.5 py-4 px-5">
                            <span className="w-1.5 h-1.5 bg-[#B8860B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-[#B8860B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-[#B8860B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input form */}
                    <form onSubmit={handleSendChat} className="mt-4 pt-3 border-t border-blue-500/10 flex gap-2">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={lang === Language.ID ? "Ketik pertanyaan Anda..." : "在此输入您要咨询的内容..."}
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B8860B] transition-colors font-semibold"
                      />
                      <button 
                        type="submit"
                        className="px-5 py-3 bg-[#B8860B] hover:bg-[#DAA520] text-slate-950 rounded-full font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        {lang === Language.ID ? "KIRIM" : "发送"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#020617]/80 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
        <div className="max-w-7xl mx-auto px-4 flex">
          <NavItem id="home" icon={Home} label={t.navHome} />
          <NavItem id="info" icon={Info} label={t.navInfo} />
          <NavItem id="history" icon={HeartHandshake} label={t.navHistory} />
          <NavItem id="profile" icon={User} label={t.navProfile} />
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [lang, setLang] = useState<Language>(Language.ID);
  
  const [userData, setUserData] = useState({
    name: "Jacob Anthonius M.",
    commitmentPerMonth: 2000000,
    totalDuration: 24,
    monthsPassed: 14,
    isThisMonthPaid: false,
    memberId: "GMI-IM-2015-0842",
    sector: "Sektor 3 - Kebon Jeruk",
    phone: "+62 812-3456-7890",
    address: "Jl. Pembangunan Raya No. 12, Kebon Jeruk, Jakarta Barat",
    status: "Anggota Jemaat Aktif (Sidi)"
  });

  const [viewedMaterial, setViewedMaterial] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const t = translations[lang];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === Language.ID ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCheckoutCommitment = (month: number) => {
    setCheckoutData({
        type: 'commitment',
        name: `Komitmen Bulanan (M-${month})`,
        amount: 2000000,
        label: `Bulan ke-${month}`
    });
  };

  const handleStartCheckoutMaterial = () => {
    setCheckoutData({
        type: 'material',
        name: viewedMaterial.name,
        amount: viewedMaterial.price * quantity,
        quantity: quantity,
        unit: viewedMaterial.unit
    });
    setViewedMaterial(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/30 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/40 rounded-full blur-[120px] opacity-40" />
        <div className="absolute top-[20%] right-[5%] w-[20%] h-[20%] bg-blue-500/10 rounded-full blur-[80px]" />
      </div>

      <AnimatePresence mode="wait">
        {/* Material Detail Modal */}
        {viewedMaterial && (
            <motion.div 
                key="material-detail"
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                className="fixed inset-0 z-[70] bg-[#020617] pt-20"
            >
                <header className="fixed top-0 inset-x-0 h-20 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-4">
                    <button onClick={() => setViewedMaterial(null)} className="p-2 -ml-2 text-slate-500 hover:text-white">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="font-black text-lg uppercase tracking-widest text-white">{t.materialDonationTitle}</h1>
                </header>

                <main className="max-w-2xl mx-auto px-6 py-10 space-y-10 pb-40 overflow-y-auto h-full">
                    <div className="aspect-video rounded-[2.5rem] bg-white/5 overflow-hidden shadow-inner ring-1 ring-white/5">
                        <img src={`https://picsum.photos/seed/${viewedMaterial.name}/1200/800`} className="w-full h-full object-cover opacity-80" alt={viewedMaterial.name} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.2em]">{t.materialSpec}</p>
                                <h2 className="text-3xl font-black text-white leading-tight">{viewedMaterial.name}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kekurangan</p>
                                <p className="text-xl font-black text-red-400">{viewedMaterial.needed - viewedMaterial.fulfilled} {viewedMaterial.unit}</p>
                            </div>
                        </div>

                        <div className="bg-blue-900/40 backdrop-blur-md p-6 rounded-3xl border border-blue-400/20 shadow-sm space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold text-blue-300/40 uppercase tracking-widest">
                                <span>Progres Terkumpul</span>
                                <span className="text-[#B8860B]">{Math.round((viewedMaterial.fulfilled / viewedMaterial.needed) * 100)}%</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(viewedMaterial.fulfilled / viewedMaterial.needed) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-[#B8860B] to-[#DAA520] rounded-full"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-blue-300/40 uppercase">
                                <span>Sudah: {viewedMaterial.fulfilled} {viewedMaterial.unit}</span>
                                <span>Target: {viewedMaterial.needed} {viewedMaterial.unit}</span>
                            </div>
                        </div>

                        <p className="text-sm text-blue-200/60 font-medium leading-relaxed bg-blue-900/20 p-6 rounded-3xl border border-blue-400/10 whitespace-pre-line">
                            {viewedMaterial.spec}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-blue-300/40 uppercase tracking-[0.2em]">{t.selectQuantity}</p>
                        <div className="flex items-center gap-8 justify-center bg-blue-900/20 p-8 rounded-[2.5rem] border border-blue-400/10">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:border-[#B8860B] hover:text-[#B8860B] transition-all active:scale-90"
                            >
                                <Minus size={24} />
                            </button>
                            <span className="text-4xl font-black text-white w-12 text-center">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:border-[#B8860B] hover:text-[#B8860B] transition-all active:scale-90"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">{t.totalDonation}</p>
                        <p className="text-3xl font-black text-[#B8860B] text-center">{formatCurrency(viewedMaterial.price * quantity)}</p>
                    </div>
                </main>

                <div className="fixed bottom-0 inset-x-0 p-6 bg-[#020617]/80 backdrop-blur-md border-t border-white/5 z-50">
                     <button 
                        onClick={handleStartCheckoutMaterial}
                        className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20"
                    >
                        {t.confirmPayment}
                    </button>
                </div>
            </motion.div>
        )}

        {/* Checkout Screen */}
        {checkoutData ? (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="min-h-screen bg-[#020617] z-[60] pb-24 text-white"
          >
            <header className="sticky top-0 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 px-6 h-20 flex items-center gap-4">
              <button 
                onClick={() => {
                  setCheckoutData(null);
                  setShowSuccess(false);
                  setPaymentMethod('');
                }}
                className="p-2 -ml-2 text-slate-500 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="font-black text-lg uppercase tracking-widest">{t.checkoutTitle}</h1>
            </header>

            <main className="max-w-xl mx-auto px-6 py-10 space-y-10">
              {!showSuccess ? (
                <>
                  <div className="bg-blue-900/40 backdrop-blur-md p-8 rounded-[2rem] border border-blue-400/20 flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#B8860B] rounded-2xl flex items-center justify-center text-white">
                      {checkoutData.type === 'commitment' ? <Wallet size={32} /> : <Package size={32} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-widest mb-1">{checkoutData.type === 'commitment' ? t.commitmentTitle : t.materialDonationTitle}</p>
                      <h2 className="text-2xl font-black text-white">{checkoutData.name}</h2>
                      <p className="text-sm font-bold text-blue-300/60">
                        {checkoutData.type === 'material' ? `${checkoutData.quantity} ${checkoutData.unit}` : checkoutData.label}
                      </p>
                      <p className="text-lg font-black text-[#B8860B] mt-2">{formatCurrency(checkoutData.amount)}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{t.selectPaymentMethod}</p>
                    
                    <div className="grid gap-3">
                      {[
                        { id: 'qris', name: t.paymentQRIS, icon: QrCode, color: 'bg-white/5 text-indigo-400' },
                        { id: 'va', name: t.paymentVA, icon: CreditCard, color: 'bg-white/5 text-emerald-400' },
                        { id: 'bank', name: t.paymentBankTransfer, icon: Building2, color: 'bg-white/5 text-amber-400' }
                      ].map(method => (
                        <button 
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-6 rounded-3xl border text-left flex items-center gap-4 transition-all ${
                            paymentMethod === method.id 
                            ? 'border-[#B8860B] bg-[#B8860B]/10 ring-1 ring-[#B8860B]' 
                            : 'border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.color}`}>
                            <method.icon size={24} />
                          </div>
                          <span className="font-bold text-slate-300 flex-1">{method.name}</span>
                          {paymentMethod === method.id && <div className="w-4 h-4 rounded-full border-4 border-[#B8860B]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={!paymentMethod}
                    onClick={() => {
                      if (checkoutData?.type === 'commitment') {
                        setUserData(prev => ({
                          ...prev,
                          monthsPassed: 15,
                          isThisMonthPaid: true
                        }));
                      }
                      setShowSuccess(true);
                    }}
                    className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20"
                  >
                    {t.confirmPayment}
                    <ArrowRight size={20} />
                  </button>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6 pt-10"
                >
                  <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-10 ring-8 ring-emerald-500/5">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-white">{t.paymentSuccess}</h2>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    {lang === Language.ID 
                    ? `Terima kasih atas kemurahan hati Bapak Jacob Anthonius M. untuk ${checkoutData.name}. Tuhan memberkati.`
                    : `谢谢您的慷慨捐助 ${checkoutData.name}，愿主保佑 Jacob Anthonius M. 先生。`}
                  </p>
                  <button 
                    onClick={() => {
                      setCheckoutData(null);
                      setPaymentMethod('');
                      setShowSuccess(false);
                    }}
                    className="px-10 py-4 border-2 border-white/10 rounded-full font-bold text-slate-500 hover:bg-white/5 hover:text-white transition-all"
                  >
                    {t.back}
                  </button>
                </motion.div>
              )}
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AppContent 
              t={t} 
              lang={lang} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              setLang={setLang} 
              formatCurrency={formatCurrency}
              onViewMaterial={(item: any) => setViewedMaterial(item)}
              onPayCommitment={(month: number) => handleCheckoutCommitment(month)}
              userData={userData}
              setUserData={setUserData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
