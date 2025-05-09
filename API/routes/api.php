<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ClothesController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserNewsController;

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->name('logout');

    
Route::get('users', [UserController::class, 'index']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('clothes', ClothesController::class)->only(['index', 'show']);




Route::middleware('auth:sanctum')->group(function () {
    // Route::apiResource('products', ProductController::class);
    Route::apiResource('players', PlayerController::class);
});

Route::get('/news', [NewsController::class, 'index']);
Route::post('/news-create', [NewsController::class, 'store']);
Route::delete('/news-delete/{id}', [NewsController::class, 'destroy']);
Route::get('/news/{id}', [NewsController::class, 'edit']);
Route::put('/news/update/{id}', [NewsController::class, 'update']);


Route::get('/latest-news', [HomeController::class, 'index_news']);
Route::get('/news-user', [UserNewsController::class, 'index']);
route::get('/news-user/{id}', [UserNewsController::class, 'show']);
route::post('/comment-add', [CommentController::class, 'store']);
route::get('/comments-by-news/{id}', [CommentController::class, 'index']);
route::delete('/comments-delete/{id}', [CommentController::class, 'destroy']);
Route::put('/comments-edit/{id}', [CommentController::class, 'update']);





