# PRD High Level Business

```
Key things to remember
```
# Summary

# Propertie

# Table of Contents

```
Untuk pembuatan PRD dibuat sesuai sub module contoh nya untuk
LMS Syariah pembuatan prd itu dibuat per jenis pembiayaan
contohnya Murabahah, IMBT, Ijaroh.
Di tms contohnya dibuat sesuai sub module/ jenis business hedging
dan syndication.
```
```
A brief overview of the process business to provide readers with context on what is being
developed.
Penjelasan summary garis besar proses bisnis yang akan dijelaskan sebelum menurunkan
epic dan story
```
```
Product Owner @ mention Product Owner
Product
Designer
```
```
@ mention Product Designer involved
```
```
Tech Lead @ mention Tech Lead involved
Team Team name/s
Roadmap Link to roadmap
Initiative
Identifier
```
```
Internal identifier for this initiative
```
```
Production
Version
```
```
VERSION or NOT YET RELEASED
```
```
Sebelum menurunkan Epic dan user story. Perlu ada penggambaran business use case.
Business use case merupakan penggambaran proses pekerjaan yang sudah ditentukan
```

```
Summary
Propertie
Table of Contents
Strategy
Customer Problem vs Proposed Solution
Measures of Success
Assumptions (Optional)
Go to Market Plan
Review & Feedback
Progressive Elaboration
Business Use Case (BUC)
List Epics
Releases
```
# Strategy

## Customer Problem vs Proposed Solution

```
Customer Problem - Supporting Information
```
```
Solution - Supporting Information
```
```
dalam business event
Dari business case bisa diidentifikasi proses apa saja yang butuh dikembangkan ,
diperbaiki yang bisa diturunkan menjadi Epic.
Dari epic selanjutnya bisa diturunkan user story yang menjelaskan batasan, kondisi apa
saja yang bisa dilakukan dari penurunan epic tersebut
```
```
Affected Target Market (Optional)
Describe the affected customer profile and estimate market size.
Supporting Research Data (Optional)
Provide research or data to highlight and support the problem
```
```
Supporting Customer Feedback (Optional)
Reference any customer or end-user feedback here, and link directly to
the source if possible.
```
```
Product Discovery Results or Research Outcome (Optional)
Describe Product Discovery activities and the outcomes that led to the
solution. Provide any supporting information for the proposed solution
here.
```

Describe the problem and summarize the proposed solution in brief, specific points to ensure
the PRD addresses a clear problem and outlines a clear solution.

## Measures of Success

List the objectives and key results that this solution aims to achieve.

Untuk key result butuh ada ukuran yang jelas untuk dinyatakan berhasil.

## Assumptions (Optional)

Provide a list of assumptions or hypotheses of what we belief and how these are tested.

Asumsi adalah kondisi yang dianggap benar sementara pada saat PRD disusun karena:

```
Data belum tersedia
Keputusan masih menunggu
```
```
e.g. Users struggle to categorize
their expenses, leading to confusion
and inaccurate financial records.
```
```
e.g. Integrate app features that
automatically categorizes expenses
based on transaction details,
simplifying financial tracking.
e.g. Users find it challenging to keep
track of their spending in real-time,
resulting in overspending and poor
budgeting.
```
```
e.g. Integrate app features for real-
time budget tracking feature in the
app, providing users with instant
updates on their spending habits.
```
```
Customer Problem Proposed Solution
```
```
e.g. Simplify customer
experience
```
```
e.g. NPS score
increases from X
to Y.
e.g. Increased
workflow
completion by X
%.
```
```
e.g. The feature will make
performing an action much
easier and thus customers
should be more likely to
recommend us.
```
```
Objectives Key Result Reasoning
```

```
Bergantung pada pihak eksternal
Di luar kontrol tim produk
```
Asumsi bukan requirement, bukan acceptance criteria, dan bukan test case.

Cakupan Asumsi (Whatʼs Included)

```
Kondisi sistem existing
Perilaku user yang diasumsikan
Ketersediaan data / API
Kebijakan bisnis yang belum final
Batasan legal/regulatory sementara
```
## Go to Market Plan

Describe how the product or the features will be rolled out and launched from a GTM
perspective.

```
Rollout Plan - Supporting Details
```
# Review & Feedback

```
e.g. The API of customer X will be
able to integrate seamlessly with
our business logic Y without
significant modification to our
microservice Z.
```
```
e.g. We pilot the integration with a
small, controlled environment with
an isolated microservice Z. Two
people identify the most critical
business logic flows and will test
their execution based on automated
Postman tests.
```
```
Assumption Testing
```
```
Above the Line
Detail any above-the-line advertising planned.
Below the Line
Detail any below-the-line advertising planned.
```
```
Communication Channels Usage
How might we use Social Media, Newsletter, Partnerships,
Walkthroughs or other channel?
```

# Progressive Elaboration

Deconstruct requirements from high level to detailed functionality by defining larger
functionality as Epics that is broken down in User Stories.

## Business Use Case (BUC)

```
Tujuan Business Use Case:
```
1. Menyampaikan alur proses secara bisnis kepada tim BA, PO, developer, dan QA.
2. Digunakan sebagai dasar menurunkan epic /fitur yang bisa digunakan sebagai usulan solusi.

Template untuk pembuatan BUC :

```
Business
Lead
```
```
@ to add
```
```
Marketing @ to add
Legal @ to add
Operations @ to add
Customer
Service
```
```
@ to add
```
```
Stakeholder PIC Feedback, considerations, checkpoints
```
```
Description: definisi flow proses (existing) , bisa
ditambahkan dengan flow yang baru untuk
improvement yang dibutuhkan.
Normal Flow of
Activities:
```
```
< insert flow chart>
untuk fitur atau proses yang dijelaskan butuh
ada penggambaran flow chart. flow chart bisa
dibuat utk focus di fitur itu (independent ) atau
butuh support fitur existing untuk masuk ke
fitur baru, maka penggambaran flow chart
perlu termasuk flow existing sehingga
tergambar precondition
```
```
Business Use Case :
```

Contoh turunan business usecase untuk digital pembayaran tagihan listrik

```
Alternative Flow of
Activities:
```
```
<bisa insert flow chart>
```
```
Exceptions: Gangguan teknis atau skenario error yang
muncul
Non-Functional
Requirements:
```
```
Standar non teknis di luar functional seperti
jumlah data yang diproses
```
```
Description: Proses ini memungkinkan pelanggan untuk
melakukan pengecekan tagihan (Inquiry) dan
melakukan pembayaran secara langsung
melalui aplikasi.
Flow Existing:
User memasukkan ID Pelanggan secara
manual → Inquiry ke PLN → Bayar → Selesai.
```
```
Improvement: Integrasi OCR (Optical
Character Recognition) untuk memindai ID
Pelanggan dari struk fisik, Push Notification
untuk pengingat tagihan otomatis, dan Auto-
Debit untuk efisiensi.
Normal Flow of
Activities:
```
```
< insert flow chart>
Pengguna sudah login ke aplikasi dan memiliki
saldo/metode pembayaran yang terhubung.
```
1. Akses Menu: Pengguna memilih menu
    "Tagihan Listrik".
2. Input ID Pelanggan:
    Manual: Mengetik 12 digit ID.
    AI Improvement: Menggunakan kamera
    untuk memindai ID dari meteran/struk
    lama.

```
Business Use Case : Digital Pembayaran Tagihan Listrik
```

3. Inquiry Tagihan: Sistem mengirim
    permintaan ke API aggregator/PLN.
4. Review Tagihan: Sistem menampilkan detail
    (Nama, ID, Periode, Biaya Admin, Total
    Tagihan).
5. Pilih Metode Pembayaran: Pengguna
    memilih saldo aplikasi atau kartu kredit.
6. Autentikasi: Pengguna memasukkan PIN
    atau Biometrik (FaceID/Fingerprint).
7. Eksekusi: Sistem memproses pembayaran
    dan mengupdate status di database PLN.
8. Resi Digital: Sistem menerbitkan bukti bayar
    dan mengirimkan salinan ke email.

Alternative Flow of
Activities:

```
<bisa insert flow chart>
Skenario: Pendaftaran Auto-Debit
(Improvement)
```
1. Setelah pembayaran berhasil, sistem
    menawarkan: "Ingin bayar otomatis bulan
    depan?"
2. Pengguna menyetujui dan mengatur batas
    maksimal saldo yang boleh didebit.
3. Setiap tanggal 20 , sistem melakukan Inquiry
    otomatis.
4. Jika tagihan ada, sistem langsung
    melakukan pemotongan saldo dan mengirim
    notifikasi sukses.

Exceptions: Gangguan teknis atau skenario error yang
muncul

1. ID pelanggan tidak ditemukan
2. Saldo tidak cukup
3. Connection Timeout (API PLN Down)
4. Pembayaran Ganda


## List Epics

Epic merupakan penurunan dari fitur yang butuh dikembangkan / butuh disesuaikan dari flow
business use case. Tuliskan list epic di sini yang akan dibuatkan untuk mengembangkan flow
business.
1. Epic 1
2. Epic 2
3. ....

## Releases

Map each Epic to its respective release, their release status, and identify any changed modules
along with their corresponding new semantic versions.

Release #1:

```
Non-Functional
Requirements:
```
```
Standar non teknis di luar functional seperti
jumlah data yang diproses , performance
```
1. Performance: Proses Inquiry tagihan harus
    memberikan respon dalam waktu <= 3 detik.
2. Scalability: Sistem harus mampu
    menangani lonjakan transaksi hingga 10. 000
    TPS (Transactions Per Second) pada
    periode puncak (tanggal 20-25 setiap
    bulan).
3. Security: Seluruh data transaksi harus
    menggunakan enkripsi AES-256 dan
    komunikasi via TLS 1. 2 +.
4. Availability: Sistem pembayaran harus
    tersedia 99. 9 % (High Availability).
5. Data Integrity: Setiap transaksi wajib
    memiliki nomor referensi unik dan tercatat di
    audit log untuk rekonsiliasi keuangan.

```
Release # 1
```
```
Jira Epic Status Modules Versions
```

Release #2:

```
use Jira Macro RELEASED or
UNRELEASED
```
```
e.g. LOS e.g. 2. 5. 12
```
```
Release Summary
Highlight any
important information
about this release.
```
```
Sign-Off
Date
```
```
// to add a date
```
```
Release
Doc
```
```
link to release documentation
```
```
Sign-Off @ to add
```
```
Release # 2
```
```
use Jira Macro RELEASED or
UNRELEASED
```
```
e.g. LOS e.g. 2. 5. 12
```
```
Jira Epic Status Modules Versions
```
```
Release Summary
Highlight any
important information
about this release.
```
```
Sign-Off
Date
```
```
// to add a date
```
```
Release
Doc
```
```
link to release documentation
```
```
Sign-Off @ to add
```

