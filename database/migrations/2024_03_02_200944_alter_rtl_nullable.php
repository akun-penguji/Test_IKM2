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
        Schema::table('rtl', function (Blueprint $table) {
            $table->string('saran')->nullable()->change();
            $table->string('program')->nullable()->change();
            $table->year('tahun')->nullable()->change();
            $table->string('pj')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
