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
