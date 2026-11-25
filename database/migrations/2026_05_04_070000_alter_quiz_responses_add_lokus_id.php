<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quiz_responses', function (Blueprint $table) {
            $table->foreignId('lokusId')->nullable()->constrained('lokus')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('quiz_responses', function (Blueprint $table) {
            $table->dropForeign(['lokusId']);
            $table->dropColumn('lokusId');
        });
    }
};