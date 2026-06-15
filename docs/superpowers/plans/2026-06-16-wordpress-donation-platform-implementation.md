# Platform Donasi Pembangunan Gereja — Implementation Plan v2

> **Team:** 1 person + AI work-horse. Setiap task ditandai 🤖 AGENT atau ✋ HUMAN.

**Goal:** WordPress single-tenant donation platform. Donasi recording, QRIS/VA payment, manual transfer verification, Janji Iman M1-M24 tracker, member registration + approval, announcements, PWA. **Target: 2-3 minggu.**

**Architecture:** WordPress di LocalWP (local dev) → Staging Hostinger → Production Hostinger. Plugin-first: Ultimate Member, WooCommerce, Midtrans, Super PWA, Elementor, GeneratePress. 1 custom plugin `janji-iman-tracker`.

**What 🤖 Can Do:** Write code files ke filesystem lokal, generate SQL, buat instruksi konfigurasi detail, verify code consistency, rewrite/edit code based on feedback.

**What ✋ Must Do:** Klik wp-admin, install software, daftar layanan eksternal (Midtrans, Hostinger), upload file via web UI, test di mobile device, transfer bayaran test.

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────┐
│ PHASE A: LOCAL DEV SETUP (Hari 1)                        │
│ ✋ Install LocalWP + semua plugin                         │
│ 🤖 Siapkan direktori custom plugin                        │
├─────────────────────────────────────────────────────────┤
│ PHASE B: CUSTOM PLUGIN DEVELOPMENT (Hari 1-5)            │
│ 🤖 Tulis semua kode PHP/CSS/JS/SQL → local filesystem    │
│ ✋ Activate plugin, verify DB tables terbuat              │
│ ✋ Test shortcode, feedback ke agent                      │
│ 🤖 Perbaiki/revisi kode berdasarkan feedback              │
│ Loop: test → feedback → perbaiki → test lagi              │
├─────────────────────────────────────────────────────────┤
│ PHASE C: WP-ADMIN CONFIGURATION (Hari 2-7, paralel dgn B)│
│ 🤖 Generate instruksi klik-demi-klik                      │
│ ✋ Ikuti instruksi: Ultimate Member, WooCommerce, pages   │
│ ✋ Konfirmasi ke agent: "Step X done"                     │
├─────────────────────────────────────────────────────────┤
│ PHASE D: CONTENT & UI (Hari 5-8)                         │
│ ✋ Elementor page building (ikuti desain dari agent)      │
│ ✋ Create sample content                                  │
│ 🤖 Generate CSS/JS tambahan untuk styling                 │
├─────────────────────────────────────────────────────────┤
│ PHASE E: PAYMENT — DUAL TRACK (Hari 1-14)                │
│ Track 1 — ✋ Daftar Midtrans (proses 1-2 minggu)          │
│ Track 2 — 🤖 Kode transfer manual (langsung jalan)       │
│ ✋ Test transfer manual dulu, Midtrans nyusul             │
├─────────────────────────────────────────────────────────┤
│ PHASE F: PWA (Hari 7-8)                                  │
│ 🤖 Generate PWA config instructions                       │
│ ✋ Upload icon, konfigurasi Super PWA, test di HP          │
├─────────────────────────────────────────────────────────┤
│ PHASE G: TESTING & GO-LIVE (Hari 8-15)                   │
│ ✋ E2E test di local → feedback ke agent                  │
│ 🤖 Perbaiki bug yang ditemukan                            │
│ ✋ Deploy ke Hostinger staging → test → production        │
└─────────────────────────────────────────────────────────┘
```

---

## Prerequisites (Sebelum Mulai)

- [ ] ✋ **Download & install LocalWP** dari https://localwp.com (gratis, Windows)
- [ ] ✋ **Create site di LocalWP:** klik "+" → "Create a New Site" → nama: `gmi-imanuel` → PHP 8.x, MySQL 8.x, nginx → Continue
- [ ] ✋ **Note LocalWP site path:** default di `C:\Users\[User]\Local Sites\gmi-imanuel\app\public\`
- [ ] ✋ **Buka wp-admin LocalWP** (klik "Admin" di LocalWP UI) → login
- [ ] ✋ **Daftar Hostinger WooCommerce Hosting** (bisa paralel, tidak blocking) → tidak perlu langsung dipakai
- [ ] ✋ **Daftar Midtrans** di https://midtrans.com (bisa paralel, proses KYC 1-2 minggu) → tidak blocking karena ada fallback transfer manual

---

## PHASE A: Plugin Installation (Hari 1)

### Task A1: Install semua plugin via wp-admin

✋ **HUMAN** — Buka wp-admin LocalWP → Plugins → Add New. Install & activate semua ini:

```
☐ GeneratePress (theme)
☐ Elementor (page builder)
☐ Ultimate Member
☐ WooCommerce
☐ Midtrans for WooCommerce (install tapi jangan setup dulu)
☐ Super PWA (install tapi jangan setup dulu)
```

Setelah selesai, beri tahu agent: **"Semua plugin installed."**

---

## PHASE B: Custom Plugin — Janji Iman Tracker (Hari 1-5)

> 🤖 Agent writes ALL code to `C:\Users\[User]\Local Sites\gmi-imanuel\app\public\wp-content\plugins\janji-iman-tracker\`

### Task B1: Bootstrap plugin + DB tables

🤖 **AGENT** — Create file structure:

```
wp-content/plugins/janji-iman-tracker/
├── janji-iman-tracker.php
├── includes/
│   ├── class-activator.php
│   ├── class-shortcodes.php
│   ├── class-woocommerce-integration.php
│   └── class-admin.php
├── assets/
│   ├── css/janji-iman.css
│   └── js/janji-iman.js
```

🤖 **AGENT** — Write `janji-iman-tracker.php`:

```php
<?php
/**
 * Plugin Name: Janji Iman Tracker
 * Description: M1-M24 Faith Commitment tracking for GMI Jemaat Imanuel.
 * Version: 1.0.0
 * Text Domain: janji-iman-tracker
 */
defined('ABSPATH') || exit;

define('JIT_VERSION', '1.0.0');
define('JIT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('JIT_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once JIT_PLUGIN_DIR . 'includes/class-activator.php';
require_once JIT_PLUGIN_DIR . 'includes/class-shortcodes.php';
require_once JIT_PLUGIN_DIR . 'includes/class-woocommerce-integration.php';
require_once JIT_PLUGIN_DIR . 'includes/class-admin.php';

register_activation_hook(__FILE__, ['JIT_Activator', 'activate']);
register_deactivation_hook(__FILE__, ['JIT_Activator', 'deactivate']);

add_action('init', ['JIT_Shortcodes', 'init']);
add_action('init', ['JIT_WooCommerce_Integration', 'init']);
add_action('init', ['JIT_Admin', 'init']);

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('jit-style', JIT_PLUGIN_URL . 'assets/css/janji-iman.css', [], JIT_VERSION);
    wp_enqueue_script('jit-script', JIT_PLUGIN_URL . 'assets/js/janji-iman.js', ['jquery'], JIT_VERSION, true);
    wp_localize_script('jit-script', 'JIT_Ajax', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('jit_nonce'),
    ]);
});
```

🤖 **AGENT** — Write `includes/class-activator.php`:

```php
<?php
class JIT_Activator {
    public static function activate() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        $t1 = $wpdb->prefix . 'janji_iman';
        $sql1 = "CREATE TABLE $t1 (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NOT NULL,
            total_komitmen DECIMAL(15,2) NOT NULL,
            nominal_per_bulan DECIMAL(15,2) NOT NULL,
            mulai_bulan DATE NOT NULL,
            status VARCHAR(20) DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_user_id (user_id),
            INDEX idx_status (status)
        ) $charset_collate;";

        $t2 = $wpdb->prefix . 'janji_iman_payment';
        $sql2 = "CREATE TABLE $t2 (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            janji_iman_id BIGINT NOT NULL,
            woocommerce_order_id BIGINT,
            bulan_ke TINYINT NOT NULL,
            nominal DECIMAL(15,2) NOT NULL,
            payment_method VARCHAR(30),
            status VARCHAR(20) DEFAULT 'pending',
            verified_by BIGINT,
            verified_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_janji_iman_id (janji_iman_id),
            INDEX idx_order_id (woocommerce_order_id),
            INDEX idx_bulan_ke (bulan_ke),
            INDEX idx_status (status)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql1);
        dbDelta($sql2);

        add_option('jit_db_version', JIT_VERSION);
    }

    public static function deactivate() {
        // Preserve data — no DROP TABLE
    }
}
```

✋ **HUMAN** — Setelah agent menulis file:
1. Verify file ada di `Local Sites\gmi-imanuel\app\public\wp-content\plugins\janji-iman-tracker\`
2. Buka wp-admin → Plugins → cari "Janji Iman Tracker" → **Activate**
3. Buka Tools → Site Health → Info → Database → verify `wp_janji_iman` dan `wp_janji_iman_payment` ada
4. Atau buka http://gmi-imanuel.local/wp-admin → URL phpMyAdmin bawaan LocalWP
5. Laporkan ke agent: **"Plugin activated, DB tables OK"** atau **"Error: [pesan error]"**

---

### Task B2: WooCommerce Integration

🤖 **AGENT** — Write `includes/class-woocommerce-integration.php`:

```php
<?php
class JIT_WooCommerce_Integration {

    public static function init() {
        add_filter('woocommerce_add_cart_item_data', [__CLASS__, 'add_cart_item_data'], 10, 2);
        add_filter('woocommerce_get_item_data', [__CLASS__, 'display_cart_item_data'], 10, 2);
        add_action('woocommerce_checkout_create_order_line_item', [__CLASS__, 'save_order_item_meta'], 10, 4);
        add_action('woocommerce_order_status_completed', [__CLASS__, 'on_order_completed'], 10, 1);
        add_action('woocommerce_order_status_changed', [__CLASS__, 'on_order_status_changed'], 10, 3);
    }

    /**
     * Attach Janji Iman data to cart from URL params.
     * URL: /checkout/?add-to-cart=PRODUCT_ID&janji_iman_id=1&bulan_ke=3
     */
    public static function add_cart_item_data($cart_item_data, $product_id) {
        if (isset($_GET['janji_iman_id']) && isset($_GET['bulan_ke'])) {
            $cart_item_data['janji_iman_id'] = intval($_GET['janji_iman_id']);
            $cart_item_data['bulan_ke']      = intval($_GET['bulan_ke']);
            $cart_item_data['unique_key']    = 'ji_' . $_GET['janji_iman_id'] . '_m' . $_GET['bulan_ke'];
        }
        return $cart_item_data;
    }

    public static function display_cart_item_data($item_data, $cart_item) {
        if (isset($cart_item['janji_iman_id'])) {
            $item_data[] = [
                'name'  => 'Janji Iman',
                'value' => 'ID #' . $cart_item['janji_iman_id'] . ' — Bulan ke-' . $cart_item['bulan_ke'],
            ];
        }
        return $item_data;
    }

    public static function save_order_item_meta($item, $cart_item_key, $values, $order) {
        if (isset($values['janji_iman_id'])) {
            $item->add_meta_data('_janji_iman_id', $values['janji_iman_id']);
            $item->add_meta_data('_bulan_ke', $values['bulan_ke']);
        }
    }

    public static function on_order_completed($order_id) {
        $order = wc_get_order($order_id);
        foreach ($order->get_items() as $item) {
            $ji_id   = $item->get_meta('_janji_iman_id');
            $bulan   = $item->get_meta('_bulan_ke');
            if ($ji_id && $bulan) {
                self::record_payment($ji_id, $order_id, $bulan, $item->get_total(), $order->get_payment_method());
            }
        }
    }

    public static function on_order_status_changed($order_id, $old_status, $new_status) {
        if ($new_status === 'completed' && $old_status !== 'completed') {
            self::on_order_completed($order_id);
            $user = wp_get_current_user();
            if ($user->ID) {
                global $wpdb;
                $wpdb->update(
                    $wpdb->prefix . 'janji_iman_payment',
                    ['verified_by' => $user->ID, 'verified_at' => current_time('mysql')],
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

    private static function record_payment($ji_id, $order_id, $bulan, $nominal, $method) {
        global $wpdb;
        $t = $wpdb->prefix . 'janji_iman_payment';
        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT id FROM $t WHERE janji_iman_id = %d AND bulan_ke = %d", $ji_id, $bulan
        ));
        if ($existing) {
            $wpdb->update($t, [
                'woocommerce_order_id' => $order_id, 'nominal' => $nominal,
                'payment_method' => $method, 'status' => 'verified',
                'verified_at' => current_time('mysql'),
            ], ['id' => $existing->id]);
        } else {
            $wpdb->insert($t, [
                'janji_iman_id' => $ji_id, 'woocommerce_order_id' => $order_id,
                'bulan_ke' => $bulan, 'nominal' => $nominal,
                'payment_method' => $method, 'status' => 'verified',
                'verified_at' => current_time('mysql'),
            ]);
        }
        self::check_completion($ji_id);
    }

    private static function check_completion($ji_id) {
        global $wpdb;
        $paid = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}janji_iman_payment
             WHERE janji_iman_id = %d AND status = 'verified'", $ji_id
        ));
        if ($paid >= 24) {
            $wpdb->update($wpdb->prefix . 'janji_iman', ['status' => 'completed'], ['id' => $ji_id]);
        }
    }
}
```

---

### Task B3: Frontend Shortcodes

🤖 **AGENT** — Write `includes/class-shortcodes.php`:

```php
<?php
class JIT_Shortcodes {

    public static function init() {
        add_shortcode('janji_iman_dashboard', [__CLASS__, 'render_dashboard']);
        add_shortcode('janji_iman_progress', [__CLASS__, 'render_progress']);
    }

    public static function render_dashboard() {
        if (!is_user_logged_in()) {
            return '<p style="text-align:center;padding:40px;">Silakan <a href="/login/">login</a> untuk melihat Janji Iman Anda.</p>';
        }

        global $wpdb;
        $uid = get_current_user_id();
        $ji = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}janji_iman WHERE user_id = %d ORDER BY id DESC LIMIT 1", $uid
        ));

        if (!$ji) {
            return '<p style="text-align:center;padding:40px;">Anda belum memiliki data Janji Iman. Hubungi Sekretariat.</p>';
        }

        $payments = $wpdb->get_results($wpdb->prepare(
            "SELECT bulan_ke, status, nominal, created_at
             FROM {$wpdb->prefix}janji_iman_payment
             WHERE janji_iman_id = %d ORDER BY bulan_ke ASC", $ji->id
        ), OBJECT_K);

        $pid = self::get_product_id();
        $checkout_url = wc_get_checkout_url();

        ob_start();
        echo '<div class="jit-dashboard">';
        echo '<div class="jit-header">';
        echo '<h2>Janji Iman Saya</h2>';
        echo '<p>Total Komitmen: <strong>Rp ' . number_format($ji->total_komitmen, 0, ',', '.') . '</strong></p>';
        echo '<p>Cicilan: Rp ' . number_format($ji->nominal_per_bulan, 0, ',', '.') . '/bulan × 24 bulan</p>';
        echo '<p>Status: <strong>' . ($ji->status === 'completed' ? '✅ Lunas' : '🔄 Aktif') . '</strong></p>';
        echo '</div>';

        echo '<div class="jit-grid">';
        for ($i = 1; $i <= 24; $i++) {
            $p = isset($payments[$i]) ? $payments[$i] : null;
            $status = $p ? $p->status : 'unpaid';
            $css = ['verified' => 'jit-paid', 'pending' => 'jit-pending', 'unpaid' => 'jit-unpaid', 'rejected' => 'jit-rejected'][$status];
            echo "<div class=\"jit-month $css\">";
            echo '<div class="jit-month-num">M-' . $i . '</div>';
            echo '<div class="jit-month-amount">Rp ' . number_format($ji->nominal_per_bulan, 0, ',', '.') . '</div>';
            if ($status === 'verified') {
                echo '<div class="jit-month-status">✅ Lunas</div>';
                echo '<div class="jit-month-date">' . date('d/m/Y', strtotime($p->created_at)) . '</div>';
            } elseif ($status === 'pending') {
                echo '<div class="jit-month-status">⏳ Verifikasi</div>';
            } elseif ($status === 'rejected') {
                echo '<div class="jit-month-status">❌ Ditolak</div>';
            } else {
                $url = add_query_arg([
                    'add-to-cart'   => $pid,
                    'janji_iman_id' => $ji->id,
                    'bulan_ke'      => $i,
                ], $checkout_url);
                echo '<a href="' . esc_url($url) . '" class="jit-pay-btn">Bayar</a>';
            }
            echo '</div>';
        }
        echo '</div>';

        if ($ji->status === 'completed') {
            echo '<div class="jit-completed">🎉 Puji Tuhan! Janji Iman 24 bulan Anda telah LUNAS. Total: Rp ' . number_format($ji->total_komitmen, 0, ',', '.') . '</div>';
        }
        echo '</div>';
        return ob_get_clean();
    }

    public static function render_progress() {
        global $wpdb;
        $raised = $wpdb->get_var("SELECT COALESCE(SUM(nominal), 0) FROM {$wpdb->prefix}janji_iman_payment WHERE status = 'verified'");
        $target = $wpdb->get_var("SELECT COALESCE(SUM(total_komitmen), 0) FROM {$wpdb->prefix}janji_iman WHERE status IN ('active', 'completed')");
        $pct = $target > 0 ? min(round(($raised / $target) * 100, 1), 100) : 0;

        ob_start();
        echo '<div class="jit-progress">';
        echo '<h3>Total Donasi Janji Iman Terkumpul</h3>';
        echo '<div class="jit-bar"><div class="jit-fill" style="width:' . $pct . '%"></div></div>';
        echo '<div class="jit-stats"><span>Rp ' . number_format($raised, 0, ',', '.') . '</span><span>dari Rp ' . number_format($target, 0, ',', '.') . '</span><span>' . $pct . '%</span></div>';
        echo '</div>';
        return ob_get_clean();
    }

    private static function get_product_id() {
        $pid = get_option('jit_product_id', 0);
        if (!$pid || !wc_get_product($pid)) {
            $pid = wc_get_product_id_by_sku('JANJI-IMAN-BULANAN');
            if ($pid) update_option('jit_product_id', $pid);
        }
        return $pid;
    }
}
```

🤖 **AGENT** — Write `assets/css/janji-iman.css`:

```css
.jit-dashboard { max-width: 960px; margin: 0 auto; padding: 20px; font-family: 'Inter', sans-serif; }
.jit-header { text-align: center; margin-bottom: 30px; }
.jit-header h2 { font-size: 24px; color: #2d3748; }
.jit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.jit-month { border: 2px solid #e2e8f0; border-radius: 8px; padding: 14px 10px; text-align: center; }
.jit-month.jit-paid { border-color: #48bb78; background: #f0fff4; }
.jit-month.jit-pending { border-color: #ecc94b; background: #fffff0; }
.jit-month.jit-unpaid { border-color: #e2e8f0; background: #f7fafc; }
.jit-month.jit-rejected { border-color: #fc8181; background: #fff5f5; }
.jit-month-num { font-size: 18px; font-weight: 700; color: #2d3748; }
.jit-month-amount { font-size: 12px; color: #718096; margin-bottom: 8px; }
.jit-month-status { font-size: 13px; }
.jit-month-date { font-size: 11px; color: #a0aec0; }
.jit-pay-btn { display: inline-block; background: #4299e1; color: #fff; padding: 6px 16px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600; }
.jit-pay-btn:hover { background: #2b6cb0; color: #fff; text-decoration: none; }
.jit-completed { margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #48bb78, #38a169); color: #fff; text-align: center; border-radius: 8px; font-size: 18px; }
.jit-progress { max-width: 600px; margin: 0 auto; padding: 20px; }
.jit-progress h3 { text-align: center; font-size: 18px; color: #2d3748; margin-bottom: 16px; }
.jit-bar { width: 100%; height: 24px; background: #edf2f7; border-radius: 12px; overflow: hidden; }
.jit-fill { height: 100%; background: linear-gradient(90deg, #48bb78, #38a169); border-radius: 12px; transition: width 0.6s; }
.jit-stats { display: flex; justify-content: space-between; margin-top: 8px; font-size: 14px; color: #4a5568; }
```

🤖 **AGENT** — Write `assets/js/janji-iman.js`:

```javascript
jQuery(document).ready(function($){
    $('.jit-pay-btn').on('click', function(){ $(this).text('Mengarahkan...').css('opacity','0.7'); });
});
```

✋ **HUMAN** — Buat file `janji-iman.js` dan `janji-iman.css` di folder assets (agent akan menulisnya). Atau minta agent untuk menulis SEMUA file dulu sekaligus.

---

### Task B4: Admin Pages

🤖 **AGENT** — Write `includes/class-admin.php`:

```php
<?php
class JIT_Admin {

    public static function init() {
        add_action('admin_menu', [__CLASS__, 'add_pages']);
        add_action('admin_post_jit_export_csv', [__CLASS__, 'export_csv']);
        add_action('admin_head', function () {
            echo '<style>.jit-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600}
            .jit-badge.verified{background:#c6f6d5;color:#22543d}
            .jit-badge.pending{background:#fefcbf;color:#975a16}
            .jit-badge.rejected{background:#fed7d7;color:#9b2c2c}</style>';
        });
    }

    public static function add_pages() {
        add_menu_page('Janji Iman', 'Janji Iman', 'edit_shop_orders', 'janji-iman', [__CLASS__, 'render_payments'], 'dashicons-heart', 30);
        add_submenu_page('janji-iman', 'Data Jemaat', 'Data Jemaat', 'edit_shop_orders', 'janji-iman-members', [__CLASS__, 'render_members']);
        add_submenu_page('janji-iman', 'Ekspor CSV', 'Ekspor CSV', 'edit_shop_orders', 'janji-iman-export', [__CLASS__, 'render_export']);
    }

    public static function render_payments() {
        global $wpdb;
        $status = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';
        $where = $status ? $wpdb->prepare("WHERE p.status = %s", $status) : '';
        $rows = $wpdb->get_results(
            "SELECT p.*, u.display_name AS nama, j.nominal_per_bulan
             FROM {$wpdb->prefix}janji_iman_payment p
             JOIN {$wpdb->prefix}janji_iman j ON p.janji_iman_id = j.id
             JOIN {$wpdb->users} u ON j.user_id = u.ID
             $where ORDER BY p.created_at DESC LIMIT 100"
        );
        echo '<div class="wrap"><h1>Daftar Pembayaran Janji Iman</h1>';
        echo '<ul class="subsubsub">
            <li><a href="?page=janji-iman">Semua</a> |</li>
            <li><a href="?page=janji-iman&status=verified">Verified</a> |</li>
            <li><a href="?page=janji-iman&status=pending">Pending</a> |</li>
            <li><a href="?page=janji-iman&status=rejected">Rejected</a></li></ul>';
        echo '<table class="wp-list-table widefat fixed striped"><thead><tr>
            <th>ID</th><th>Jemaat</th><th>Bulan</th><th>Nominal</th><th>Metode</th><th>Status</th><th>Tanggal</th><th>Verifikator</th>
        </tr></thead><tbody>';
        foreach ($rows as $r) {
            $v = $r->verified_by ? get_userdata($r->verified_by) : null;
            echo "<tr>
                <td>{$r->id}</td><td>" . esc_html($r->nama) . "</td><td>M-{$r->bulan_ke}</td>
                <td>Rp " . number_format($r->nominal, 0, ',', '.') . "</td>
                <td>" . ($r->payment_method ?: '—') . "</td>
                <td><span class=\"jit-badge {$r->status}\">{$r->status}</span></td>
                <td>" . ($r->created_at ? date('d/m/Y H:i', strtotime($r->created_at)) : '—') . "</td>
                <td>" . ($v ? esc_html($v->display_name) : '—') . "</td>
            </tr>";
        }
        if (empty($rows)) echo '<tr><td colspan="8" style="text-align:center;padding:40px;">Belum ada data.</td></tr>';
        echo '</tbody></table></div>';
    }

    public static function render_members() {
        global $wpdb;
        $rows = $wpdb->get_results(
            "SELECT j.*, u.display_name AS nama,
                    (SELECT COUNT(*) FROM {$wpdb->prefix}janji_iman_payment p
                     WHERE p.janji_iman_id = j.id AND p.status = 'verified') AS lunas
             FROM {$wpdb->prefix}janji_iman j
             JOIN {$wpdb->users} u ON j.user_id = u.ID
             ORDER BY j.status ASC"
        );
        echo '<div class="wrap"><h1>Data Janji Iman Jemaat</h1>';
        echo '<table class="wp-list-table widefat fixed striped"><thead><tr>
            <th>ID</th><th>Nama</th><th>Total</th><th>Per Bulan</th><th>Mulai</th><th>Progress</th><th>Status</th>
        </tr></thead><tbody>';
        foreach ($rows as $r) {
            echo "<tr>
                <td>{$r->id}</td><td>" . esc_html($r->nama) . "</td>
                <td>Rp " . number_format($r->total_komitmen, 0, ',', '.') . "</td>
                <td>Rp " . number_format($r->nominal_per_bulan, 0, ',', '.') . "</td>
                <td>" . date('M Y', strtotime($r->mulai_bulan)) . "</td>
                <td>{$r->lunas} / 24</td>
                <td>" . ($r->status === 'completed' ? '✅ Lunas' : '🔄 Aktif') . "</td>
            </tr>";
        }
        echo '</tbody></table></div>';
    }

    public static function render_export() {
        echo '<div class="wrap"><h1>Ekspor Data Pembayaran</h1>
        <form method="post" action="' . admin_url('admin-post.php') . '">
        <input type="hidden" name="action" value="jit_export_csv">
        ' . wp_nonce_field('jit_export_csv', 'jit_nonce', true, false) . '
        <p><label>Dari: <input type="date" name="from_date"></label>
        &nbsp; <label>Sampai: <input type="date" name="to_date"></label></p>
        <p><label>Status: <select name="status">
            <option value="">Semua</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
        </select></label></p>
        <p><button type="submit" class="button button-primary">Download CSV</button></p>
        </form></div>';
    }

    public static function export_csv() {
        if (!current_user_can('edit_shop_orders')) wp_die('Unauthorized');
        check_admin_referer('jit_export_csv', 'jit_nonce');

        global $wpdb;
        $from   = sanitize_text_field($_POST['from_date'] ?? '');
        $to     = sanitize_text_field($_POST['to_date'] ?? '');
        $status = sanitize_text_field($_POST['status'] ?? '');

        $where = 'WHERE 1=1';
        if ($from) $where .= $wpdb->prepare(" AND p.created_at >= %s", $from . ' 00:00:00');
        if ($to)   $where .= $wpdb->prepare(" AND p.created_at <= %s", $to . ' 23:59:59');
        if ($status) $where .= $wpdb->prepare(" AND p.status = %s", $status);

        $rows = $wpdb->get_results(
            "SELECT p.id, u.display_name AS nama, p.bulan_ke, p.nominal, p.payment_method,
                    p.status, p.created_at, p.verified_at, vu.display_name AS verifikator
             FROM {$wpdb->prefix}janji_iman_payment p
             JOIN {$wpdb->prefix}janji_iman j ON p.janji_iman_id = j.id
             JOIN {$wpdb->users} u ON j.user_id = u.ID
             LEFT JOIN {$wpdb->users} vu ON p.verified_by = vu.ID
             $where ORDER BY p.created_at DESC"
        );

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=janji-iman-' . date('Y-m-d') . '.csv');
        $out = fopen('php://output', 'w');
        fputcsv($out, ['ID', 'Nama', 'Bulan Ke', 'Nominal', 'Metode', 'Status', 'Tanggal Bayar', 'Verifikasi', 'Verifikator']);
        foreach ($rows as $r) {
            fputcsv($out, [$r->id, $r->nama, 'M-'.$r->bulan_ke, $r->nominal, $r->payment_method, $r->status, $r->created_at, $r->verified_at, $r->verifikator]);
        }
        fclose($out);
        exit;
    }
}
```

✋ **HUMAN** — Setelah B1-B4 selesai: **test custom plugin.** Buat halaman test dulu:

---

## PHASE C: WP-ADMIN CONFIGURATION (Hari 2-7)

> 🤖 Agent memberikan instruksi klik-demi-klik. ✋ Human menjalankan satu per satu, lalu konfirmasi "Done" ke agent. Agent bisa verifikasi dengan membaca file yang tercipta (misal: wp_options, wp_posts via SQL dump nanti).

### Task C1: WooCommerce Setup

✋ **HUMAN** — Ikuti langkah ini:

```
1. wp-admin → WooCommerce → Settings → General
   - Currency: Indonesian Rupiah (Rp)
   - Thousand separator: .
   - Decimal separator: ,
   - Number of decimals: 0

2. WooCommerce → Settings → Accounts & Privacy
   - ☑ Allow customers to place orders without an account
   - ☐ Allow customers to create an account during checkout (uncheck)
   - ☐ Allow customers to log into an existing account during checkout (uncheck)

3. WooCommerce → Products → Add New
   - Name: "Pembayaran Janji Iman Bulanan"
   - Type: Virtual ✅
   - Price: 0
   - SKU: JANJI-IMAN-BULANAN
   - Catalog visibility: Hidden
   - Publish

4. WooCommerce → Settings → Payments → Direct Bank Transfer → Manage
   - ☑ Enable
   - Title: "Transfer Bank Manual"
   - Description: "Transfer ke rekening Mandiri [NOMOR_REKENING_GEREJA] a.n. GMI Jemaat Imanuel. Upload bukti transfer."
   - Account details: Bank Mandiri, No: [NOMOR_REKENING_GEREJA], Nama: GMI Jemaat Imanuel Pembangunan
   - Save
```

Setelah selesai, laporkan: **"WooCommerce configured. Product ID: [lihat dari URL edit product]"**

🤖 **AGENT** — Catat product ID yang dilaporkan. Update jika perlu.

---

### Task C2: Ultimate Member — Roles & Forms

✋ **HUMAN** — Ikuti langkah ini:

```
1. wp-admin → Ultimate Member → User Roles → Add New
   - Role ID: um_jemaat
   - Role Name: Jemaat
   - Can edit profile? Yes
   - Can delete account? No
   
2. User Roles → Add New
   - Role ID: um_sekretariat
   - Role Name: Sekretariat
   - Can edit profile? Yes
   - Administrative: edit_posts, publish_posts, upload_files, edit_others_posts
   
3. User Roles → Add New
   - Role ID: um_bendahara
   - Role Name: Bendahara
   - Administrative: edit_shop_orders, edit_others_shop_orders, view_admin_dashboard

4. Forms → Add New → Registration Form
   - Name: "Registrasi Jemaat"
   - Fields (drag-drop): Username*, Nama Lengkap*, Nomor WhatsApp*, Email*, Alamat, Sektor Wilayah (Dropdown: Sektor 1-5), Status (Radio: Jemaat Aktif/Simpatisan), Password*, Confirm Password*
   - Tab "User": Default Role = Jemaat, Registration Status = Require Admin Review
   - Publish

5. Forms → Add New → Login Form
   - Name: "Login Jemaat"
   - Fields: Username/Email, Password
   - Publish

6. Settings → Access → Global Site Access: Content accessible to Everyone
   - Restriction: Jemaat role → redirect to homepage when accessing /wp-admin/
```

Setelah selesai, laporkan: **"UM configured."**

---

### Task C3: Create Core Pages with Shortcodes

✋ **HUMAN** — Buat halaman-halaman berikut:

```
1. Pages → Add New → "Beranda" (slug: beranda)
   Content: [janji_iman_progress]
   Template: Elementor Full Width

2. Pages → Add New → "Janji Iman Saya" (slug: janji-iman-saya)
   Content: [janji_iman_dashboard]
   UM Content Restriction → Logged-in users only

3. Pages → Add New → "Login" (slug: login)
   Content: [ultimatemember_login]

4. Pages → Add New → "Register" (slug: register)
   Content: [ultimatemember_register]

5. Pages → Add New → "Profil Saya" (slug: profil)
   Content: [ultimatemember_profile]
   UM Content Restriction → Logged-in users only

6. Pages → Add New → "Pengumuman" (slug: pengumuman)
   (Elementor Posts Widget nanti — untuk sekarang kosongkan dulu)

7. Pages → Add New → "Subjek Doa" (slug: subjek-doa)

8. Pages → Add New → "Loker" (slug: loker)

9. Pages → Add New → "Progres Pembangunan" (slug: progres)
   Content: [janji_iman_progress]

10. Settings → Reading → Homepage: "Beranda" (static page)
```

---

### Task C4: Post Categories untuk Announcements

✋ **HUMAN** — Posts → Categories → Add:

```
- Pengumuman (slug: pengumuman)
- Subjek Doa (slug: subjek-doa)
- Loker (slug: loker)
```

---

## PHASE D: PAYMENT — DUAL TRACK (Hari 1-14)

### Track 1: Manual Transfer (jalan HARI INI)

🤖 **AGENT** — Done! Kode WooCommerce hook di class-woocommerce-integration.php sudah handle ini. Order status completed → auto-record ke `wp_janji_iman_payment`.

✋ **HUMAN** — Test flow manual:

```
1. Buat test user Jemaat (wp-admin → Users → Add New → role: Jemaat)
2. Insert test Janji Iman via LocalWP Database tool:
   INSERT INTO wp_janji_iman (user_id, total_komitmen, nominal_per_bulan, mulai_bulan)
   VALUES ([TEST_USER_ID], 24000000, 1000000, '2026-08-01');
3. Login sebagai jemaat test
4. Buka /janji-iman-saya/ → harus tampil grid M1-M24
5. Klik "Bayar" di M-1 → redirect ke checkout
6. Pilih "Transfer Bank Manual" → Place Order
7. Login sebagai Bendahara → WooCommerce → Orders → order pending → Edit
8. Scroll ke bawah, lihat attachment bukti transfer
9. Change status: Pending → Completed → Update
10. Refresh /janji-iman-saya/ → M-1 harus jadi "✅ Lunas"
11. Buka /beranda/ → progress bar harus update
```

### Track 2: Midtrans Registration (paralel, tidak blocking)

✋ **HUMAN** — Sambil nunggu manual test selesai:

```
1. Buka https://midtrans.com → Daftar → Non-Profit/Yayasan
2. Isi data gereja: GMI Jemaat Imanuel Pembangunan
3. Submit KYC (biasanya 1-2 minggu)
4. Setelah approve, dapat Merchant ID, Client Key, Server Key
5. wp-admin → WooCommerce → Settings → Payments → Midtrans → Manage
   - ☑ Enable
   - Environment: Sandbox (TEST DULU)
   - Input Merchant ID, Client Key, Server Key
   - ☑ QRIS, Virtual Account, GoPay
   - Save
6. Test sandbox transaction
7. Setelah OK → switch ke Production
```

---

## PHASE E: UI BUILDING (Hari 5-8)

### Task E1: Elementor Page Design

✋ **HUMAN** — Buka setiap halaman dengan "Edit with Elementor":

**Halaman Beranda:**
```
Section 1: Hero
  - Heading: "Pembangunan GMI Jemaat Imanuel"
  - Subheading: "1 Panggilan, 1 Hati, 1 Tujuan"
  - Background: gradient blue

Section 2: Progress Donasi
  - Shortcode Widget: [janji_iman_progress]

Section 3: Tombol Aksi
  - Button "Janji Iman Saya" → link: /janji-iman-saya/
  - Button "Hubungi Panitia" → link WA: https://wa.me/62[ISI_NOMOR_WA]?text=Halo%20Panitia

Section 4: Pengumuman Terbaru
  - Posts Widget: Source = Posts, Categories = Pengumuman, Posts per page = 3, Layout = Grid
```

**Halaman Pengumuman / Subjek Doa / Loker:**
```
Section: Posts Widget → Category = [sesuai], Grid 3 columns
```

**Halaman Progres Pembangunan:**
```
Section 1: [janji_iman_progress]
Section 2: Post type = Progress (custom) — nanti isi manual
```

**WhatsApp Floating Button (Global):**
```
Elementor → Templates → Theme Builder → Footer → Add New
Drag Button Widget → Position: Fixed, Bottom 20px, Right 20px
Icon: WhatsApp, Link: wa.me/[NOMOR], Color: #25D366
Publish → Condition: Entire Site
```

### Task E2: Custom Post Type "Progress"

✋ **HUMAN** — Install plugin **Custom Post Type UI** (gratis) → Add New:

```
Post Type Slug: progress
Plural Label: Progress Pembangunan
Singular Label: Progress
Menu Icon: dashicons-building
Supports: title, editor, thumbnail, excerpt
Has Archive: Yes
Public: Yes
Show in REST: Yes
```

Atau minta 🤖 **AGENT** untuk menambahkan kode CPT ke theme functions.php.

---

## PHASE F: PWA (Hari 7-8)

### Task F1: Super PWA Configuration

✋ **HUMAN** — Siapkan 2 file icon dulu. Minta 🤖 **AGENT** untuk generate SVG icon atau gunakan logo Gereja.

```
wp-admin → Super PWA → Settings:
  - Application Name: GMI Pembangunan
  - Short Name: GMI Build
  - Theme Color: #2b6cb0
  - Background Color: #ffffff
  - Display: Standalone
  - App Icon 192×192: Upload
  - App Icon 512×512: Upload
  - Save
```

✋ **HUMAN** — Test di HP:
```
1. Buka http://[IP_LOCAL]:[PORT] di Chrome Android (LocalWP kasih live link)
2. Harus muncul "Add to Home Screen"
3. Install → buka → harus fullscreen tanpa address bar
4. Matikan wifi → buka lagi → harus muncul halaman offline
```

---

## PHASE G: TESTING & GO-LIVE (Hari 8-15)

### Task G1: End-to-End Testing Checklist

✋ **HUMAN** — Test scenario ini:

```
☐ Registrasi jemaat baru → admin approve → jemaat login sukses
☐ Jemaat lihat Janji Iman dashboard (setelah data di-insert via DB)
☐ Jemaat bayar via "Transfer Manual" → upload bukti
☐ Bendahara verifikasi → status berubah verified
☐ Dashboard M1-M24 update sesuai
☐ Progress bar di Beranda update
☐ Pengumuman muncul di Beranda
☐ Subjek doa halaman terpisah jalan
☐ Loker halaman terpisah jalan
☐ WA floating button membuka WhatsApp dengan pesan pre-filled
☐ Jemaat tidak bisa akses /wp-admin/
☐ Sekretariat bisa post content
☐ Bendahara bisa lihat Daftar Pembayaran
☐ Ekspor CSV download dengan data benar
☐ PWA install di Android
☐ PWA install di iOS
☐ Offline cache: matikan internet, buka app, pengumuman terakhir masih muncul
☐ Midtrans sandbox test (jika API key sudah ada)
```

Laporkan hasil ke agent: **"[Scenario X]: PASS / FAIL — [detail]"**

🤖 **AGENT** — Perbaiki bug yang dilaporkan.

---

### Task G2: Deploy to Hostinger

✋ **HUMAN** — Setelah semua test PASS di local:

```
1. Install plugin "All-in-One WP Migration" di local
2. All-in-One WP Migration → Export → Export to File
3. Download file .wpress
4. Hostinger hPanel → WordPress → Add Site (jika belum)
5. Install "All-in-One WP Migration" di WordPress Hostinger
6. Import file .wpress
7. Update Site URL via Settings → General (jika berubah)
8. Test semua flow lagi di production URL
```

---

### Task G3: Go-Live

✋ **HUMAN**:

```
☐ Install Wordfence Security (free) — scan + firewall
☐ Enable daily backups di Hostinger
☐ Enable Cloudflare CDN
☐ Midtrans: switch Sandbox → Production
☐ Ganti password default admin
☐ Post pengumuman "Portal sudah LIVE" ke jemaat
☐ Broadcast WA ke jemaat: link + cara daftar + cara install PWA
```

---

## Timeline Realistis

| Hari | ✋ Human | 🤖 Agent |
|------|---------|----------|
| **1** | Install LocalWP, semua plugin | Tulis semua kode plugin (B1-B4) |
| **2** | Activate plugin, test DB tables | Revisi kode dari feedback human |
| **3** | WooCommerce config (C1) | Revisi kode dari feedback human |
| **4** | UM roles + forms (C2) | Generate instruksi konfigurasi |
| **5** | Core pages + shortcodes (C3) | Debug shortcode jika tidak render |
| **6** | Categories (C4), test flow manual | Perbaiki bug |
| **7** | Elementor Beranda (E1) | Generate CSS tambahan |
| **8** | Elementor pages (E1 lanjutan) | — |
| **9** | CPT Progress (E2), PWA (F1) | — |
| **10** | E2E testing (G1) | Perbaiki bug |
| **11** | E2E testing + Midtrans sandbox | Perbaiki bug |
| **12** | Deploy ke Hostinger staging (G2) | Bantu debug deployment issues |
| **13** | Test di staging | Perbaiki bug |
| **14** | Push production (G3) | — |
| **15** | Monitor, training sekretariat | — |

**2-3 minggu dengan 1 orang + AI.** Midtrans production bisa nyusul di minggu ke-3 atau ke-4 tergantung KYC.

---

*Revisi v2 ini menggantikan plan v1. Perubahan: local-first development, clear AGENT vs HUMAN task separation, 1 person + AI, Midtrans dual-track dengan manual fallback.*
