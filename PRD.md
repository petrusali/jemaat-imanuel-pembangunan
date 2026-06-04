# PRD High Level Business
## Portal Pembangunan GMI Jemaat Imanuel Pembangunan

```
Key things to remember:
1. Pastikan setiap modul pendukung (WhatsApp Gateway, Payment Gateway, PWA, Piagam Apresiasi, Ledger) dijabarkan secara rinci dalam Business Use Case (BUC).
2. Sistem Admin Panel harus dideskripsikan secara eksplisit sebagai bagian utama dari proses bisnis.
3. Keterkaitan antara unggah bukti transfer manual jemaat dan antrean verifikasi bendahara harus terjalin jelas.
```

# Summary
Proyek pembangunan gedung baru GMI Jemaat Imanuel Pembangunan dengan tema **"1 Panggilan, 1 Hati, 1 Tujuan"** memerlukan platform digital terpadu. Sistem ini terdiri dari aplikasi jemaat berorientasi *mobile* (*Progressive Web App*) dan portal admin untuk panitia pembangunan. 

Aplikasi ini mencakup modul **Autentikasi WhatsApp OTP & Registrasi Mandiri**, dasbor pemantauan **Janji Iman bulanan** beserta penerbitan **Piagam Apresiasi digital**, integrasi **Payment Gateway (QRIS/VA)** dan **Upload Bukti Transfer Manual**, dasbor transparansi **Financial Ledger (Laporan Keuangan Terbuka)**, katalog **Sumbangan Material**, **Live CCTV Streaming**, serta fitur komunikasi **Tanya Panitia (Live Chat & WhatsApp Gateway)**.

# Propertie
```
Product Owner      : @mention Product Owner
Product Designer   : @mention Product Designer
Tech Lead          : @mention Tech Lead
Team               : Team Pembangunan GMI Imanuel
Roadmap            : [Roadmap Pembangunan GMI Imanuel](https://roadmap.example.com/gmi-imanuel)
Initiative ID      : GMI-IMANUEL-PEMBANGUNAN
Production Version : NOT YET RELEASED
```

# Table of Contents
*   [Strategy](#strategy)
    *   [Customer Problem vs Proposed Solution](#customer-problem-vs-proposed-solution)
    *   [Measures of Success](#measures-of-success)
    *   [Assumptions (Optional)](#assumptions-optional)
    *   [Go to Market Plan](#go-to-market-plan)
*   [Review & Feedback](#review--feedback)
*   [Progressive Elaboration](#progressive-elaboration)
    *   [Business Use Case (BUC)](#business-use-case-buc)
    *   [List Epics](#list-epics)
    *   [Releases](#releases)

---

# Strategy

## Customer Problem vs Proposed Solution

```
Customer Problem 1:
Jemaat terdaftar mengalami kesulitan login menggunakan password tradisional (sering lupa kata sandi, terutama jemaat lansia), serta tidak adanya metode pendaftaran mandiri jemaat baru yang terverifikasi ke sistem induk gereja.
```
```
Proposed Solution 1:
Menyediakan fitur masuk tanpa password (passwordless) menggunakan verifikasi WhatsApp OTP (WhatsApp Gateway) serta formulir Registrasi Mandiri jemaat/simpatisan yang terintegrasi dengan persetujuan (approval) admin sekretariat.
```

```
Customer Problem 2:
Jemaat kesulitan memantau status Janji Iman bulanan selama 24 bulan dan tidak ada apresiasi resmi bagi jemaat yang telah melunasi seluruh janji imannya untuk meningkatkan retensi donasi.
```
```
Proposed Solution 2:
Membuat dasbor Janji Iman M-1 s/d M-24 dengan status pelunasan visual, disertai sistem generator otomatis Piagam Apresiasi Digital (PDF resmi yang ditandatangani Pendeta & Ketua Pembangunan) ketika komitmen 24 bulan selesai dibayarkan.
```

```
Customer Problem 3:
Prosedur pembayaran komitmen atau donasi masih manual melalui transfer bank tanpa pencocokan otomatis, atau bukti transfer jemaat sering hilang/terselip di chat WhatsApp panitia.
```
```
Proposed Solution 3:
Integrasi Payment Gateway (Midtrans/Xendit) untuk verifikasi instan via QRIS dan Virtual Account, serta menyediakan modul khusus untuk mengunggah berkas foto bukti transfer manual (Upload Bukti Transfer) yang masuk ke antrean verifikasi Bendahara di Admin Panel.
```

```
Customer Problem 4:
Jemaat mencurigai pengelolaan dana pembangunan karena tidak adanya keterbukaan finansial yang mendetail mengenai alokasi belanja proyek dan penerimaan sumbangan secara harian/mingguan.
```
```
Proposed Solution 4:
Menyediakan modul Financial Ledger (Buku Kas Terbuka) di aplikasi jemaat yang menyajikan riwayat pengeluaran dan pemasukan dana proyek secara transparan yang telah divalidasi oleh tim bendahara di Admin Panel.
```

```
Customer Problem 5:
Aplikasi sulit diakses saat jemaat berada di dalam gedung gereja atau area proyek yang memiliki jangkauan sinyal seluler kurang stabil.
```
```
Proposed Solution 5:
Mengembangkan aplikasi jemaat berbasis PWA (Progressive Web App) dengan service workers agar data pengumuman, pokok doa, CCTV snapshot terakhir, dan riwayat Janji Iman tetap dapat diakses secara offline.
```

```
Customer Problem 6:
Panitia pembangunan tidak memiliki sistem satu pintu untuk mengelola data jemaat, logistik material masuk, memverifikasi transfer manual, membalas chat jemaat, dan mengirim notifikasi broadcast.
```
```
Proposed Solution 6:
Membangun Admin Panel khusus panitia yang dibagi berdasarkan peran (Treasurer untuk verifikasi uang & ledger; Project Coordinator untuk logistik & timeline; Secretary untuk kelola akun, chat bot, dan notifikasi WhatsApp Gateway).
```

### Affected Target Market (Optional)
*   500+ Jemaat aktif dan simpatisan GMI Jemaat Imanuel Pembangunan Jakarta.
*   Panitia Pembangunan (Bendahara, Sekretaris, Koordinator Lapangan, dan Pendeta Jemaat).

---

## Measures of Success

```
Objectives:
Meningkatkan akurasi data keuangan, partisipasi aktif jemaat, dan transparansi administrasi pembangunan gereja.
```
```
Key Result:
1. 100% data transaksi pembayaran terverifikasi otomatis via Payment Gateway atau terverifikasi < 2 jam via antrean Admin Panel.
2. Adopsi PWA mencapai > 80% dari total pengguna jemaat aktif untuk memastikan aksesibilitas informasi di area minim sinyal.
3. Tingkat kepuasan transparansi jemaat meningkat dengan rating >= 4.5/5.0 berdasarkan evaluasi Financial Ledger terbuka.
```
```
Reasoning:
Dengan adanya digitalisasi sistem satu pintu, integrasi gerbang pembayaran, dan portal administrasi bendahara, kebocoran data keuangan dapat dihindari dan pelayanan panitia menjadi lebih akurat.
```

---

## Assumptions (Optional)

```
Assumption:
Layanan penyedia WhatsApp Gateway (seperti Fonnte atau Wablas) memiliki tingkat pengiriman (delivery rate) OTP dan notifikasi di atas 98% tanpa delay lebih dari 10 detik.
```
```
Assumption Testing:
Melakukan stress testing pengiriman OTP ke 100 nomor pengujian dari berbagai operator seluler secara bersamaan dan mencatat tingkat kegagalan pengiriman.
```

---

## Go to Market Plan

*   **PWA Installation Campaign**: Mengajarkan jemaat cara menambahkan aplikasi ke layar utama (*Add to Home Screen*) saat warta lisan ibadah minggu raya.
*   **Brosur QR Code**: Menyediakan brosur fisik di meja penerima tamu ibadah yang memuat QR code login instan ke portal pembangunan.

---

# Review & Feedback

```
Stakeholder: Pendeta Jemaat & Ketua Pembangunan GMI Imanuel
PIC Feedback: Menyetujui template resmi Piagam Apresiasi Digital dan skema rilis Financial Ledger.
```
```
Stakeholder: Bendahara & Tim Logistik Pembangunan
PIC Feedback: Menguji alur pencocokan mutasi bank dengan antrean verifikasi bukti transfer di Admin Panel.
```

---

# Progressive Elaboration

## Business Use Case (BUC)

### Business Use Case 1: Autentikasi Pengguna & Pendaftaran Mandiri (Login & Self-Registration)

```
Description:
Menyediakan mekanisme registrasi akun jemaat/simpatisan baru secara mandiri di aplikasi, serta proses masuk aplikasi (login) secara praktis menggunakan WhatsApp OTP.
```

#### Normal Flow of Activities
1.  **Akses Halaman**: Calon pengguna membuka aplikasi jemaat dan memilih **"Daftar Akun Baru"**.
2.  **Input Formulir Registrasi**: Pengguna mengisi data nama lengkap, nomor WhatsApp aktif, alamat domisili, sektor wilayah keanggotaan, serta memilih status (Anggota Jemaat Aktif GMI / Simpatisan).
3.  **Pengajuan Registrasi**: Pengguna menekan tombol "Daftar". Sistem menyimpan data dengan status akun *Pending Verification*.
4.  **Tinjauan Admin (Admin Panel)**: Admin sekretariat membuka modul *Member Management* di Admin Panel, meninjau permohonan pendaftaran baru, lalu menyetujuinya.
5.  **Penerbitan NIJ**: Sistem menerbitkan Nomor Induk Jemaat (NIJ) otomatis untuk anggota terverifikasi dan mengirim pesan konfirmasi sukses via WhatsApp Gateway.
6.  **Alur Login (Masuk Aplikasi)**:
    *   Pengguna memasukkan nomor WhatsApp terdaftar di halaman login.
    *   Sistem memanggil backend untuk mengirim kode OTP 6 digit via WhatsApp Gateway.
    *   Pengguna memasukkan OTP. Sistem memvalidasi dan mengeluarkan token JWT untuk otorisasi sesi.

#### Exceptions
1.  *Nomor WA Tidak Aktif*: Jika WhatsApp Gateway gagal mengirim OTP karena nomor tidak memiliki akun WhatsApp, sistem memunculkan pesan error dan meminta pengguna memasukkan nomor alternatif.
2.  *Pendaftaran Ditolak*: Jika nama pendaftar tidak terdata pada buku induk jemaat fisik, admin menolak pendaftaran dan sistem mengirim notifikasi penolakan via WA.

#### Non-Functional Requirements
1.  *Security*: OTP wajib kedaluwarsa dalam waktu 3 menit. Token JWT dienkripsi menggunakan algoritma HS256.

---

### Business Use Case 2: Portal Admin - Manajemen & Verifikasi Pembayaran (Treasurer Panel & Upload Bukti Transfer)

```
Description:
Menjelaskan bagaimana jemaat mengunggah bukti transfer manual ketika memilih pembayaran tradisional, serta bagaimana bendahara memverifikasi transaksi tersebut di Admin Panel.
```

#### Normal Flow of Activities
1.  **Checkout Transaksi**: Jemaat berada di halaman Checkout donasi (Janji Iman atau donasi material) dan memilih opsi pembayaran **"Transfer Bank Manual"**.
2.  **Transfer Dana**: Jemaat mentransfer dana ke rekening Mandiri resmi GMI Imanuel.
3.  **Upload Bukti Transfer**: Jemaat mengunggah berkas gambar struk ATM atau screenshot m-banking di kolom input **"Unggah Bukti Transfer"** pada aplikasi jemaat.
4.  **Pencatatan Antrean**: Sistem mencatat pembayaran dengan status *Pending Verification* dan menaruhnya ke antrean verifikasi bendahara.
5.  **Akses Admin Panel (Treasurer)**: Bendahara masuk ke portal Admin Panel menggunakan kredensial admin dan membuka halaman **"Verifikasi Transaksi"**.
6.  **Pemeriksaan Bukti**: Bendahara melihat daftar transaksi tertunda, mengklik rincian transaksi untuk memperbesar gambar bukti transfer yang diunggah jemaat.
7.  **Persetujuan / Penolakan**:
    *   Jika dana masuk sesuai mutasi bank, Bendahara mengklik tombol **"Approve"**. Status transaksi berubah menjadi *Success* dan kartu Janji Iman jemaat terupdate otomatis.
    *   Jika tidak sesuai/gambar blur, Bendahara mengklik **"Reject"** dan mengisi alasan penolakan.
8.  **Pesan WhatsApp Gateway**: Sistem mengirimkan notifikasi otomatis ke WA jemaat tentang status verifikasi (Sukses/Gagal).

#### Exceptions
1.  *Bukti Transfer Palsu*: Jika bendahara mendeteksi indikasi bukti transfer palsu, admin menandai transaksi sebagai *Refuted* (Ditolak Keras) dan memblokir sementara pengajuan pembayaran dari nomor jemaat tersebut.

#### Non-Functional Requirements
1.  *Usability*: Halaman pemutar gambar bukti transfer di Admin Panel harus memiliki fitur rotasi dan zoom gambar minimal 2x lipat.

---

### Business Use Case 3: Pembayaran Janji Iman Bulanan & Piagam Apresiasi Digital

```
Description:
Mengatur pengelolaan cicilan bulanan komitmen Janji Iman jemaat selama 24 bulan dan penerbitan Piagam Apresiasi Digital sebagai penghargaan pelunasan.
```

#### Normal Flow of Activities
1.  Jemaat memantau status cicilan bulanan (M-1 s/d M-24) di tab **"Janji Iman"**.
2.  Setiap bulan, jemaat membayar kewajiban bulan berjalan via integrasi Payment Gateway (QRIS/VA) atau transfer manual.
3.  Sistem mencatat pelunasan bertahap. Ketika cicilan mencapai bulan terakhir (M-24) berstatus *Success/Lunas*:
4.  **Generator Piagam Otomatis**: Sistem backend memicu pembuatan Piagam Apresiasi Digital.
5.  **Penandatanganan Digital**: Sistem menghasilkan file PDF Piagam resmi yang memuat nama jemaat, ID anggota, total donasi Janji Iman selama 24 bulan, dibubuhi tanda tangan digital Pendeta dan Ketua Pembangunan beserta stempel resmi gereja.
6.  **Pengunduhan Piagam**: Tombol **"Unduh Piagam Apresiasi"** muncul di dasbor Janji Iman jemaat. Jemaat dapat mengunduh piagam tersebut kapan saja dalam resolusi tinggi.

#### Exceptions
1.  *Keterlambatan Pembayaran*: Jika jemaat melewati batas waktu jatuh tempo bulanan (misal tanggal 10 setiap bulan), sistem otomatis memicu WhatsApp Gateway untuk mengirim pesan pengingat sopan.

#### Non-Functional Requirements
1.  *Performance*: Generator PDF piagam harus menyelesaikan pembuatan berkas dalam waktu < 5 detik setelah pembayaran M-24 terverifikasi.

---

### Business Use Case 4: Dasbor Transparansi Keuangan Terbuka (Financial Ledger)

```
Description:
Menyediakan halaman pelaporan keuangan terbuka bagi jemaat untuk memantau pengeluaran belanja konstruksi proyek dan pemasukan donasi secara berkala.
```

#### Normal Flow of Activities
1.  **Akses Menu**: Jemaat masuk ke aplikasi jemaat dan membuka tab **"Informasi"** -> **"Buku Kas Pembangunan (Financial Ledger)"**.
2.  **Tampilan Ledger**: Halaman menampilkan ringkasan saldo kas, daftar pemasukan (donasi terverifikasi jemaat secara anonim/inisial), dan daftar pengeluaran belanja proyek (pembelian bahan bangunan, upah pekerja, administrasi).
3.  **Pencatatan Pengeluaran oleh Admin**: Koordinator proyek memasukkan data belanja proyek di modul *Expense Tracker* pada Admin Panel dengan melampirkan berkas invoice/kuitansi pembelian bahan.
4.  **Filter & Unduh**: Jemaat dapat memfilter buku kas berdasarkan bulan berjalan dan mengunduh berkas laporan bulanan terverifikasi berformat PDF.

#### Non-Functional Requirements
1.  *Data Integrity*: Pengeluaran yang dicatat di database tidak dapat dihapus (*immutable log*), melainkan hanya dapat disesuaikan menggunakan jurnal pembalik untuk menjamin transparansi akuntansi.

---

### Business Use Case 5: Pengelolaan Donasi Material Konstruksi & Logistik

```
Description:
Mengatur bagaimana jemaat memilih barang fisik konstruksi di katalog, menghitung jumlah sumbangan, dan bagaimana panitia mengelola logistik penerimaan material di lapangan.
```

#### Normal Flow of Activities
1.  Jemaat melihat katalog barang di bagian "Sumbangan Material" (Beranda).
2.  Jemaat memilih item (misal: "Semen PPC 40kg"), mengatur jumlah sumbangan, dan membayar nominal ekuivalen di halaman checkout.
3.  Admin logistik menerima notifikasi donasi material terverifikasi di portal Admin Panel.
4.  Admin memesan material fisik tersebut dari vendor dan merekrut kurir pengiriman.
5.  Barang tiba di lokasi proyek, admin logistik memperbarui status barang di Admin Panel dari *Pending* menjadi *Tiba di Lapangan*.
6.  Jumlah pemenuhan material di aplikasi jemaat bertambah secara real-time.

---

### Business Use Case 6: Live Video Monitoring CCTV Proyek & Timeline Progres Fisik

```
Description:
Menampilkan progres pengerjaan konstruksi fisik secara visual melalui pemutar video live stream dan diagram lini masa pengerjaan lantai.
```

#### Normal Flow of Activities
1.  Jemaat membuka bagian CCTV pemantauan di aplikasi jemaat.
2.  Sistem memuat pemutar video HLS stream yang dihubungkan ke encoder kamera di lapangan.
3.  Jemaat dapat melihat diagram timeline (Basement - Lantai 7) yang diperbarui secara berkala oleh koordinator lapangan melalui Admin Panel.

---

### Business Use Case 7: Layanan Tanya Panitia & Notifikasi Broadcast (WhatsApp Gateway & Chat Admin)

```
Description:
Menyediakan sarana komunikasi real-time menggunakan WebSocket antara jemaat dengan admin sekretariat, chatbot balasan otomatis, serta pesan broadcast via WhatsApp.
```

#### Normal Flow of Activities
1.  Jemaat mengirimkan pertanyaan melalui tombol chat "Tanya Panitia" di aplikasi jemaat.
2.  **Penanganan Chatbot**: Sistem mencocokkan teks pesan dengan database kata kunci (*auto-response keywords*) untuk membalas pertanyaan umum secara otomatis dalam < 1 detik.
3.  **Penerusan ke Admin Panel**: Jika tidak ada kata kunci yang cocok, pesan diteruskan secara real-time (Socket.io) ke halaman obrolan *Secretary Chat Console* di Admin Panel.
4.  **Respons Manual**: Admin sekretariat membalas pesan jemaat dari Admin Panel, yang langsung muncul di layar jemaat.
5.  **Broadcast Berita**: Admin menulis pengumuman dan memicu pengiriman pesan siaran massal ke seluruh jemaat terdaftar menggunakan integrasi WhatsApp Gateway.

---

### Business Use Case 8: Keandalan Aplikasi Secara Offline & PWA (Progressive Web App)

```
Description:
Memastikan aplikasi jemaat tetap dapat diakses di perangkat seluler jemaat dengan performa yang stabil meskipun dalam kondisi tanpa koneksi internet di area proyek.
```

#### Normal Flow of Activities
1.  **Pemasangan PWA**: Saat jemaat pertama kali membuka situs web portal pembangunan, browser menampilkan anjuran pop-up **"Pasang Aplikasi GMI Pembangunan"** (*Add to Home Screen*).
2.  **Instalasi**: Jemaat mengklik pasang, aplikasi terinstal di handphone seperti aplikasi native.
3.  **Caching Otomatis**: Service Worker menyimpan aset statis aplikasi (HTML, CSS, JS, font, gambar render konsep) serta data dinamis terakhir (riwayat Janji Iman, pengumuman terbaru) ke dalam Cache Storage.
4.  **Akses Offline**: Ketika jemaat berada di lantai basement konstruksi yang tidak ada sinyal internet, jemaat tetap dapat membuka aplikasi, melihat profil kartu jemaat, membaca pokok doa, dan melihat riwayat cicilan lunas terakhir.
5.  **Background Sync**: Jika jemaat mengetik pesan pertanyaan di tab Tanya Panitia saat offline, pesan disimpan di *IndexedDB* dan secara otomatis dikirim ke server begitu perangkat mendeteksi adanya koneksi internet kembali (*Background Sync*).

---

## List Epics

1.  **EPIC-1: Autentikasi Pengguna & Registrasi Mandiri Jemaat** (Login WhatsApp OTP, registrasi mandiri, persetujuan admin panel sekretariat).
2.  **EPIC-2: Dasbor Janji Iman & Piagam Apresiasi Digital** (Tabel cicilan bulanan M-1 s/d M-24, tagihan jatuh tempo, generator PDF Piagam Apresiasi Lunas).
3.  **EPIC-3: Integrasi Payment Gateway & Modul Upload Bukti Transfer** (API Midtrans/Xendit QRIS & VA, input file upload bukti transfer manual).
4.  **EPIC-4: Portal Admin Bendahara & Modul Financial Ledger** (Verifikasi transfer manual, rekonsiliasi otomatis, expense tracker, ekspor PDF ledger terbuka).
5.  **EPIC-5: Katalog Material, Kalkulator Donasi & Modul Logistik** (Daftar kebutuhan material, kalkulator donasi material, kartu stok logistik admin).
6.  **EPIC-6: Lini Masa Progres Konstruksi & Player Live CCTV Stream** (Fase pengerjaan timeline, HLS stream player CCTV, galeri foto proyek).
7.  **EPIC-7: Obrolan Tanya Panitia (Socket.io), Chatbot Auto-Response & WhatsApp Gateway Integration** (Helpdesk chat admin, bot kata kunci, broadcast notifikasi WhatsApp).
8.  **EPIC-8: Progressive Web Application (PWA) Offline Caching & Background Sync** (Service workers, instalasi home screen, caching IndexedDB offline).

---

## Releases

### Release #1: MVP (Minimum Viable Product - Keuangan, Transaksi, & Admin Keuangan)
```
Jira Epic              Status        Modules                    Versions
EPIC-1, EPIC-2,        UNRELEASED    auth-module,               v1.0.0
EPIC-3, EPIC-4,                      janji-iman-module,
EPIC-8                               payment-gateway-module,
                                     admin-treasurer-panel,
                                     pwa-module
```
*   **Release Summary**: Tahap rilis MVP berfokus pada kelancaran operasional keuangan. Jemaat dapat menginstal aplikasi sebagai PWA, melakukan login menggunakan OTP WhatsApp Gateway, mendaftar mandiri, melihat sisa komitmen Janji Iman, serta melakukan pembayaran cicilan bulanan lewat Payment Gateway (QRIS/VA) atau transfer manual dengan mengunggah foto bukti transfer. Bendahara memiliki akses Admin Panel untuk memproses antrean verifikasi bukti transfer manual, memantau *ledger* keuangan terbuka (Financial Ledger), dan jemaat yang lunas 24 bulan langsung mendapatkan Piagam Apresiasi Digital otomatis.
*   **Release Doc**: [Link to Release Doc MVP](file:///e:/Project/remix_-remix_-jemaat-imanuel-pembangunan/docs/release_mvp.md)
*   **Sign-Off Date**: // to add a date
*   **Sign-Off**: @ to add

---

### Release #2: Keterlibatan Jemaat, CCTV & Konsol Sekretariat
```
Jira Epic              Status        Modules                    Versions
EPIC-5, EPIC-6,        UNRELEASED    material-donation-module,  v1.0.0
EPIC-7                               cctv-stream-module,
                                     chat-communication-module,
                                     admin-secretary-panel
```
*   **Release Summary**: Rilis tahap kedua difokuskan pada pengayaan fitur interaksi jemaat dan operasional lapangan. Menyediakan pemantauan Live CCTV proyek, grafik timeline fisik per lantai, donasi material konstruksi beserta modul logistik di Admin Panel, serta sistem komunikasi interaktif (Tanya Panitia) real-time menggunakan WebSocket yang terintegrasi dengan chatbot auto-response dan pengiriman siaran pesan massal oleh sekretariat di Admin Panel.
*   **Release Doc**: [Link to Release Doc Phase 2](file:///e:/Project/remix_-remix_-jemaat-imanuel-pembangunan/docs/release_phase2.md)
*   **Sign-Off Date**: // to add a date
*   **Sign-Off**: @ to add
