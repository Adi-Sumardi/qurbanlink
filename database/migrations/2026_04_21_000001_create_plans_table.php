<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100);
            $table->string('slug', 50)->unique();
            $table->unsignedBigInteger('price_monthly')->default(0);
            $table->unsignedBigInteger('price_yearly')->default(0);
            $table->unsignedInteger('coupon_quota')->default(0)->comment('0 = unlimited');
            $table->unsignedSmallInteger('max_events_per_year')->nullable()->comment('null = unlimited');
            $table->unsignedSmallInteger('max_users')->nullable()->comment('null = unlimited');
            $table->unsignedInteger('max_recipients_per_event')->nullable()->comment('null = unlimited');
            $table->json('features')->default('{}');
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
