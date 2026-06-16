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
