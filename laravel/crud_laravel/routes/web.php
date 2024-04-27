<?php

use Illuminate\Support\Facades\Route;
use App\http\Controllers\NoteController;

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

Route::get('/index', [NoteController::class,'index'])->name('index');
Route::get('/create', [NoteController::class,'create'])->name('create');
Route::get('/store', [NoteController::class,'store'])->name('store');

Route::get('/edit/{note}', [NoteController::class,'edit'])->name('edit');
Route::put('/update/{note}', [NoteController::class,'update'])->name('update');
Route::get('/show/{note}', [NoteController::class,'show'])->name('show');

Route::delete('destroy/{note}', [NoteController::class,'destroy'])->name('destroy');


// Route::get('/', function () {
//     return view('welcome');
// });
