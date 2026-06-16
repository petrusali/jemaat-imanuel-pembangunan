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
        if (!current_user_can('edit_shop_orders')) {
            wp_die('Unauthorized');
        }
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
