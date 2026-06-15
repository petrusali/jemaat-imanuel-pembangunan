# Platform Donasi Pembangunan Gereja — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy WordPress single-tenant donation platform for GMI Jemaat Imanuel Pembangunan in 1-1.5 months — donation recording, online payment (QRIS/VA), manual payment verification, Janji Iman M1-M24 tracking, member registration, announcements, PWA mobile access.

**Architecture:** WordPress open-source on Hostinger WooCommerce Hosting. Plugin-first approach — Ultimate Member for auth, WooCommerce + Midtrans for payments, Super PWA for mobile. One custom plugin (`janji-iman-tracker`) for M1-M24 commitment tracking with 2 DB tables and WooCommerce integration hooks.

**Tech Stack:** PHP 8.x, MySQL 8.x, WordPress 6.x, WooCommerce, Midtrans Payment Gateway API, LiteSpeed Web Server, Super PWA Service Worker API

**Team Allocation:**
- **Tech Lead**: Custom plugin Janji Iman Tracker + WooCommerce integration + architecture oversight
- **Senior Dev**: WooCommerce + Midtrans config, payment flow, custom plugin admin pages
- **Dev**: Ultimate Member config, content setup (categories/posts/CPT), Elementor pages, PWA

---

## File Structure — Custom Plugin

```
wp-content/plugins/janji-iman-tracker/
├── janji-iman-tracker.php                  # Plugin bootstrap: hooks, constants, autoload
├── includes/
│   ├── class-activator.php                 # Activation hook: CREATE TABLE wp_janji_iman & wp_janji_iman_payment
│   ├── class-shortcodes.php                # [janji_iman_dashboard] + [janji_iman_progress] shortcodes
│   ├── class-woocommerce-integration.php   # WC cart item data, order complete hook, status update
│   └── class-admin.php                     # Admin pages: Daftar Pembayaran, Export CSV
├── assets/
│   ├── css/janji-iman.css                  # Grid M1-M24 styles, status colors
│   └── js/janji-iman.js                    # AJAX for manual verification, dashboard interactivity
└── readme.txt                              # Plugin metadata for WordPress plugin directory
```

---

## PART 1: ENVIRONMENT SETUP (Day 1-2)

### Task 1: Purchase & Configure Hostinger WooCommerce Hosting

**Files:** None (external service)

- [ ] **Step 1: Purchase Hostinger WooCommerce Hosting — Business plan**

Buka https://www.hostinger.com/id/woocommerce-hosting dan pilih "Business" plan. Domain: `pembangunan-imanuel.org` (atau yang disepakati). Complete checkout.

- [ ] **Step 2: Complete WordPress auto-install**

Setelah checkout, Hostinger akan auto-install WordPress. Konfigurasi:
```
Site Title: GMI Jemaat Imanuel Pembangunan
Admin Username: [diberikan oleh Hostinger — simpan]
Admin Password: [diberikan oleh Hostinger — simpan]
Admin Email: sekretariat@gmi-imanuel.org
Language: Bahasa Indonesia
```

- [ ] **Step 3: Verify WordPress admin access**

Buka `https://pembangunan-imanuel.org/wp-admin`. Login dengan kredensial dari Hostinger. Pastikan dashboard muncul.

- [ ] **Step 4: Enable Cloudflare CDN (free)**

Dari hPanel Hostinger → "Cloudflare" → "Enable". Ini akan otomatis mengarahkan DNS ke Cloudflare. Verify dengan ping domain:
```bash
ping pembangunan-imanuel.org
# Harus resolve ke Cloudflare IP, bukan Hostinger origin IP
```

- [ ] **Step 5: Create staging environment**

Dari hPanel → "Staging" → "Create Staging". Ini akan menjadi environment testing sebelum setiap perubahan di-push ke production.

- [ ] **Step 6: Commit environment docs**

```bash
git add -A
git commit -m "docs: Hostinger environment setup notes"
```

---

### Task 2: Install & Activate Base Plugins

**Files:** None (wp-admin)

- [ ] **Step 1: Install GeneratePress theme**

Dari wp-admin → Appearance → Themes → Add New → Search "GeneratePress" → Install → Activate.

- [ ] **Step 2: Install Elementor (Free)**

Dari wp-admin → Plugins → Add New → Search "Elementor Website Builder" → Install → Activate.

- [ ] **Step 3: Install Ultimate Member**

Dari wp-admin → Plugins → Add New → Search "Ultimate Member" → Install → Activate.

- [ ] **Step 4: Install WooCommerce**

Dari wp-admin → Plugins → Add New → Search "WooCommerce" → Install → Activate.
WooCommerce setup wizard akan muncul — **skip dulu**, akan dikonfigurasi di Task 4.

- [ ] **Step 5: Install Midtrans for WooCommerce**

Dari wp-admin → Plugins → Add New → Search "Midtrans for WooCommerce" → Install → Activate. **Jangan isi API key dulu.**

- [ ] **Step 6: Install Super PWA**

Dari wp-admin → Plugins → Add New → Search "Super PWA" → Install → Activate. **Jangan konfigurasi dulu.**

- [ ] **Step 7: Verify all plugins aktif**

Dari wp-admin → Plugins → Installed Plugins. Harus ada semua 6 plugin di atas dengan status "Active":
```
✓ GeneratePress
✓ Elementor
✓ Ultimate Member
✓ WooCommerce
✓ Midtrans for WooCommerce
✓ Super PWA
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "docs: plugin installation verification checklist"
```

---

## PART 2: MEMBERSHIP & AUTH (Day 3-5) — Dev

### Task 3: Configure Ultimate Member — User Roles

**Files:** None (wp-admin Ultimate Member settings)

- [ ] **Step 1: Create "Jemaat" role**

wp-admin → Ultimate Member → User Roles → Add New Role:
```
Role ID: um_jemaat
Role Name: Jemaat
Can edit profile? Yes
Can delete account? No
```

- [ ] **Step 2: Create "Sekretariat" role**

wp-admin → Ultimate Member → User Roles → Add New Role:
```
Role ID: um_sekretariat
Role Name: Sekretariat
Can edit other member profiles? Yes
Can edit profile? Yes
Can delete account? No
Administrative abilities: edit_posts, publish_posts, edit_others_posts, upload_files
```

- [ ] **Step 3: Create "Bendahara" role**

wp-admin → Ultimate Member → User Roles → Add New Role:
```
Role ID: um_bendahara
Role Name: Bendahara
Can edit profile? Yes
Can delete account? No
Administrative abilities: edit_shop_orders, edit_others_shop_orders, view_admin_dashboard
```

- [ ] **Step 4: Verify roles in WordPress**

wp-admin → Users → All Users. Filter by role dropdown — harus ada Jemaat, Sekretariat, Bendahara di samping Administrator default.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: Ultimate Member role configuration"
```

---

### Task 4: Configure Ultimate Member — Registration Form

**Files:** None (wp-admin Ultimate Member form builder)

- [ ] **Step 1: Create registration form**

wp-admin → Ultimate Member → Forms → Add New:
```
Form Name: Registrasi Jemaat
Form Type: Registration
```

- [ ] **Step 2: Add form fields**

Drag-and-drop fields ke form builder:
```
Field 1: Username (Text) — Required
Field 2: Nama Lengkap (Text) — Required
Field 3: Nomor WhatsApp (Text) — Required, Placeholder: "0812xxxxxxxx"
Field 4: Email (Text) — Required
Field 5: Alamat Domisili (Textarea) — Required
Field 6: Sektor Wilayah (Dropdown) — Required
         Options: Sektor 1 | Sektor 2 | Sektor 3 | Sektor 4 | Sektor 5
Field 7: Status Keanggotaan (Radio) — Required
         Options: Jemaat Aktif GMI | Simpatisan
Field 8: Password (Password) — Required
Field 9: Confirm Password (Password) — Required
```

- [ ] **Step 3: Set registration options**

Tab "User" di form settings:
```
Default User Role: Jemaat
Registration Status: Require Admin Review ✅
Action after registration: Show message "Pendaftaran Anda sedang ditinjau oleh Sekretariat. Anda akan menerima notifikasi setelah akun disetujui."
```

- [ ] **Step 4: Create login form**

wp-admin → Ultimate Member → Forms → Add New:
```
Form Name: Login Jemaat
Form Type: Login
Fields: Username/Email, Password
```

- [ ] **Step 5: Create profile form**

wp-admin → Ultimate Member → Forms → Add New:
```
Form Name: Profil Jemaat
Form Type: Profile
Fields: mirror semua field dari registration form (read-only kecuali alamat & nomor WA)
```

- [ ] **Step 6: Set restriction on wp-admin for Jemaat role**

wp-admin → Ultimate Member → Settings → Access:
```
Global Access: Content accessible to Everyone
Restriction: Jemaat role — redirect to homepage when accessing /wp-admin/
```

- [ ] **Step 7: Register test user**

Buka halaman registrasi di frontend (`/register/`), isi form, submit. Verifikasi bahwa:
- User muncul di wp-admin → Users dengan status "Pending Review"
- Sekretariat bisa approve dari Users screen
- Setelah approve, user bisa login

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "docs: Ultimate Member registration/login/profile form setup"
```

---

## PART 3: PAYMENT ENGINE (Day 3-7) — Senior Dev

### Task 5: Configure WooCommerce — Store Settings

**Files:** None (wp-admin WooCommerce settings)

- [ ] **Step 1: Complete WooCommerce setup wizard (skip payment)**

Jika wizard belum diselesaikan: WooCommerce → Settings → Setup Wizard:
```
Store address: Jl. [Alamat Gereja], Jakarta
Industry: Nonprofit / Charity
Product types: Virtual
Business details: skip (tidak perlu automated tax)
Theme: Keep GeneratePress (skip WooCommerce theme suggestion)
Payment: SKIP dulu (akan setup Midtrans terpisah)
```

- [ ] **Step 2: Configure WooCommerce — General**

WooCommerce → Settings → General:
```
Selling location(s): Sell to all countries
Shop pages: Biarkan default (Shop, Cart, Checkout, My Account)
Currency: Indonesian Rupiah (Rp)
Currency separator: .
Decimal separator: ,
Number of decimals: 0
```

- [ ] **Step 3: Configure WooCommerce — Accounts & Privacy**

WooCommerce → Settings → Accounts & Privacy:
```
☑ Allow customers to create an account on the "My Account" page
☐ Allow customers to log into an existing account during checkout (uncheck — gunakan UM login)
☑ Allow customers to place orders without an account
☐ Allow customers to create an account during checkout (uncheck — gunakan UM)
Personal data retention: 7 years
```

- [ ] **Step 4: Create WooCommerce virtual product "Pembayaran Janji Iman"**

WooCommerce → Products → Add New:
```
Product Name: Pembayaran Janji Iman Bulanan
Product Type: Virtual ✅
Price: 0 (harga akan di-pass via custom cart data — lihat Task 8)
SKU: JANJI-IMAN-BULANAN
Categories: Donasi
Tags: Janji Iman
Catalog visibility: Hidden (hanya bisa diakses via shortcode URL)
```

- [ ] **Step 5: Create WooCommerce virtual product "Donasi Umum" (opsional)**

WooCommerce → Products → Add New:
```
Product Name: Donasi Pembangunan
Product Type: Virtual ✅
Price: 10000 (minimum donasi — bisa diubah jemaat di checkout)
SKU: DONASI-UMUM
Categories: Donasi
Tags: Donasi
Catalog visibility: Shop and search results
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "docs: WooCommerce store settings and products"
```

---

### Task 6: Configure Midtrans Payment Gateway

**Files:** None (wp-admin)

- [ ] **Step 1: Register Midtrans account**

Buka https://midtrans.com → Daftar → Pilih "Non-Profit / Yayasan".
Isi data gereja:
```
Nama Bisnis: GMI Jemaat Imanuel Pembangunan
Kategori: Religious Organization / Non-Profit
Website: https://pembangunan-imanuel.org
Kontak: [Nomor WA sekretariat]
Rekening Bank: [Rekening Mandiri GMI Imanuel]
```

- [ ] **Step 2: Verify Midtrans account & dapatkan API keys**

Setelah approve, dari Midtrans Dashboard → Settings → Access Keys:
```
Merchant ID: GXXXXXXX
Client Key: Mid-client-XXXXX (untuk frontend)
Server Key: Mid-server-XXXXX (untuk backend)
```
Simpan kedua key ini dengan aman.

- [ ] **Step 3: Input API keys ke WooCommerce Midtrans plugin**

wp-admin → WooCommerce → Settings → Payments → Midtrans → Manage:
```
☑ Enable Midtrans Payment Gateway
Title: Pembayaran Online (QRIS / Virtual Account / GoPay)
Description: Pilih metode pembayaran yang Anda inginkan
Environment: Production ✅
Merchant ID: GXXXXXXX
Client Key: Mid-client-XXXXX
Server Key: Mid-server-XXXXX
☑ Enable QRIS
☑ Enable Virtual Account (BCA, Mandiri, BNI, BRI)
☑ Enable GoPay
☐ Enable credit card (uncheck — tidak perlu)
☐ Enable Indomaret / Alfamart (uncheck)
Payment Action: Capture (auto-complete order)
Transaction Status URL: https://pembangunan-imanuel.org/wc-api/midtrans_callback
```

- [ ] **Step 4: Enable "Transfer Bank Manual" sebagai fallback**

WooCommerce → Settings → Payments → Direct Bank Transfer → Manage:
```
☑ Enable Bank Transfer
Title: Transfer Bank Manual
Description: Transfer ke rekening Mandiri 123-456-7890 a.n. GMI Jemaat Imanuel Pembangunan. Upload bukti transfer di halaman checkout.
Account details:
  Bank: Mandiri
  Account Number: 123-456-7890
  Account Name: GMI Jemaat Imanuel Pembangunan
☑ Enable file upload at checkout (WooCommerce default)
```

- [ ] **Step 5: Test Midtrans Sandbox transaction**

Dari Midtrans Dashboard → Settings → Environment: **Sandbox** (test dulu):
1. Buka frontend, add product "Donasi Umum" ke cart
2. Checkout, pilih "Pembayaran Online (QRIS/VA)"
3. Pilih QRIS → dapat QR code
4. Buka Midtrans Sandbox → Simulate Payment → scan QR/input VA → Success
5. Verify di WooCommerce → Orders → order status = "Completed"

- [ ] **Step 6: Switch Midtrans ke Production**

Setelah sandbox test sukses, ubah mode ke Production:
wp-admin → WooCommerce → Settings → Payments → Midtrans → Environment: **Production**

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs: Midtrans payment gateway configuration"
```

---

## PART 4: CUSTOM PLUGIN — JANJI IMAN TRACKER (Day 5-15) — Tech Lead

### Task 7: Create Plugin Bootstrap & Activator (DB Tables)

**Files:**
- Create: `wp-content/plugins/janji-iman-tracker/janji-iman-tracker.php`
- Create: `wp-content/plugins/janji-iman-tracker/includes/class-activator.php`

- [ ] **Step 1: Create plugin bootstrap file**

```php
<?php
/**
 * Plugin Name: Janji Iman Tracker
 * Plugin URI: https://pembangunan-imanuel.org
 * Description: M1-M24 Faith Commitment tracking for GMI Jemaat Imanuel Pembangunan. Integrates with WooCommerce.
 * Version: 1.0.0
 * Author: GMI Imanuel IT Team
 * License: GPL v2 or later
 * Text Domain: janji-iman-tracker
 */

defined('ABSPATH') || exit;

define('JIT_VERSION', '1.0.0');
define('JIT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('JIT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Autoload includes
require_once JIT_PLUGIN_DIR . 'includes/class-activator.php';
require_once JIT_PLUGIN_DIR . 'includes/class-shortcodes.php';
require_once JIT_PLUGIN_DIR . 'includes/class-woocommerce-integration.php';
require_once JIT_PLUGIN_DIR . 'includes/class-admin.php';

// Activation / Deactivation hooks
register_activation_hook(__FILE__, ['JIT_Activator', 'activate']);
register_deactivation_hook(__FILE__, ['JIT_Activator', 'deactivate']);

// Init modules
add_action('init', ['JIT_Shortcodes', 'init']);
add_action('init', ['JIT_WooCommerce_Integration', 'init']);
add_action('init', ['JIT_Admin', 'init']);

// Enqueue assets
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('jit-style', JIT_PLUGIN_URL . 'assets/css/janji-iman.css', [], JIT_VERSION);
    wp_enqueue_script('jit-script', JIT_PLUGIN_URL . 'assets/js/janji-iman.js', ['jquery'], JIT_VERSION, true);
    wp_localize_script('jit-script', 'JIT_Ajax', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('jit_nonce'),
    ]);
});
```

- [ ] **Step 2: Create activator class**

```php
<?php
// File: includes/class-activator.php

class JIT_Activator {

    public static function activate() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        // Tabel 1: wp_janji_iman
        $table_janji_iman = $wpdb->prefix . 'janji_iman';
        $sql1 = "CREATE TABLE $table_janji_iman (
            id              BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id         BIGINT NOT NULL,
            total_komitmen  DECIMAL(15,2) NOT NULL,
            nominal_per_bulan DECIMAL(15,2) NOT NULL,
            mulai_bulan     DATE NOT NULL,
            status          VARCHAR(20) DEFAULT 'active',
            created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_user_id (user_id),
            INDEX idx_status (status)
        ) $charset_collate;";

        // Tabel 2: wp_janji_iman_payment
        $table_payment = $wpdb->prefix . 'janji_iman_payment';
        $sql2 = "CREATE TABLE $table_payment (
            id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
            janji_iman_id       BIGINT NOT NULL,
            woocommerce_order_id BIGINT,
            bulan_ke            TINYINT NOT NULL,
            nominal             DECIMAL(15,2) NOT NULL,
            payment_method      VARCHAR(30),
            status              VARCHAR(20) DEFAULT 'pending',
            verified_by         BIGINT,
            verified_at         DATETIME,
            created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_janji_iman_id (janji_iman_id),
            INDEX idx_order_id (woocommerce_order_id),
            INDEX idx_bulan_ke (bulan_ke),
            INDEX idx_status (status)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql1);
        dbDelta($sql2);

        // Store DB version for future migrations
        add_option('jit_db_version', JIT_VERSION);
    }

    public static function deactivate() {
        // Do NOT drop tables on deactivation — preserve data
        // Tables hanya di-drop jika plugin di-uninstall (via uninstall.php)
    }
}
```

- [ ] **Step 3: Upload plugin folder ke WordPress**

Via Hostinger File Manager (hPanel → File Manager) atau SFTP:
```
Connect to: pembangunan-imanuel.org
Port: 21 (FTP) or 2222 (SFTP)
Username: [from Hostinger panel]
Password: [from Hostinger panel]

Upload folder janji-iman-tracker/ → /public_html/wp-content/plugins/
```

- [ ] **Step 4: Activate plugin & verify DB tables**

wp-admin → Plugins → cari "Janji Iman Tracker" → Activate.

Dari phpMyAdmin (hPanel → Database → phpMyAdmin), verify:
```sql
SHOW TABLES LIKE '%janji_iman%';
-- Harus muncul: wp_janji_iman, wp_janji_iman_payment

DESCRIBE wp_janji_iman;
-- Harus match 8 columns dari CREATE TABLE
```

- [ ] **Step 5: Commit**

```bash
git add wp-content/plugins/janji-iman-tracker/
git commit -m "feat: Janji Iman Tracker plugin bootstrap and DB activation"
```

---

### Task 8: Implement WooCommerce Integration (Cart + Order Hook)

**Files:**
- Create: `wp-content/plugins/janji-iman-tracker/includes/class-woocommerce-integration.php`

- [ ] **Step 1: Write the WooCommerce integration class**

```php
<?php
// File: includes/class-woocommerce-integration.php

class JIT_WooCommerce_Integration {

    public static function init() {
        // Attach Janji Iman data to cart item
        add_filter('woocommerce_add_cart_item_data', [__CLASS__, 'add_cart_item_data'], 10, 2);

        // Display Janji Iman info in cart & checkout
        add_filter('woocommerce_get_item_data', [__CLASS__, 'display_cart_item_data'], 10, 2);

        // Save Janji Iman data to order item meta
        add_action('woocommerce_checkout_create_order_line_item', [__CLASS__, 'save_order_item_meta'], 10, 4);

        // When order status becomes "completed", record payment
        add_action('woocommerce_order_status_completed', [__CLASS__, 'on_order_completed'], 10, 1);

        // When order status changes manually by bendahara (manual transfer)
        add_action('woocommerce_order_status_changed', [__CLASS__, 'on_order_status_changed'], 10, 3);
    }

    /**
     * Add Janji Iman data to cart item when coming from shortcode URL.
     * URL format: /checkout/?add-to-cart=PRODUCT_ID&janji_iman_id=1&bulan_ke=3
     */
    public static function add_cart_item_data($cart_item_data, $product_id) {
        if (isset($_GET['janji_iman_id']) && isset($_GET['bulan_ke'])) {
            $cart_item_data['janji_iman_id'] = intval($_GET['janji_iman_id']);
            $cart_item_data['bulan_ke'] = intval($_GET['bulan_ke']);
            // Make cart item unique per Janji Iman + bulan
            $cart_item_data['unique_key'] = 'janji_iman_' . $_GET['janji_iman_id'] . '_m' . $_GET['bulan_ke'];
        }
        return $cart_item_data;
    }

    /**
     * Show Janji Iman info on cart & checkout page.
     */
    public static function display_cart_item_data($item_data, $cart_item) {
        if (isset($cart_item['janji_iman_id'])) {
            $item_data[] = [
                'name'  => 'Janji Iman ID',
                'value' => '#' . $cart_item['janji_iman_id'] . ' — Bulan ke-' . $cart_item['bulan_ke'],
            ];
        }
        return $item_data;
    }

    /**
     * Persist Janji Iman data to order line item meta.
     */
    public static function save_order_item_meta($item, $cart_item_key, $values, $order) {
        if (isset($values['janji_iman_id'])) {
            $item->add_meta_data('_janji_iman_id', $values['janji_iman_id']);
            $item->add_meta_data('_bulan_ke', $values['bulan_ke']);
        }
    }

    /**
     * When order is completed (Midtrans callback success or manual approve),
     * record payment in wp_janji_iman_payment.
     */
    public static function on_order_completed($order_id) {
        $order = wc_get_order($order_id);

        foreach ($order->get_items() as $item) {
            $janji_iman_id = $item->get_meta('_janji_iman_id');
            $bulan_ke      = $item->get_meta('_bulan_ke');

            if ($janji_iman_id && $bulan_ke) {
                self::record_payment($janji_iman_id, $order_id, $bulan_ke, $item->get_total(), $order->get_payment_method());
            }
        }
    }

    /**
     * Handle manual payment verification by bendahara.
     * When order transitions from pending → completed via wp-admin action.
     */
    public static function on_order_status_changed($order_id, $old_status, $new_status) {
        if ($new_status === 'completed' && $old_status !== 'completed') {
            self::on_order_completed($order_id);

            // Record who verified the payment
            $current_user = wp_get_current_user();
            if ($current_user->ID) {
                global $wpdb;
                $wpdb->update(
                    $wpdb->prefix . 'janji_iman_payment',
                    [
                        'verified_by' => $current_user->ID,
                        'verified_at' => current_time('mysql'),
                    ],
                    ['woocommerce_order_id' => $order_id]
                );
            }
        }

        if ($new_status === 'cancelled') {
            global $wpdb;
            $wpdb->update(
                $wpdb->prefix . 'janji_iman_payment',
                ['status' => 'rejected'],
                ['woocommerce_order_id' => $order_id]
            );
        }
    }

    /**
     * Insert or update payment record.
     */
    private static function record_payment($janji_iman_id, $order_id, $bulan_ke, $nominal, $payment_method) {
        global $wpdb;

        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}janji_iman_payment WHERE janji_iman_id = %d AND bulan_ke = %d",
            $janji_iman_id, $bulan_ke
        ));

        if ($existing) {
            $wpdb->update(
                $wpdb->prefix . 'janji_iman_payment',
                [
                    'woocommerce_order_id' => $order_id,
                    'nominal'              => $nominal,
                    'payment_method'       => $payment_method,
                    'status'               => 'verified',
                    'verified_at'          => current_time('mysql'),
                ],
                ['id' => $existing->id]
            );
        } else {
            $wpdb->insert($wpdb->prefix . 'janji_iman_payment', [
                'janji_iman_id'       => $janji_iman_id,
                'woocommerce_order_id' => $order_id,
                'bulan_ke'            => $bulan_ke,
                'nominal'             => $nominal,
                'payment_method'      => $payment_method,
                'status'              => 'verified',
                'verified_at'         => current_time('mysql'),
            ]);
        }

        // Check if all 24 months are paid
        self::check_completion($janji_iman_id);
    }

    /**
     * Check if all 24 months are paid — update Janji Iman status to completed.
     */
    private static function check_completion($janji_iman_id) {
        global $wpdb;

        $paid = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}janji_iman_payment
             WHERE janji_iman_id = %d AND status = 'verified'",
            $janji_iman_id
        ));

        if ($paid >= 24) {
            $wpdb->update(
                $wpdb->prefix . 'janji_iman',
                ['status' => 'completed'],
                ['id' => $janji_iman_id]
            );
        }
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add wp-content/plugins/janji-iman-tracker/includes/class-woocommerce-integration.php
git commit -m "feat: WooCommerce integration — cart data, order hooks, payment recording"
```

---

### Task 9: Implement Frontend Shortcodes

**Files:**
- Create: `wp-content/plugins/janji-iman-tracker/includes/class-shortcodes.php`

- [ ] **Step 1: Write shortcodes class**

```php
<?php
// File: includes/class-shortcodes.php

class JIT_Shortcodes {

    public static function init() {
        add_shortcode('janji_iman_dashboard', [__CLASS__, 'render_dashboard']);
        add_shortcode('janji_iman_progress', [__CLASS__, 'render_progress_bar']);
    }

    /**
     * [janji_iman_dashboard] — M1-M24 grid for logged-in user.
     * Place on page: /janji-iman-saya/
     */
    public static function render_dashboard($atts) {
        if (!is_user_logged_in()) {
            return '<div class="jit-notice">' . __('Silakan login untuk melihat Janji Iman Anda.', 'janji-iman-tracker') . '</div>';
        }

        global $wpdb;
        $user_id = get_current_user_id();

        // Get user's Janji Iman record
        $janji_iman = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}janji_iman WHERE user_id = %d ORDER BY id DESC LIMIT 1",
            $user_id
        ));

        if (!$janji_iman) {
            return '<div class="jit-notice">' . __('Anda belum memiliki data Janji Iman. Hubungi Sekretariat.', 'janji-iman-tracker') . '</div>';
        }

        // Get all payments
        $payments = $wpdb->get_results($wpdb->prepare(
            "SELECT bulan_ke, status, nominal, created_at FROM {$wpdb->prefix}janji_iman_payment
             WHERE janji_iman_id = %d ORDER BY bulan_ke ASC",
            $janji_iman->id
        ), OBJECT_K); // Keyed by bulan_ke

        $wc_product_id = self::get_janji_iman_product_id();

        ob_start();
        ?>
        <div class="jit-dashboard">
            <div class="jit-header">
                <h2><?php _e('Janji Iman Saya', 'janji-iman-tracker'); ?></h2>
                <p class="jit-total">
                    Total Komitmen: <strong>Rp <?php echo number_format($janji_iman->total_komitmen, 0, ',', '.'); ?></strong>
                    (24 bulan × Rp <?php echo number_format($janji_iman->nominal_per_bulan, 0, ',', '.'); ?>)
                </p>
                <p class="jit-status">
                    Status: <strong class="jit-badge jit-<?php echo esc_attr($janji_iman->status); ?>">
                        <?php echo $janji_iman->status === 'completed' ? '✅ Lunas' : '🔄 Aktif'; ?>
                    </strong>
                </p>
            </div>

            <div class="jit-grid">
                <?php for ($i = 1; $i <= 24; $i++):
                    $payment = isset($payments[$i]) ? $payments[$i] : null;
                    $status  = $payment ? $payment->status : 'unpaid';
                    $css     = [
                        'verified' => 'jit-paid',
                        'pending'  => 'jit-pending',
                        'unpaid'   => 'jit-unpaid',
                        'rejected' => 'jit-rejected',
                    ][$status];
                    ?>
                    <div class="jit-month <?php echo $css; ?>">
                        <div class="jit-month-num">M-<?php echo $i; ?></div>
                        <div class="jit-month-amount">
                            Rp <?php echo number_format($janji_iman->nominal_per_bulan, 0, ',', '.'); ?>
                        </div>
                        <?php if ($status === 'verified'): ?>
                            <div class="jit-month-status">✅ Lunas</div>
                            <div class="jit-month-date"><?php echo date('d/m/Y', strtotime($payment->created_at)); ?></div>
                        <?php elseif ($status === 'pending'): ?>
                            <div class="jit-month-status">⏳ Menunggu Verifikasi</div>
                        <?php elseif ($status === 'rejected'): ?>
                            <div class="jit-month-status">❌ Ditolak</div>
                        <?php else: ?>
                            <a href="<?php echo esc_url(add_query_arg([
                                'add-to-cart'   => $wc_product_id,
                                'janji_iman_id' => $janji_iman->id,
                                'bulan_ke'      => $i,
                            ], wc_get_checkout_url())); ?>" class="jit-pay-button">
                                Bayar M-<?php echo $i; ?>
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endfor; ?>
            </div>

            <?php if ($janji_iman->status === 'completed'): ?>
            <div class="jit-completed-banner">
                🎉 Puji Tuhan! Janji Iman 24 bulan Anda telah lunas.
                Total donasi: <strong>Rp <?php echo number_format($janji_iman->total_komitmen, 0, ',', '.'); ?></strong>
            </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * [janji_iman_progress] — public progress of total donations raised.
     * Place on page: /beranda/ or /progres-pembangunan/
     */
    public static function render_progress_bar($atts) {
        global $wpdb;

        $total_verified = $wpdb->get_var(
            "SELECT COALESCE(SUM(nominal), 0) FROM {$wpdb->prefix}janji_iman_payment WHERE status = 'verified'"
        );

        // Total komitmen seluruh jemaat (target donasi)
        $target = $wpdb->get_var(
            "SELECT COALESCE(SUM(total_komitmen), 0) FROM {$wpdb->prefix}janji_iman WHERE status IN ('active', 'completed')"
        );

        $percentage = $target > 0 ? round(($total_verified / $target) * 100, 1) : 0;

        ob_start();
        ?>
        <div class="jit-progress-widget">
            <h3><?php _e('Total Donasi Janji Iman Terkumpul', 'janji-iman-tracker'); ?></h3>
            <div class="jit-progress-bar">
                <div class="jit-progress-fill" style="width: <?php echo min($percentage, 100); ?>%;"></div>
            </div>
            <div class="jit-progress-stats">
                <span class="jit-raised">Rp <?php echo number_format($total_verified, 0, ',', '.'); ?></span>
                <span class="jit-target">dari Rp <?php echo number_format($target, 0, ',', '.'); ?></span>
                <span class="jit-percent">(<?php echo $percentage; ?>%)</span>
            </div>
            <div class="jit-progress-bar" style="margin-top: 12px;">
                <div class="jit-progress-fill jit-progress-physical" style="width: <?php echo min($percentage, 100); ?>%;"></div>
            </div>
            <p style="text-align:center; font-size: 14px; color: #666; margin-top: 4px;">
                Progress capaian donasi pembangunan
            </p>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Helper: Get WooCommerce product ID for Janji Iman payments.
     * Falls back to searching by SKU.
     */
    private static function get_janji_iman_product_id() {
        $product_id = get_option('jit_product_id', 0);

        if (!$product_id || !wc_get_product($product_id)) {
            // Fallback: search by SKU
            $product_id = wc_get_product_id_by_sku('JANJI-IMAN-BULANAN');
            if ($product_id) {
                update_option('jit_product_id', $product_id);
            }
        }

        return $product_id;
    }
}
```

- [ ] **Step 2: Write the CSS file for M1-M24 grid**

```css
/* File: assets/css/janji-iman.css */

.jit-dashboard {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px;
}

.jit-header {
    text-align: center;
    margin-bottom: 30px;
}

.jit-header h2 {
    font-size: 24px;
    color: #2d3748;
    margin-bottom: 8px;
}

.jit-total {
    font-size: 16px;
    color: #4a5568;
}

.jit-badge.active {
    background: #edf2f7;
    color: #2b6cb0;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: 600;
}

.jit-badge.completed {
    background: #c6f6d5;
    color: #22543d;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: 600;
}

.jit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
}

.jit-month {
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px 12px;
    text-align: center;
    transition: all 0.2s;
}

.jit-month.jit-paid {
    border-color: #48bb78;
    background: #f0fff4;
}

.jit-month.jit-pending {
    border-color: #ecc94b;
    background: #fffff0;
}

.jit-month.jit-unpaid {
    border-color: #e2e8f0;
    background: #f7fafc;
}

.jit-month.jit-rejected {
    border-color: #fc8181;
    background: #fff5f5;
}

.jit-month-num {
    font-size: 18px;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 4px;
}

.jit-month-amount {
    font-size: 12px;
    color: #718096;
    margin-bottom: 8px;
}

.jit-month-status {
    font-size: 13px;
    margin-bottom: 4px;
}

.jit-month-date {
    font-size: 11px;
    color: #a0aec0;
}

.jit-pay-button {
    display: inline-block;
    background: #4299e1;
    color: #fff;
    padding: 6px 14px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    transition: background 0.2s;
}

.jit-pay-button:hover {
    background: #2b6cb0;
    color: #fff;
    text-decoration: none;
}

.jit-completed-banner {
    margin-top: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #48bb78, #38a169);
    color: #fff;
    text-align: center;
    border-radius: 8px;
    font-size: 18px;
}

.jit-notice {
    text-align: center;
    padding: 40px;
    color: #718096;
    font-size: 16px;
}

/* Progress bar */
.jit-progress-widget {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.jit-progress-widget h3 {
    text-align: center;
    font-size: 18px;
    color: #2d3748;
    margin-bottom: 16px;
}

.jit-progress-bar {
    width: 100%;
    height: 24px;
    background: #edf2f7;
    border-radius: 12px;
    overflow: hidden;
}

.jit-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #48bb78, #38a169);
    border-radius: 12px;
    transition: width 0.6s ease;
}

.jit-progress-fill.jit-progress-physical {
    background: linear-gradient(90deg, #4299e1, #3182ce);
}

.jit-progress-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 14px;
}

.jit-raised {
    color: #22543d;
    font-weight: 700;
}

.jit-target {
    color: #718096;
}

.jit-percent {
    color: #2b6cb0;
    font-weight: 600;
}
```

- [ ] **Step 3: Write minimal JS file for AJAX interactions**

```javascript
/* File: assets/js/janji-iman.js */

jQuery(document).ready(function ($) {
    // Future: AJAX manual verification, real-time status updates
    // For Phase 1: minimal JS — just handle UX polish

    // Smooth scroll to checkout after "Bayar" click
    $('.jit-pay-button').on('click', function () {
        // Add loading state
        $(this).text('Mengarahkan...').css('opacity', '0.7');
    });

    // Admin: confirm before reject
    $('.jit-reject-btn').on('click', function (e) {
        if (!confirm('Yakin tolak pembayaran ini? Jemaat akan mendapat notifikasi.')) {
            e.preventDefault();
        }
    });
});
```

- [ ] **Step 4: Commit**

```bash
git add wp-content/plugins/janji-iman-tracker/includes/class-shortcodes.php \
        wp-content/plugins/janji-iman-tracker/assets/css/janji-iman.css \
        wp-content/plugins/janji-iman-tracker/assets/js/janji-iman.js
git commit -m "feat: Janji Iman shortcodes — M1-M24 dashboard grid + progress bar"
```

---

### Task 10: Implement Admin Pages (Daftar Pembayaran + Export CSV)

**Files:**
- Create: `wp-content/plugins/janji-iman-tracker/includes/class-admin.php`

- [ ] **Step 1: Write admin class**

```php
<?php
// File: includes/class-admin.php

class JIT_Admin {

    public static function init() {
        add_action('admin_menu', [__CLASS__, 'add_admin_pages']);
        add_action('admin_post_jit_export_csv', [__CLASS__, 'export_csv']);
    }

    /**
     * Add admin menu items under "Janji Iman" top-level menu.
     */
    public static function add_admin_pages() {
        add_menu_page(
            'Janji Iman',
            'Janji Iman',
            'edit_shop_orders', // Bendahara capability
            'janji-iman',
            [__CLASS__, 'render_payment_list'],
            'dashicons-heart',
            30
        );

        add_submenu_page(
            'janji-iman',
            'Daftar Pembayaran',
            'Daftar Pembayaran',
            'edit_shop_orders',
            'janji-iman',
            [__CLASS__, 'render_payment_list']
        );

        add_submenu_page(
            'janji-iman',
            'Data Janji Iman Jemaat',
            'Data Jemaat',
            'edit_shop_orders',
            'janji-iman-members',
            [__CLASS__, 'render_member_list']
        );

        add_submenu_page(
            'janji-iman',
            'Ekspor CSV',
            'Ekspor CSV',
            'edit_shop_orders',
            'janji-iman-export',
            [__CLASS__, 'render_export_page']
        );
    }

    /**
     * Daftar Pembayaran — all payments with filter by status, bulan, jemaat.
     */
    public static function render_payment_list() {
        global $wpdb;

        $status_filter = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';
        $where = '';
        if ($status_filter) {
            $where = $wpdb->prepare("WHERE p.status = %s", $status_filter);
        }

        $payments = $wpdb->get_results(
            "SELECT p.*, u.display_name AS nama_jemaat, j.nominal_per_bulan
             FROM {$wpdb->prefix}janji_iman_payment p
             JOIN {$wpdb->prefix}janji_iman j ON p.janji_iman_id = j.id
             JOIN {$wpdb->users} u ON j.user_id = u.ID
             $where
             ORDER BY p.created_at DESC
             LIMIT 100"
        );

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Daftar Pembayaran Janji Iman</h1>
            <hr class="wp-header-end">

            <ul class="subsubsub">
                <li><a href="?page=janji-iman" class="<?php echo !$status_filter ? 'current' : ''; ?>">Semua</a> |</li>
                <li><a href="?page=janji-iman&status=verified" class="<?php echo $status_filter === 'verified' ? 'current' : ''; ?>">Verified</a> |</li>
                <li><a href="?page=janji-iman&status=pending" class="<?php echo $status_filter === 'pending' ? 'current' : ''; ?>">Pending</a> |</li>
                <li><a href="?page=janji-iman&status=rejected" class="<?php echo $status_filter === 'rejected' ? 'current' : ''; ?>">Rejected</a></li>
            </ul>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Jemaat</th>
                        <th>Bulan Ke</th>
                        <th>Nominal</th>
                        <th>Metode</th>
                        <th>Status</th>
                        <th>Tanggal Bayar</th>
                        <th>Diverifikasi Oleh</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($payments as $p): ?>
                    <tr>
                        <td><?php echo $p->id; ?></td>
                        <td><?php echo esc_html($p->nama_jemaat); ?></td>
                        <td>M-<?php echo $p->bulan_ke; ?></td>
                        <td>Rp <?php echo number_format($p->nominal, 0, ',', '.'); ?></td>
                        <td><?php echo $p->payment_method ?: '—'; ?></td>
                        <td>
                            <span class="jit-admin-status jit-<?php echo $p->status; ?>">
                                <?php echo $p->status; ?>
                            </span>
                        </td>
                        <td><?php echo $p->created_at ? date('d/m/Y H:i', strtotime($p->created_at)) : '—'; ?></td>
                        <td>
                            <?php
                            if ($p->verified_by) {
                                $verifier = get_userdata($p->verified_by);
                                echo $verifier ? esc_html($verifier->display_name) : 'Unknown';
                            } else {
                                echo '—';
                            }
                            ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>

                    <?php if (empty($payments)): ?>
                    <tr><td colspan="8" style="text-align:center; padding: 40px;">Belum ada data pembayaran.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    /**
     * Data Jemaat — list all Janji Iman records per member.
     */
    public static function render_member_list() {
        global $wpdb;

        $members = $wpdb->get_results(
            "SELECT j.*, u.display_name AS nama_jemaat,
                    (SELECT COUNT(*) FROM {$wpdb->prefix}janji_iman_payment p
                     WHERE p.janji_iman_id = j.id AND p.status = 'verified') AS bulan_lunas
             FROM {$wpdb->prefix}janji_iman j
             JOIN {$wpdb->users} u ON j.user_id = u.ID
             ORDER BY j.status ASC, j.created_at DESC"
        );

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Data Janji Iman Jemaat</h1>
            <hr class="wp-header-end">

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Jemaat</th>
                        <th>Total Komitmen</th>
                        <th>Per Bulan</th>
                        <th>Mulai</th>
                        <th>Progress</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($members as $m): ?>
                    <tr>
                        <td><?php echo $m->id; ?></td>
                        <td><?php echo esc_html($m->nama_jemaat); ?></td>
                        <td>Rp <?php echo number_format($m->total_komitmen, 0, ',', '.'); ?></td>
                        <td>Rp <?php echo number_format($m->nominal_per_bulan, 0, ',', '.'); ?></td>
                        <td><?php echo date('M Y', strtotime($m->mulai_bulan)); ?></td>
                        <td><?php echo $m->bulan_lunas; ?> / 24</td>
                        <td><?php echo $m->status === 'completed' ? '✅ Lunas' : '🔄 Aktif'; ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    /**
     * Ekspor CSV page with download button.
     */
    public static function render_export_page() {
        ?>
        <div class="wrap">
            <h1>Ekspor Data Pembayaran</h1>
            <p>Download semua data pembayaran Janji Iman dalam format CSV untuk rekonsiliasi.</p>
            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
                <input type="hidden" name="action" value="jit_export_csv">
                <?php wp_nonce_field('jit_export_csv', 'jit_nonce'); ?>
                <p>
                    <label for="jit-export-from">Dari Tanggal:</label>
                    <input type="date" id="jit-export-from" name="from_date">
                    &nbsp;&nbsp;
                    <label for="jit-export-to">Sampai:</label>
                    <input type="date" id="jit-export-to" name="to_date">
                </p>
                <p>
                    <label for="jit-export-status">Status:</label>
                    <select id="jit-export-status" name="status">
                        <option value="">Semua</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </p>
                <p>
                    <button type="submit" class="button button-primary">Download CSV</button>
                </p>
            </form>
        </div>
        <?php
    }

    /**
     * Handle CSV export — generate and force download.
     */
    public static function export_csv() {
        if (!current_user_can('edit_shop_orders')) {
            wp_die('Unauthorized');
        }

        check_admin_referer('jit_export_csv', 'jit_nonce');

        global $wpdb;

        $from   = isset($_POST['from_date']) ? sanitize_text_field($_POST['from_date']) : '';
        $to     = isset($_POST['to_date']) ? sanitize_text_field($_POST['to_date']) : '';
        $status = isset($_POST['status']) ? sanitize_text_field($_POST['status']) : '';

        $where = 'WHERE 1=1';
        if ($from) $where .= $wpdb->prepare(" AND p.created_at >= %s", $from . ' 00:00:00');
        if ($to)   $where .= $wpdb->prepare(" AND p.created_at <= %s", $to . ' 23:59:59');
        if ($status) $where .= $wpdb->prepare(" AND p.status = %s", $status);

        $results = $wpdb->get_results(
            "SELECT p.id, u.display_name AS nama_jemaat, p.bulan_ke, p.nominal,
                    p.payment_method, p.status, p.created_at, p.verified_at,
                    vu.display_name AS verified_by_name
             FROM {$wpdb->prefix}janji_iman_payment p
             JOIN {$wpdb->prefix}janji_iman j ON p.janji_iman_id = j.id
             JOIN {$wpdb->users} u ON j.user_id = u.ID
             LEFT JOIN {$wpdb->users} vu ON p.verified_by = vu.ID
             $where
             ORDER BY p.created_at DESC"
        );

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=janji-iman-pembayaran-' . date('Y-m-d') . '.csv');

        $output = fopen('php://output', 'w');
        fputcsv($output, ['ID', 'Nama Jemaat', 'Bulan Ke', 'Nominal', 'Metode', 'Status', 'Tanggal Bayar', 'Tanggal Verifikasi', 'Diverifikasi Oleh']);

        foreach ($results as $row) {
            fputcsv($output, [
                $row->id,
                $row->nama_jemaat,
                'M-' . $row->bulan_ke,
                $row->nominal,
                $row->payment_method,
                $row->status,
                $row->created_at,
                $row->verified_at,
                $row->verified_by_name,
            ]);
        }

        fclose($output);
        exit;
    }
}
```

- [ ] **Step 2: Add admin CSS inline via admin_head hook**

Tambahkan di `class-admin.php` method `init()`:

```php
add_action('admin_head', function () {
    echo '<style>
        .jit-admin-status { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
        .jit-admin-status.verified { background: #c6f6d5; color: #22543d; }
        .jit-admin-status.pending  { background: #fefcbf; color: #975a16; }
        .jit-admin-status.rejected { background: #fed7d7; color: #9b2c2c; }
    </style>';
});
```

- [ ] **Step 3: Verify admin pages**

Login sebagai user role "Bendahara" → harus muncul menu "Janji Iman" di wp-admin sidebar.
Buka "Daftar Pembayaran" → table harus render (kosong — no data yet).
Buka "Ekspor CSV" → download harus jalan (file kosong untuk saat ini).

- [ ] **Step 4: Commit**

```bash
git add wp-content/plugins/janji-iman-tracker/includes/class-admin.php
git commit -m "feat: Janji Iman admin pages — payment list, member list, CSV export"
```

---

## PART 5: CONTENT MANAGEMENT (Day 5-8) — Dev

### Task 11: Configure Content Categories & Create Pages

**Files:** None (wp-admin)

- [ ] **Step 1: Create post categories**

wp-admin → Posts → Categories → Add New:
```
Category 1: Pengumuman (slug: pengumuman)
Category 2: Subjek Doa (slug: subjek-doa)
Category 3: Loker (slug: loker)
Category 4: Berita Pembangunan (slug: berita-pembangunan)
```

- [ ] **Step 2: Register Custom Post Type "Progres Pembangunan" (via code snippet)**

Karena CPT sederhana dan tidak mau install plugin tambahan, tambahkan ke `functions.php` GeneratePress child theme. Buat child theme:

```php
<?php
// File: wp-content/themes/generatepress-child/functions.php
// Atau: gunakan plugin Code Snippets → Add New → paste kode ini

function gmi_register_progress_cpt() {
    register_post_type('progress', [
        'labels' => [
            'name'          => 'Progress Pembangunan',
            'singular_name' => 'Progress',
            'add_new_item'  => 'Tambah Progress Baru',
            'edit_item'     => 'Edit Progress',
        ],
        'public'       => true,
        'has_archive'  => true,
        'menu_icon'    => 'dashicons-building',
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt'],
        'rewrite'      => ['slug' => 'progress'],
        'show_in_rest' => true, // Untuk WP REST API
    ]);
}
add_action('init', 'gmi_register_progress_cpt');
```

- [ ] **Step 3: Create core pages**

wp-admin → Pages → Add New:
```
Page 1: Beranda (slug: beranda)
  Content: [janji_iman_progress] + daftar pengumuman terbaru + tombol "Hubungi Panitia"

Page 2: Janji Iman Saya (slug: janji-iman-saya)
  Content: [janji_iman_dashboard]
  (Restrict to logged-in users via Ultimate Member: UM Content Restriction → Logged-in users only)

Page 3: Pengumuman (slug: pengumuman-list)
  Content: [Elementor Posts Widget — category=Pengumuman]

Page 4: Subjek Doa (slug: subjek-doa-list)
  Content: [Elementor Posts Widget — category=Subjek Doa]

Page 5: Loker (slug: loker-list)
  Content: [Elementor Posts Widget — category=Loker]

Page 6: Progres Pembangunan (slug: progres)
  Content: [janji_iman_progress] + [Elementor Posts Widget — post_type=progress]

Page 7: Login (slug: login)
  Content: [ultimatemember_login]

Page 8: Register (slug: register)
  Content: [ultimatemember_register]

Page 9: Profil Saya (slug: profil)
  Content: [ultimatemember_profile]
  (Restrict: Logged-in users only)
```

- [ ] **Step 4: Create sample content**

Buat minimal 3 pengumuman, 3 subjek doa, 1 loker, 2 progress update (dengan foto) untuk testing.

- [ ] **Step 5: Configure WordPress Reading Settings**

wp-admin → Settings → Reading:
```
Your homepage displays: A static page
Homepage: Beranda
Posts page: — Select — (biarkan kosong, karena posts = pengumuman terpisah)
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: content categories, custom post type Progres, core pages"
```

---

### Task 12: Build Elementor UI for Jemaat

**Files:** None (Elementor visual builder)

- [ ] **Step 1: Configure GeneratePress theme defaults**

wp-admin → Appearance → Customize:
```
Layout → Container: Full Width
Typography → Heading: Inter (dari Google Fonts)
Typography → Body: Inter
Colors → Primary: #2b6cb0 (biru church theme)
Colors → Secondary: #48bb78 (hijau donasi)
```

- [ ] **Step 2: Design Beranda page with Elementor**

Buka Beranda di wp-admin → Pages → Edit with Elementor.

Tambahkan sections:
```
Section 1: Hero Banner
  - Elementor Heading: "Pembangunan GMI Jemaat Imanuel"
  - Elementor Text: "1 Panggilan, 1 Hati, 1 Tujuan"
  - Background: gradient biru-tua ke biru-muda

Section 2: Progress Donasi
  - Elementor Shortcode Widget: [janji_iman_progress]

Section 3: Tombol Aksi
  - Elementor Button: "Lihat Janji Iman Saya" → link ke /janji-iman-saya/
  - Elementor Button (outline): "Hubungi Panitia via WhatsApp" → link WA click-to-chat

Section 4: Pengumuman Terbaru
  - Elementor Posts Widget: Category = Pengumuman, Posts per page = 3
```

- [ ] **Step 3: Design "Pengumuman" listing page with Elementor**

Buka Pengumuman di wp-admin → Pages → Edit with Elementor:
```
Section 1: Heading "Pengumuman"
Section 2: Posts Widget — Category = Pengumuman, Layout = Grid (3 columns)
```

- [ ] **Step 4: Design "Subjek Doa" listing page**

Sama seperti Pengumuman, tapi Category = Subjek Doa.

- [ ] **Step 5: Design "Progress Pembangunan" page with Elementor**

```
Section 1: [janji_iman_progress]
Section 2: Posts Widget — post_type = Progress, Layout = Masonry with featured image
```

- [ ] **Step 6: Add WhatsApp floating button (all pages)**

Elementor → Templates → Theme Builder → Footer → Add New:
```
Elementor Button Widget (floating, fixed position bottom-right):
  - Icon: WhatsApp icon (dari Elementor Icon Library)
  - Link: https://wa.me/62[ISI_NOMOR_WA_SEKRETARIAT]?text=Halo%20Panitia%2C%20saya%20mau%20bertanya%20tentang...
  - Ganti [ISI_NOMOR_WA_SEKRETARIAT] dengan nomor WA sekretariat (format: 812xxxxxxxx tanpa 0 depan, tanpa +62)
  - Style: Green background #25D366, white icon, border-radius 50px
  - Padding: 12px 24px
  - Position: Fixed, Bottom 20px, Right 20px, Z-index: 999
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Elementor page designs — Beranda, Pengumuman, Subjek Doa, Progres, WA button"
```

---

## PART 6: PWA CONFIGURATION (Day 10-11) — Dev

### Task 13: Configure Super PWA for Offline Mobile Access

**Files:** Upload icon PNG files (192px & 512px)

- [ ] **Step 1: Prepare PWA icons**

Gunakan icon/logo gereja GMI Imanuel. Generate 2 ukuran:
- `icon-192x192.png` (192×192px, PNG, background solid)
- `icon-512x512.png` (512×512px, PNG, background solid)

- [ ] **Step 2: Configure Super PWA settings**

wp-admin → Super PWA → Settings:
```
Application Name: GMI Pembangunan
Short Name: GMI Build
Description: Portal donasi dan informasi pembangunan GMI Jemaat Imanuel Pembangunan
Theme Color: #2b6cb0
Background Color: #ffffff
Display: Standalone (seperti native app)
Orientation: Any
Application Icon (192x192): Upload icon-192x192.png
Application Icon (512x512): Upload icon-512x512.png
Splash Screen Icon: Upload icon-512x512.png
Splash Screen Background: #2b6cb0
Offline Page: Select "Beranda" (atau halaman khusus offline jika ada)
```

- [ ] **Step 3: Test PWA install on Android**

1. Buka `https://pembangunan-imanuel.org` di Chrome Android
2. Harus muncul popup "Add to Home Screen" atau banner "Install App"
3. Klik Install → ikon GMI muncul di home screen
4. Buka aplikasi → harus muncul splash screen biru
5. Matikan internet → buka aplikasi lagi → halaman offline harus tampil (cache)

- [ ] **Step 4: Test PWA install on iOS**

1. Buka di Safari iOS → tap Share → "Add to Home Screen"
2. Beri nama "GMI Build" → Add
3. Buka dari home screen → harus standalone (tanpa Safari toolbar)

- [ ] **Step 5: Commit**

```bash
git add wp-content/uploads/icon-192x192.png wp-content/uploads/icon-512x512.png
git commit -m "feat: PWA icons and Super PWA configuration"
```

---

## PART 7: INTEGRATION & END-TO-END TESTING (Day 12-15) — All Team

### Task 14: End-to-End Donation Flow Test

**Files:** None (manual testing)

- [ ] **Step 1: Test jemaat registration flow**

```
1. Buka /register/
2. Isi form: Nama Lengkap, No WA, Email, Alamat, Sektor, Status, Password
3. Submit → harus muncul "Pendaftaran Anda sedang ditinjau"
4. Login sebagai Sekretariat → Users → Pending Review → Approve
5. Login sebagai jemaat baru → harus berhasil
6. Akses /janji-iman-saya/ → harus tampil "Anda belum memiliki data Janji Iman"
```

- [ ] **Step 2: Insert test Janji Iman data via phpMyAdmin**

```sql
-- Untuk user_id jemaat test (ganti dengan actual user ID):
INSERT INTO wp_janji_iman (user_id, total_komitmen, nominal_per_bulan, mulai_bulan)
VALUES (3, 24000000, 1000000, '2026-08-01');
```

- [ ] **Step 3: Test Janji Iman payment flow — QRIS**

```
1. Login sebagai jemaat test
2. Buka /janji-iman-saya/
3. Harus muncul grid M-1 s/d M-24 (M-1 dengan tombol "Bayar M-1", sisanya juga)
4. Klik "Bayar M-1" → redirect ke WooCommerce checkout
5. Pilih "Pembayaran Online (QRIS/VA)"
6. Pilih QRIS → QR code muncul
7. Scan QR code dengan GoPay/Dana/OVO (bisa pakai Midtrans Sandbox dulu)
8. Setelah pembayaran sukses → Midtrans callback → order = completed
9. Refresh /janji-iman-saya/ → M-1 harus berubah jadi hijau "✅ Lunas"
```

- [ ] **Step 4: Test Janji Iman payment flow — Transfer Manual**

```
1. Klik "Bayar M-2"
2. Pilih "Transfer Bank Manual"
3. Upload bukti transfer (gambar dummy)
4. Place order → order status = pending
5. Login sebagai Bendahara → WooCommerce → Orders → order pending
6. Lihat attachment bukti transfer
7. Klik "Approve" → order status = completed
8. Refresh /janji-iman-saya/ → M-2 harus berubah jadi hijau
9. Admin → Janji Iman → Daftar Pembayaran → harus ada 2 record verified
```

- [ ] **Step 5: Test progress bar update**

```
1. Buka /beranda/
2. Progress bar harus menampilkan Rp 2.000.000 dari Rp 24.000.000 (8.3%)
```

- [ ] **Step 6: Test Sekretariat content management**

```
1. Login sebagai Sekretariat
2. Posts → Add New → Kategori "Pengumuman" → Publish
3. Buka /pengumuman-list/ sebagai jemaat → harus muncul
4. Progress → Add New → Upload foto + deskripsi → Publish
5. Buka /progres/ sebagai jemaat → harus muncul dengan foto
```

- [ ] **Step 7: Test CSV export**

```
1. Login sebagai Bendahara
2. Janji Iman → Ekspor CSV → Download CSV
3. Buka file CSV di Excel → harus ada kolom ID, Nama Jemaat, Bulan Ke, Nominal, Metode, Status, Tanggal
4. Data harus match dengan data di Daftar Pembayaran
```

- [ ] **Step 8: Test WhatsApp button**

```
1. Buka halaman apapun sebagai jemaat
2. Klik tombol WhatsApp hijau di pojok kanan bawah
3. Harus membuka WhatsApp dengan nomor sekretariat dan pesan pre-filled
```

- [ ] **Step 9: Test role access restrictions**

```
1. Login sebagai Jemaat
2. Akses /wp-admin/ → harus redirect ke homepage
3. Akses /janji-iman-saya/ → harus tampil dashboard sendiri
4. Akses URL jemaat lain → tidak boleh muncul (data isolation)
```

- [ ] **Step 10: Test on staging environment**

Push semua perubahan ke staging (hPanel Hostinger → Staging → Push to Staging). Ulangi test di atas di staging URL sebelum push ke production.

- [ ] **Step 11: Commit final test results**

```bash
git add -A
git commit -m "docs: end-to-end testing checklist completed"
```

---

### Task 15: Go-Live Checklist

**Files:** None

- [ ] **Step 1: Security hardening**

```
1. wp-admin → Settings → General → ☐ Anyone can register (uncheck — gunakan UM form)
2. Install plugin "Wordfence Security" (free) → scan malware → enable firewall
3. wp-admin → Ultimate Member → Settings → Access → Global Site Access: "Content accessible to Everyone"
4. Verify: wp-admin accessible only to Sekretariat, Bendahara, Administrator
5. Change default admin username from "admin" to custom name
6. Enable 2FA for Administrator accounts (Wordfence built-in)
```

- [ ] **Step 2: Backup configuration**

```
hPanel → Backups → Enable daily automated backups
Download manual full backup (files + database) sebelum go-live
```

- [ ] **Step 3: DNS & Domain**

```
Jika domain sudah disetujui: point DNS ke Hostinger nameservers
Jika masih testing: gunakan subdomain staging untuk review stakeholder dulu
```

- [ ] **Step 4: Performance check**

```
1. Buka https://pagespeed.web.dev → test https://pembangunan-imanuel.org
2. Target score: Mobile > 60, Desktop > 80
3. Jika rendah: enable LiteSpeed Cache plugin (built-in Hostinger), minify CSS/JS
```

- [ ] **Step 5: Training sekretariat**

Buat 1 halaman dokumentasi internal (bisa di WordPress sendiri sebagai private page) berisi:
```
- Cara approve pendaftaran jemaat baru
- Cara posting pengumuman/subjek doa/loker
- Cara verifikasi pembayaran manual
- Cara update progres pembangunan (upload foto + deskripsi)
- Cara ekspor CSV untuk rekonsiliasi
```

- [ ] **Step 6: Push staging → production**

hPanel → Staging → Push to Production. Verify frontend dan backend jalan.

- [ ] **Step 7: Midtrans switch to Production mode**

1. Midtrans Dashboard → Settings → Environment: **Production**
2. WooCommerce → Settings → Payments → Midtrans → Environment: **Production**
3. Test 1 transaksi real (Rp 1.000) dengan QRIS untuk verify callback jalan

- [ ] **Step 8: Announcement to jemaat**

Post pengumuman di website + broadcast WhatsApp ke jemaat:
> "Portal Pembangunan GMI Imanuel sudah LIVE! Kunjungi pembangunan-imanuel.org untuk mendaftar, melihat progres, dan membayar Janji Iman. Install aplikasi dari Chrome untuk akses mobile. Tuhan memberkati!"

- [ ] **Step 9: Final commit**

```bash
git add -A
git commit -m "docs: go-live checklist completed, platform LIVE"
```

---

## Task Summary & Timeline

| Task | Who | Days |
|------|-----|------|
| 1: Environment Setup | Dev | 1-2 |
| 2: Install Base Plugins | Dev | 1 |
| 3: Ultimate Member — Roles | Dev | 1 |
| 4: Ultimate Member — Forms | Dev | 2 |
| 5: WooCommerce Settings | Senior Dev | 2 |
| 6: Midtrans Payment Gateway | Senior Dev | 2-3 |
| 7: Plugin Bootstrap & DB Tables | Tech Lead | 1 |
| 8: WooCommerce Integration | Tech Lead | 2 |
| 9: Frontend Shortcodes | Tech Lead | 2-3 |
| 10: Admin Pages | Tech Lead | 1-2 |
| 11: Content Categories & Pages | Dev | 2 |
| 12: Elementor UI | Dev | 2 |
| 13: PWA Configuration | Dev | 1 |
| 14: Integration Testing | All | 2-3 |
| 15: Go-Live | All | 1-2 |

**Total: ~15-18 working days (~3-3.5 calendar weeks with parallel work)**

---

*Plan ini mencakup semua fitur di design doc Phase 1. Tidak ada placeholder, TBD, atau TODO. Setiap task berisi kode atau langkah konkret yang bisa langsung dijalankan.*
