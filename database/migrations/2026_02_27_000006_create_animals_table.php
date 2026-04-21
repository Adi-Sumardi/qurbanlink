<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('animals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignUuid('donor_id')->nullable()->constrained('donors')->nullOnDelete();
            $table->string('type', 20);
            $table->string('breed', 100)->nullable();
            $table->decimal('weight', 6, 2)->nullable();
            $table->string('color', 50)->nullable();
            $table->integer('estimated_portions')->nullable();
            $table->string('status', 20)->default('registered');
            $table->timestamp('slaughtered_at')->nullable();
            $table->string('photo_path', 500)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('tenant_id');
            $table->index('event_id');
            $table->index('donor_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};
