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
            if ($pid) {
                update_option('jit_product_id', $pid);
            }
        }
        return $pid;
    }
}
