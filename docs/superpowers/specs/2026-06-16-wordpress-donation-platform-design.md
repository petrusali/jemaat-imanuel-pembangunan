# Design Doc: Platform Donasi Pembangunan Gereja — WordPress Single-Tenant

**Date:** 2026-06-16
**Status:** Approved
**Product:** GMI Jemaat Imanuel Pembangunan — Portal Donasi & Informasi Jemaat

---

## 1. Context & Rationale

### Origin

Proyek ini semula dirancang sebagai platform custom multi-tenant dengan React 19 + Vite + Express, 830 FP, estimasi ~14 bulan. Setelah presentasi ke stakeholder donatur, feedback keras yang diterima:

1. **Timeline MVP terlalu lama** — pembangunan fisik gereja akan dimulai Agustus 2026
2. **Budget tidak realistis** — estimasi cost >100jt tidak mungkin masuk budget gereja sebagai yayasan sosial

### Pain Point Primer

Sekretariat gereja kesulitan melakukan **pendataan sumbangan jemaat**. Pencatatan manual via Excel rentan error, bukti transfer terselip di WhatsApp, dan tidak ada data integrity atas pembayaran. Kebutuhan paling krusial: **mencatat donasi, pembayaran online, dan menjaga integritas data pembayaran**.

### Keputusan Arsitektur

**WordPress open-source single-tenant** dipilih sebagai fondasi — bukan custom development dari nol. Rasional:

- 80% kebutuhan (auth, payment gateway, content management) sudah tersedia via plugin mature
- Hanya 1 custom plugin kecil untuk logic Janji Iman (M1-M24 tracking)
- Tim 3 orang bisa deliver dalam **1-1.5 bulan** dengan bantuan AI
- Biaya hosting ~Rp 44rb/bln, biaya pengembangan minimal karena mostly konfigurasi

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│          Hostinger WooCommerce Managed Hosting            │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              WordPress Open-Source                    │ │
│  │                                                       │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │ │
│  │  │   Ultimate    │  │ WooCommerce  │  │   Custom    │ │ │
│  │  │   Member      │  │              │  │   Plugin    │ │ │
│  │  │               │  │ Checkout     │  │   Janji     │ │ │
│  │  │ Register      │  │ Order Mgmt   │  │   Iman      │ │ │
│  │  │ Login (ID+PW) │  │ Payment      │  │   Tracker   │ │ │
│  │  │ Profile       │  │ Gateway      │  │             │ │ │
│  │  │ Admin Approve │  │ (Midtrans)   │  │ M1-M24 grid │ │ │
│  │  │ Role: jemaat/ │  │              │  │ Status      │ │ │
│  │  │ sekretariat   │  │ QRIS / VA /  │  │ per bulan   │ │ │
│  │  │               │  │ Upload Bukti │  │             │ │ │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │ │
│  │                                                       │ │
│  │  ┌──────────────────────────────────────────────────┐│ │
│  │  │  WordPress Core                                   ││ │
│  │  │  • Posts = Pengumuman / Subjek Doa / Loker        ││ │
│  │  │  • Custom Post Type = Progres Pembangunan          ││ │
│  │  │  • WP REST API (untuk PWA + future mobile)         ││ │
│  │  │  • PWA: Super PWA plugin (install to home screen)  ││ │
│  │  │  • Theme: GeneratePress + Elementor (Free)         ││ │
│  │  └──────────────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘

External touchpoints:
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Midtrans   │     │   WhatsApp       │     │   YouTube     │
│  (QRIS/VA)  │     │   (kontak link)  │     │   (embed live)│
└─────────────┘     └──────────────────┘     └──────────────┘
   callback ↑           ↗ click-to-chat        ↗ embed URL
```

### Prinsip Arsitektur

- **Single-tenancy** — 1 instalasi WordPress = 1 gereja. Tidak ada overhead multi-tenant, data isolation, atau RBAC antar organisasi.
- **Plugin-first** — semua fitur diusahakan via plugin yang sudah ada. Custom code hanya untuk logic spesifik Janji Iman.
- **PWA-first mobile** — mobile access via PWA (install to home screen, offline cache), bukan native app. WordPress PWA plugin gratis.
- **External services for non-core** — chat diarahkan ke WhatsApp (click-to-chat), CCTV diarahkan ke YouTube Live embed. Zero infrastructure.

---

## 3. Plugin Stack

| Plugin | Versi | Peran | Lisensi |
|--------|-------|-------|---------|
| **Ultimate Member** | latest | Registrasi jemaat, login (ID + password), profil, role management, admin approve/reject | Gratis |
| **WooCommerce** | latest | Engine checkout donasi, order management, order status workflow | Gratis |
| **Midtrans for WooCommerce** | latest | Payment gateway: QRIS, Virtual Account BCA/Mandiri, GoPay, ShopeePay | Gratis (official) |
| **Super PWA / PWA for WP** | latest | Install to home screen, offline cache, push notification, splash screen | Gratis |
| **Elementor** | free | Page builder drag-and-drop untuk custom UI/UX halaman jemaat | Gratis |
| **GeneratePress** | free | Theme ringan sebagai base, fast & accessible | Gratis |
| **Custom Plugin: Janji Iman Tracker** | 1.0 | Logic M1-M24 per jemaat, status pelunasan, integrasi ke WooCommerce order | Custom |

### Plugin yang Sengaja Tidak Digunakan

- **Subscription plugin** — tidak tepat karena Janji Iman bukan recurring auto-charge. Jemaat memilih sendiri kapan dan berapa di bulan tertentu.
- **Live chat plugin** — overhead tidak sebanding ketika WhatsApp sudah menjadi kanal komunikasi natural.

---

## 4. Custom Data Model — Janji Iman Tracker

### Tabel `wp_janji_iman`

```sql
CREATE TABLE wp_janji_iman (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,           -- FK ke wp_users.ID
    total_komitmen  DECIMAL(15,2) NOT NULL,    -- total komitmen 24 bulan
    nominal_per_bulan DECIMAL(15,2) NOT NULL,  -- cicilan per bulan
    mulai_bulan     DATE NOT NULL,             -- bulan pertama (e.g., 2026-08-01)
    status          VARCHAR(20) DEFAULT 'active', -- active | completed
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);
```

### Tabel `wp_janji_iman_payment`

```sql
CREATE TABLE wp_janji_iman_payment (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    janji_iman_id       BIGINT NOT NULL,         -- FK ke wp_janji_iman.id
    woocommerce_order_id BIGINT,                 -- FK ke wp_posts.ID (WooCommerce order)
    bulan_ke            TINYINT NOT NULL,        -- 1..24
    nominal             DECIMAL(15,2) NOT NULL,  -- nominal dibayarkan
    payment_method      VARCHAR(30),             -- qris | virtual_account | manual_transfer
    status              VARCHAR(20) DEFAULT 'pending', -- pending | verified | rejected
    verified_by         BIGINT,                  -- FK ke wp_users.ID (sekretariat/bendahara)
    verified_at         DATETIME,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_janji_iman_id (janji_iman_id),
    INDEX idx_order_id (woocommerce_order_id),
    INDEX idx_bulan_ke (bulan_ke),
    INDEX idx_status (status)
);
```

### Alur Integrasi dengan WooCommerce

```
Jemaat klik "Bayar Bulan ke-X"
        │
        ▼
  WooCommerce Add-to-Cart (produk virtual "Janji Iman Bulan X - Rp xxx")
        │
        ▼
  WooCommerce Checkout → Pilih metode (QRIS / VA / Transfer Manual)
        │
        ├─── QRIS / VA ───▶ Midtrans memproses pembayaran
        │                        │
        │                   callback Midtrans → WooCommerce order status = completed
        │                        │
        │                   hook: woocommerce_order_status_completed
        │                        │
        │                   custom handler: update wp_janji_iman_payment.status = verified
        │
        └─── Transfer Manual ───▶ Upload bukti di order notes
                                      │
                                 status = pending → Sekretariat review di wp-admin
                                      │
                                 approve → status = verified
                                 reject  → status = rejected + alasan
```

---

## 5. User Roles & Permissions

| Role | Sumber | Hak Akses |
|------|--------|-----------|
| **Jemaat** | Ultimate Member (custom role) | Lihat dashboard sendiri, bayar Janji Iman, lihat status pembayaran, lihat pengumuman/progres/loker, edit profil sendiri |
| **Sekretariat** | Ultimate Member (custom role) | Approve/reject registrasi, post pengumuman/subjek doa/loker, balas inquiry, update progres pembangunan |
| **Bendahara** | Ultimate Member (custom role) | Verifikasi pembayaran (approve/reject bukti transfer), lihat semua transaksi, ekspor laporan |
| **Administrator** | WordPress default | Full access wp-admin, kelola plugin, user, dan konfigurasi sistem |

Semua role di atas adalah WordPress roles — tidak ada custom RBAC engine yang perlu dibuat.

---

## 6. Feature Matrix — Phase 1 (1-1.5 bulan)

### Jemaat (Frontend)

| # | Feature | Realisasi | Effort |
|---|---------|-----------|--------|
| F1 | Registrasi akun (nama, no WA, alamat, sektor) | Ultimate Member registration form | Config |
| F2 | Login dengan ID + password | Ultimate Member login form | Config |
| F3 | Dashboard Janji Iman — grid M1-M24 | Custom plugin: shortcode `[janji_iman_dashboard]` | Build |
| F4 | Bayar Janji Iman bulanan via QRIS/VA | WooCommerce + Midtrans plugin | Config |
| F5 | Upload bukti transfer manual | WooCommerce order file upload | Config |
| F6 | Monitor status pembayaran (pending/verified/rejected) | Custom plugin: halaman "Status Pembayaran" | Build |
| F7 | Lihat pengumuman | WordPress Posts (category = Pengumuman) | Config |
| F8 | Lihat subjek doa | WordPress Posts (category = Subjek Doa) | Config |
| F9 | Lihat loker | WordPress Posts (category = Loker) | Config |
| F10 | Lihat progres pembangunan | Custom Post Type "Progres" + halaman display | Build |
| F11 | Tombol "Hubungi Panitia" → WhatsApp | Click-to-chat link `https://wa.me/62xxxx?text=...` | Config |

### Sekretariat & Bendahara (wp-admin)

| # | Feature | Realisasi | Effort |
|---|---------|-----------|--------|
| A1 | Approve/reject pendaftaran jemaat | Ultimate Member built-in | Config |
| A2 | Post pengumuman, subjek doa, loker | WordPress Posts (native) | Config |
| A3 | Verifikasi pembayaran manual | WooCommerce Order screen + custom status labels | Config |
| A4 | Lihat semua transaksi per jemaat | Custom plugin: admin page "Daftar Pembayaran" | Build |
| A5 | Update progres pembangunan (foto + deskripsi) | Custom Post Type "Progres" | Build |
| A6 | Ekspor data pembayaran (CSV) | Custom plugin: tombol ekspor | Build |

### Mobile Access — PWA (Progressive Web App)

| # | Feature | Realisasi | Effort |
|---|---------|-----------|--------|
| M1 | "Add to Home Screen" prompt | Super PWA plugin — otomatis muncul saat pertama buka | Config |
| M2 | Icon & splash screen GMI Imanuel | Super PWA settings — upload PNG icon 192px & 512px | Config |
| M3 | Offline cache (pengumuman, subjek doa, progres) | Super PWA + Service Worker — cache halaman statis | Config |
| M4 | Push notification (pengingat jatuh tempo Janji Iman) | Super PWA + WordPress notification API | Config + 1 hari |
| M5 | Responsive mobile UI | GeneratePress theme — sudah mobile-responsive by default | Config |

> **Tidak perlu native app.** Super PWA mengemas WordPress menjadi aplikasi yang bisa di-install ke home screen Android & iOS. Offline cache memastikan jemaat tetap bisa mengakses pengumuman & progres di area minim sinyal (lokasi konstruksi). WP REST API tetap tersedia jika di masa depan ingin native app.

**PWA effort total: 1-2 hari** (install plugin, konfigurasi icon/splash, testing di device).

---

## 7. Deployment & Infrastruktur

| Layer | Pilihan | Biaya/Bulan |
|-------|---------|-------------|
| Hosting | Hostinger WooCommerce Hosting (Business plan) | ~Rp 44.000 |
| Domain | `pembangunan-imanuel.org` atau subdomain | ~Rp 15.000 |
| SSL | Let's Encrypt (Hostinger bundled) | Gratis |
| Backup | Hostinger automated daily backup (bundled) | Gratis |
| CDN | Cloudflare Free Tier | Gratis |
| **Total operasional** | | **~Rp 59.000/bln** |

### Tech Specs Hosting
- PHP 8.x, MySQL 8.x, LiteSpeed Web Server
- WordPress pre-installed
- Auto-updates untuk WordPress core, themes, dan plugins
- 1-click staging environment (untuk testing sebelum deploy)

---

## 8. Phase Plan

| Phase | Target | Fokus | Timeline |
|-------|--------|-------|----------|
| **Phase 1** | Sebelum groundbreaking (Agustus 2026) | Donasi recording, pembayaran online, verifikasi bendahara, pengumuman, progres pembangunan | **1-1.5 bulan** (Juli-Agustus) |
| **Phase 2** | Pasca Phase 1 | Chat real-time (evaluasi — kemungkinan tetap WA), embed YouTube Live, Piagam Apresiasi PDF, notifikasi WhatsApp blast | Belum dijadwalkan |
| **Phase 3** | Nice to have | Multi-tenant (jika platform mau ditawarkan ke gereja lain), mobile app wrapper, analytics dashboard | Belum dijadwalkan |

---

## 9. Out of Scope (Eksplisit)

Fitur-fitur yang secara eksplisit **tidak akan dikerjakan** di semua phase:

- Sistem Akuntansi Keuangan (General Ledger) — ini di luar platform; gereja tetap menggunakan sistem akuntansi terpisah
- Manajemen Pastoral, Konseling, Absensi Kebaktian
- Multi-tenancy (kecuali ada demand dari gereja lain, dievaluasi ulang di Phase 3)
- Live CCTV via RTSP/HLS — digantikan embed YouTube Live
- Chat real-time Socket.io — digantikan WhatsApp click-to-chat

---

## 10. Risiko & Mitigasi

| Risiko | Impact | Mitigasi |
|--------|--------|----------|
| Midtrans onboarding delay | Tidak bisa terima pembayaran online | Siapkan fallback: 100% transfer manual dengan upload bukti, verifikasi manual oleh bendahara |
| WordPress plugin conflict | Fitur rusak setelah update | Staging environment Hostinger — test semua update di staging sebelum push ke production |
| Jemaat lansia kesulitan login | Adopsi rendah | Halaman login sederhana — cukup ID jemaat + password. Bisa dibantu sekretariat saat ibadah |
| Hosting down saat traffic tinggi | Tidak bisa diakses | Hostinger uptime guarantee 99.9%. Cloudflare cache halaman statis (pengumuman, progres) |

---

## 11. Success Metrics

| Metric | Target | Cara Ukur |
|--------|--------|-----------|
| Jemaat terdaftar | >200 akun dalam 1 bulan | Ultimate Member user count |
| Transaksi sukses via QRIS/VA | >80% dari total pembayaran | WooCommerce order report |
| Waktu verifikasi bukti transfer | <2 jam per transaksi | Audit log custom plugin |
| Akurasi data Janji Iman | 100% tidak ada selisih | Rekonsiliasi bulanan dengan data bendahara |
| Adopsi PWA | >60% jemaat terdaftar | Analytics (dapat ditambahkan via plugin) |

---

## 12. Glossary

| Istilah | Definisi |
|---------|----------|
| **Janji Iman** | Komitmen donasi jemaat selama 24 bulan untuk pembangunan gereja, dicicil per bulan (M1 s/d M24) |
| **NIJ** | Nomor Induk Jemaat — ID unik setiap jemaat di sistem |
| **QRIS** | Quick Response Code Indonesian Standard — standar pembayaran QR code nasional |
| **VA** | Virtual Account — nomor rekening virtual untuk pembayaran |
| **Midtrans** | Payment gateway Indonesia (milik GoTo Group) |
| **Single-tenancy** | 1 instalasi melayani 1 gereja saja, bukan multi-organisasi |

---

*Design ini menggantikan spesifikasi sebelumnya di PRD.md dan chat discussion. Perubahan utama: custom development multi-tenant React → WordPress single-tenant plugin-first. Timeline: 14 bulan → 1-1.5 bulan.*
