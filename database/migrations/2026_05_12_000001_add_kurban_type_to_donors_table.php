<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donors', function (Blueprint $table) {
            $table->string('kurban_type', 20)->default('pribadi')->after('submission_status');
            $table->json('participants')->nullable()->after('kurban_type');
        });
    }

    public function down(): void
    {
        Schema::table('donors', function (Blueprint $table) {
            $table->dropColumn(['kurban_type', 'participants']);
        });
    }
};
