/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Language {
  ID = 'id',
  ZH = 'zh'
}

export interface Translation {
  // Navigation
  navHome: string;
  navHistory: string;
  navInfo: string;
  navUpdate: string;
  navProfile: string;

  // Header & General
  churchName: string;
  programTitle: string;
  welcome: string;
  payNow: string;
  back: string;

  // Home Section
  resumeTitle: string;
  materialDonationTitle: string;
  myDonation: string;
  commitmentTitle: string;
  realizationTitle: string;
  remainingTitle: string;
  totalGoal: string;
  collected: string;
  materialNeeds: string;
  additionalFunds: string;

  // History Section
  historyTitle: string;
  fulfilled: string;
  unfulfilled: string;
  month: string;
  amount: string;
  date: string;
  status: string;

  // Info Section
  infoTitle: string;
  announcements: string;
  prayerSubjects: string;
  jobOpenings: string;
  materialRequirements: string;

  // Update Section
  updateTitle: string;
  constructionProgress: string;
  photos: string;
  viewAll: string;
  currentFloorLabel: string;
  totalFloorLabel: string;

  // Checkout Section
  checkoutTitle: string;
  selectPaymentMethod: string;
  paymentBankTransfer: string;
  paymentQRIS: string;
  paymentVA: string;
  confirmPayment: string;
  paymentSuccess: string;
  materialSpec: string;
  selectQuantity: string;
  totalDonation: string;
  pay: string;
  timelineTitle: string;
  planned: string;
  actual: string;
  foundation: string;
  floorStructure: string;
  finishing: string;
}

export const translations: Record<Language, Translation> = {
  [Language.ID]: {
    navHome: "Beranda",
    navHistory: "Janji Iman",
    navInfo: "Informasi",
    navUpdate: "Update",
    navProfile: "Profil",
    churchName: "Gereja Methodist Indonesia - Jemaat Imanuel",
    programTitle: "1 Panggilan, 1 Hati, dan 1 Tujuan",
    welcome: "Selamat Datang,",
    payNow: "Bayar Sekarang",
    back: "Kembali",
    resumeTitle: "Resume Keuangan",
    materialDonationTitle: "Sumbangan Material",
    myDonation: "Donasi Saya",
    commitmentTitle: "Komitmen",
    realizationTitle: "Realisasi",
    remainingTitle: "Sisa",
    totalGoal: "Total Kebutuhan Dana",
    collected: "Dana Terkumpul",
    materialNeeds: "Kebutuhan Material",
    additionalFunds: "Dana Tambahan",
    historyTitle: "Histori Kewajiban",
    fulfilled: "Terlaksana",
    unfulfilled: "Belum Terlaksana",
    month: "Bulan",
    amount: "Jumlah",
    date: "Tanggal",
    status: "Status",
    infoTitle: "Pusat Informasi",
    announcements: "Pengumuman",
    prayerSubjects: "Subjek Doa",
    jobOpenings: "Lowongan Kerja",
    materialRequirements: "Kebutuhan Material Detail",
    updateTitle: "Update Pembangunan",
    constructionProgress: "Progres Fisik",
    photos: "Galeri Foto",
    viewAll: "Lihat Semua",
    currentFloorLabel: "Lantai Saat Ini",
    totalFloorLabel: "Total Lantai",
    checkoutTitle: "Penyelesaian Donasi",
    selectPaymentMethod: "Pilih Metode Pembayaran",
    paymentBankTransfer: "Transfer Bank",
    paymentQRIS: "QRIS",
    paymentVA: "Virtual Account",
    confirmPayment: "Konfirmasi & Bayar",
    paymentSuccess: "Terima kasih! Donasi Anda sedang diproses.",
    materialSpec: "Spesifikasi Material",
    selectQuantity: "Pilih Jumlah Sumbangan",
    totalDonation: "Total Sumbangan",
    pay: "Bayar",
    timelineTitle: "Timeline Pembangunan",
    planned: "Rencana",
    actual: "Aktual",
    foundation: "Pondasi & Basement",
    floorStructure: "Struktur Lantai",
    finishing: "Finishing & Interior",
  },
  [Language.ZH]: {
    navHome: "首页",
    navHistory: "认献承诺",
    navInfo: "信息",
    navUpdate: "更新",
    navProfile: "我的",
    churchName: "印度尼西亚卫理公会 - 以马内利堂",
    programTitle: "一个呼召，一颗心，一个目标",
    welcome: "欢迎,",
    payNow: "现在支付",
    back: "返回",
    resumeTitle: "财务摘要",
    materialDonationTitle: "材料捐赠",
    myDonation: "我的捐款",
    commitmentTitle: "承诺",
    realizationTitle: "已实现",
    remainingTitle: "剩余",
    totalGoal: "资金总需求",
    collected: "已筹集资金",
    materialNeeds: "材料需求",
    additionalFunds: "额外资金",
    historyTitle: "义务历史",
    fulfilled: "已通过",
    unfulfilled: "未完成",
    month: "月份",
    amount: "金额",
    date: "日期",
    status: "状态",
    infoTitle: "信息中心",
    announcements: "公告",
    prayerSubjects: "代祷事项",
    jobOpenings: "职位空缺",
    materialRequirements: "材料详情",
    updateTitle: "建设更新",
    constructionProgress: "建筑进度",
    photos: "照片库",
    viewAll: "查看全部",
    currentFloorLabel: "当前楼层",
    totalFloorLabel: "总楼层",
    checkoutTitle: "捐赠结算",
    selectPaymentMethod: "选择支付方式",
    paymentBankTransfer: "银行转账",
    paymentQRIS: "快捷支付 (QRIS)",
    paymentVA: "虚拟账户",
    confirmPayment: "确认并支付",
    paymentSuccess: "谢谢您的捐赠！",
    materialSpec: "材料规格",
    selectQuantity: "选择捐赠数量",
    totalDonation: "总捐款",
    pay: "支付",
    timelineTitle: "建设时间表",
    planned: "计划",
    actual: "实际",
    foundation: "地基与地下室",
    floorStructure: "楼层结构",
    finishing: "装修与室内",
  }
};
