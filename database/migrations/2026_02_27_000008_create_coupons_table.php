<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignUuid('recipient_id')->constrained('recipients')->cascadeOnDelete();
            $table->string('coupon_number', 50);
            $table->text('qr_payload');
            $table->string('qr_signature', 128);
            $table->string('status', 20)->default('generated');
            $table->timestamp('generated_at')->useCurrent();
            $table->timestamp('claimed_at')->nullable();
            $table->timestamp('voided_at')->nullable();
            $table->text('void_reason')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'coupon_number']);
            $table->index('event_id');
            $table->index('recipient_id');
            $table->index(['event_id', 'status']);
            $table->index('qr_signature');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
