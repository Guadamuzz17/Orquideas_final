<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tb_trofeo', function (Blueprint $table) {
            if (!Schema::hasColumn('tb_trofeo', 'tiene_trofeo')) {
                $table->boolean('tiene_trofeo')->default(false)->after('categoria');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_trofeo', function (Blueprint $table) {
            if (Schema::hasColumn('tb_trofeo', 'tiene_trofeo')) {
                $table->dropColumn('tiene_trofeo');
            }
        });
    }
};
