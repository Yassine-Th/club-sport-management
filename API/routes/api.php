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
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MyClubController;
use App\Http\Controllers\TrophyController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ClothesController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\MatchsController;
use App\Http\Controllers\MyPlayerMatchStatController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\TicketCategoryController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserMatchesController;
use App\Http\Controllers\UserNewsController;
use App\Http\Controllers\UserPlayersController;

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
    Route::apiResource('produits', ProductController::class);
    Route::apiResource("categories", CategoriesController::class);
    Route::apiResource('sizes',SizeController::class);
    Route::apiResource('players', PlayerController::class);
    Route::put('orders/{order}/status', [OrderController::class, 'updateStatus']);

    Route::apiResource(('orders'), OrderController::class);
    Route::get('commandes/{id}', [OrderController::class, 'UserOrders']);

    Route::apiResource('tickets', TicketController::class);
    Route::apiResource('ticket-categories', TicketCategoryController::class);
    Route::apiResource('matches', MatchsController::class);
    Route::get('upcomming-matches', [MatchsController::class, 'UpCommingMatches']);
    Route::get("show-matches", [MatchsController::class, 'showEditMatches']);
});

Route::get('/news', [NewsController::class, 'index']);
Route::post('/news-create', [NewsController::class, 'store']);
Route::delete('/news-delete/{id}', [NewsController::class, 'destroy']);
Route::get('/news/{id}', [NewsController::class, 'edit']);
Route::put('/news/update/{id}', [NewsController::class, 'update']);

Route::get("availableTickets", [TicketController::class, 'availableTickets']);
Route::get("ticket/{id}", [TicketController::class, 'show']);


Route::get('/latest-news', [HomeController::class, 'index_news']);
Route::get('/home', [HomeController::class, 'index']);
Route::get('/news-user', [UserNewsController::class, 'index']);
route::get('/news-user/{id}', [UserNewsController::class, 'show']);

route::post('/comment-add', [CommentController::class, 'store']);
route::get('/comments-by-news/{id}', [CommentController::class, 'index']);
route::delete('/comments-delete/{id}', [CommentController::class, 'destroy']);
Route::put('/comments-edit/{id}', [CommentController::class, 'update']);



Route::get('/players', [PlayerController::class, 'index']);
Route::delete('/player-delete/{id}', [PlayerController::class, 'destroy']);
Route::post('/player-create', [PlayerController::class, 'store']);
Route::get('/player-edit/{id}', [PlayerController::class, 'edit']);
Route::put('/player/update/{id}', [PlayerController::class, 'update']);




Route::get('/myclub', [MyClubController::class, 'index']);
Route::post('/myclub-create', [MyClubController::class, 'store']);
Route::get('/myclub-edit/{id}', [MyClubController::class, 'edit']);
Route::put('/myclub/update/{id}', [MyClubController::class, 'update']);


Route::get('/trophy', [TrophyController::class, 'index']);
Route::post('/trophy-create', [TrophyController::class, 'store']);
Route::get('/trophy-edit/{id}', [TrophyController::class, 'edit']);
Route::put('/trophy/update/{id}', [TrophyController::class, 'update']);
Route::delete('/trophy-delete/{id}', [TrophyController::class, 'destroy']);



Route::get('/clubs', [ClubController::class, 'index']);
Route::post('/clubs-create', [ClubController::class, 'store']);
Route::get('/clubs-edit/{id}', [ClubController::class, 'edit']);
Route::put('/clubs/update/{id}', [ClubController::class, 'update']);
Route::delete('/clubs-delete/{id}', [ClubController::class, 'destroy']);


Route::get('/matches', [MatchsController::class, 'index']);
Route::get('/matches/{id}', [MatchsController::class, 'show']);
Route::post('/matches-create', [MatchsController::class, 'store']);
Route::get('/matches-edit/{id}', [MatchsController::class, 'edit']);
Route::put('/matches/update/{id}', [MatchsController::class, 'update']);
Route::delete('/matches-delete/{id}', [MatchsController::class, 'destroy']);


Route::get('/user-matches', [UserMatchesController::class, 'index']);
Route::get('/user-matches/months', [UserMatchesController::class, 'months']);


Route::post('/statistiques', [MyPlayerMatchStatController::class, 'store']);
Route::get('/matches/{id}/statistique', [MyPlayerMatchStatController::class, 'showStatsForMatch']);
Route::delete('/statistique-delete/{id}', [MyPlayerMatchStatController::class, 'destroy']);

Route::get('/players-user', [UserPlayersController::class, 'index']);
Route::get('/players-user/{id}', [UserPlayersController::class, 'show']);






















