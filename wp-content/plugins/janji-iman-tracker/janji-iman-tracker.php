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
