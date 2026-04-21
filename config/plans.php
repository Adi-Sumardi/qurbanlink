<?php

/*
|--------------------------------------------------------------------------
| Plans Configuration — DEPRECATED
|--------------------------------------------------------------------------
| Paket langganan sekarang dikelola sepenuhnya melalui database (tabel `plans`).
| File ini tidak lagi dipakai oleh aplikasi sejak migrasi ke DB-driven plans.
|
| Untuk mengelola paket: login sebagai Super Admin → menu "Kelola Paket"
| Endpoint admin: GET/POST/PUT/DELETE /api/v1/admin/plans
| Endpoint publik: GET /api/v1/subscriptions/plans
|
| Jalankan seeder jika tabel plans masih kosong:
|   php artisan db:seed --class=PlanSeeder
|--------------------------------------------------------------------------
*/

return [];
