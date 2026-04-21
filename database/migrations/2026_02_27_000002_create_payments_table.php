<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('subscription_id')->nullable()->constrained('subscriptions')->nullOnDelete();
            $table->string('payment_type', 50);
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('IDR');
            $table->string('status', 20)->default('pending');
            $table->string('payment_method', 50)->nullable();
            $table->string('moota_mutation_id', 100)->nullable();
            $table->string('moota_bank_id', 100)->nullable();
            $table->decimal('moota_amount', 12, 2)->nullable();
            $table->string('invoice_number', 50)->unique()->nullable();
            $table->string('invoice_url', 500)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->jsonb('metadata')->default('{}');
            $table->timestamps();

            $table->index('tenant_id');
            $table->index('status');
            $table->index('moota_mutation_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
