<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\Likeable;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostLikeController extends Controller
{
    use Likeable;

    public function toggle(Request $request, Post $post): JsonResponse
    {
        if ($post->visibility === 'private' && $post->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'This post is private.',
            ], 403);
        }

        return $this->handleToggle($request, $post);
    }

    public function index(Request $request, Post $post): JsonResponse
    {
        if ($post->visibility === 'private' && $post->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'This post is private.',
            ], 403);
        }

        return $this->handleIndex($post);
    }
}
