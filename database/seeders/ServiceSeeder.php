<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            ['name' => 'DPMPTSP - Pendampingan Layanan Online Single Submission (OSS)'],
            ['name' => 'DISDUKCAPIL - Pembuatan Kartu Tanda Penduduk (KTP)'],
            ['name' => 'DISDUKCAPIL - Pembuatan Identitas Kependudukan Digital (IKD)'],
            ['name' => 'DISDUKCAPIL - Pembuatan Kartu Keluarga (KK)'],
            ['name' => 'DISDUKCAPIL - Pembuatan Kartu Identitas Anak (KIA)'],
            ['name' => 'DISDUKCAPIL - Pembuatan Akta Kelahiran'],
            ['name' => 'DISDUKCAPIL - Pembuatan Akta Kematian'],
            ['name' => 'DISDUKCAPIL - Pembuatan Akta Perkawinan dan Perceraian Nonmuslim'],
            ['name' => 'SAMSAT CORNER - Pembayaran Pajak Kendaraan Bermotor Tahunan'],
            ['name' => 'SIM TROBEK - Perpanjangan Surat Izin Mengemudi (SIM)'],
            ['name' => 'SIM TROBEK - Pergantian SIM Rusak'],
            ['name' => 'KEJAKSAAN NEGERI CIKARANG - Sistem Informasi Konsultasi Hukum Online (Tanya Si Jacksa)'],
            ['name' => 'KEJAKSAAN NEGERI CIKARANG - Pelayanan Penyuluhan dan Layanan Informasi Tentang Kejaksaan Negeri Cikarang'],
            ['name' => 'KEJAKSAAN NEGERI CIKARANG - Pengembalian Tilang'],
            ['name' => 'KEJAKSAAN NEGERI CIKARANG - Penyuluhan Hukum'],
        ];
        foreach ($services as $service) {
            Service::factory()->create($service);
        }
    }
}
