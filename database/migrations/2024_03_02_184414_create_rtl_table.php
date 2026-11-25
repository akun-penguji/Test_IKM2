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
        Schema::create('rtl', function (Blueprint $table) {
            $table->id();
            $table->string('unsur');
            $table->integer('nilai');
            $table->string('saran')->default('Dipertahankan');
            $table->string('program');
            $table->year('tahun');
            $table->string('pj');
            $table->integer('periodId');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rtl');
    }
};
