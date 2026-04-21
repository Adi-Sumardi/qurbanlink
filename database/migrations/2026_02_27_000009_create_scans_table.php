<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignUuid('coupon_id')->nullable()->constrained('coupons')->cascadeOnDelete();
            $table->foreignUuid('location_id')->nullable()->constrained('distribution_locations')->nullOnDelete();
            $table->foreignUuid('scanned_by')->constrained('users');
            $table->string('scan_method', 20)->default('qr');
            $table->string('scan_result', 20);
            $table->string('device_info', 255)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamp('scanned_at')->useCurrent();
            $table->timestamp('created_at')->useCurrent();

            $table->index('tenant_id');
            $table->index('event_id');
            $table->index('coupon_id');
            $table->index('scanned_by');
            $table->index(['event_id', 'scanned_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scans');
    }
};
