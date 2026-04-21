<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('snap_token', 255)->nullable()->after('invoice_url');
            $table->string('snap_redirect_url', 500)->nullable()->after('snap_token');
            $table->string('midtrans_order_id', 100)->nullable()->unique()->after('snap_redirect_url');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['snap_token', 'snap_redirect_url', 'midtrans_order_id']);
        });
    }
};
