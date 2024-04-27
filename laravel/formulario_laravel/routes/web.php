<?php

use Illuminate\Support\Facades\Route;
use App\http\Controllers\UserController;
use App\http\Controllers\RegistrarPersona;
use App\http\Controllers\VotingCenter;
use App\http\Controllers\LiderController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/', [UserController::class, 'index']);

Route::get('/index', [RegistrarPersona::class, 'index'])->name("index");
Route::get('/centros', [VotingCenter::class, 'index'])->name("centros");
Route::get('/lider', [LiderController::class, 'index'])->name("lider");
Route::get('/showPersonas', [RegistrarPersona::class, 'showPersonas'])->name("showPersonas");

Route::get('/create', [RegistrarPersona::class,'create'])->name('create');
Route::post('/store', [RegistrarPersona::class,'store'])->name('store');
Route::get('/edit/{note}', [RegistrarPersona::class,'edit'])->name('edit');
Route::put('/update/{note}', [RegistrarPersona::class,'update'])->name('update');
Route::get('/show/{note}', [RegistrarPersona::class,'show'])->name('show');

Route::delete('/destroy/{note}', [RegistrarPersona::class,'destroy'])->name('destroy');

Route::view('/','menu')->name('menu');




