<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('settings', function (Blueprint $table) {
            // First, fix any invalid data
            DB::table('settings')->update([
                'scraping' => DB::raw("CASE WHEN scraping NOT IN ('ON', 'OFF') THEN 'OFF' ELSE scraping END"),
                'mode' => DB::raw("CASE WHEN mode NOT IN ('YES', 'NO') THEN 'NO' ELSE mode END"),
                'social' => DB::raw("CASE WHEN social NOT IN ('YES', 'NO') THEN 'YES' ELSE social END"),
                'widget' => DB::raw("CASE WHEN widget NOT IN ('YES', 'NO') THEN 'NO' ELSE widget END"),
                'slidget' => DB::raw("CASE WHEN slidget NOT IN ('YES', 'NO') THEN 'NO' ELSE slidget END"),
                'webring' => DB::raw("CASE WHEN webring NOT IN ('YES', 'NO') THEN 'NO' ELSE webring END"),
                'flysign' => DB::raw("CASE WHEN flysign NOT IN ('YES', 'NO') THEN 'NO' ELSE flysign END"),
            ]);
            
            // Modify columns to proper enum types
            $table->enum('scraping', ['ON', 'OFF'])->default('OFF')->change();
            $table->enum('mode', ['YES', 'NO'])->default('NO')->change();
            $table->enum('social', ['YES', 'NO'])->default('YES')->change();
            $table->enum('widget', ['YES', 'NO'])->default('NO')->change();
            $table->enum('slidget', ['YES', 'NO'])->default('NO')->change();
            $table->enum('webring', ['YES', 'NO'])->default('NO')->change();
            $table->enum('flysign', ['YES', 'NO'])->default('NO')->change();
            
            // Ensure default_coupon_code has proper length
            $table->string('default_coupon_code', 255)->default('#1010')->change();
        });
    }

    public function down()
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->string('scraping')->change();
            $table->string('mode')->change();
            $table->string('social')->change();
            $table->string('widget')->change();
            $table->string('slidget')->change();
            $table->string('webring')->change();
            $table->string('flysign')->change();
            $table->string('default_coupon_code', 255)->change();
        });
    }
};