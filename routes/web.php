<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/galaxia', function () {
    return Inertia::render('Galaxy');
});

Route::get('/galaxia/system/{systemId}', function ($systemId) {
    return Inertia::render('SolarSystem', [
        'systemId' => $systemId
    ]);
});

Route::get('/galaxia/system/{systemId}/body/{bodyId}', function ($systemId, $bodyId) {
    return Inertia::render('Planet', [
        'systemId' => $systemId,
        'bodyId' => $bodyId
    ]);
});

Route::get('/galaxia/system/{systemId}/body/{bodyId}/sector/{sectorId}', function ($systemId, $bodyId, $sectorId) {
    return Inertia::render('Sector', [
        'systemId' => $systemId,
        'bodyId' => $bodyId,
        'sectorId' => $sectorId
    ]);
});

Route::get('/galaxia/system/{systemId}/body/{bodyId}/sector/{sectorId}/building/{buildingId}', function ($systemId, $bodyId, $sectorId, $buildingId) {
    return Inertia::render('Building', [
        'systemId' => $systemId,
        'bodyId' => $bodyId,
        'sectorId' => $sectorId,
        'buildingId' => $buildingId
    ]);
});

require __DIR__.'/auth.php';
