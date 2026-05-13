<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommentLikeController;
use App\Http\Controllers\Api\PostLikeController;
use App\Http\Controllers\Api\ReplyLikeController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ReplyController;


//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');


// public routes
Route::prefix('user')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('login',    [AuthController::class, 'login'])->middleware('throttle:5,1');
});

// protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('user')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('/',      [AuthController::class, 'profile']);
    });

    // posts
    Route::prefix('posts')->group(function () {
        Route::get('/',          [PostController::class, 'index']);
        Route::post('/',         [PostController::class, 'store']);

        Route::prefix('{post}')->group(function () {
            Route::get('/',      [PostController::class, 'show']);
            Route::delete('/',   [PostController::class, 'destroy']);

            // comments on a post
            Route::prefix('comments')->group(function () {
                Route::get('/',  [CommentController::class, 'index']);
                Route::post('/', [CommentController::class, 'store']);
            });

            // likes on a post
            Route::post('like',  [PostLikeController::class, 'toggle']);
            Route::get('likes',  [PostLikeController::class, 'index']);
        });
    });

    // comments
    Route::prefix('comments/{comment}')->group(function () {
        Route::delete('/',       [CommentController::class, 'destroy']);

        // replies on a comment
        Route::prefix('replies')->group(function () {
            Route::get('/',      [ReplyController::class, 'index']);
            Route::post('/',     [ReplyController::class, 'store']);
        });

        // likes on a comment
        Route::post('like',      [CommentLikeController::class, 'toggle']);
        Route::get('likes',      [CommentLikeController::class, 'index']);
    });

    // replies
    Route::prefix('replies/{reply}')->group(function () {
        Route::delete('/',       [ReplyController::class, 'destroy']);

        // likes on a reply
        Route::post('like',      [ReplyLikeController::class, 'toggle']);
        Route::get('likes',      [ReplyLikeController::class, 'index']);
    });


});


