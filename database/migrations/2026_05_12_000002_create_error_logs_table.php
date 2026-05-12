<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('error_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('method', 10)->nullable();
            $table->text('url')->nullable();
            $table->string('route')->nullable();
            $table->integer('status_code')->nullable();
            $table->string('exception_class')->nullable();
            $table->text('message');
            $table->longText('stack_trace')->nullable();
            $table->json('request_data')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('environment', 20)->default('production');
            $table->timestamp('occurred_at')->useCurrent();

            $table->index('status_code');
            $table->index('occurred_at');
            $table->index('route');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('error_logs');
    }
};
