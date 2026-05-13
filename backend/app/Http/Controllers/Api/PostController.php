<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{

    public function index(Request $request): JsonResponse
    {
        $posts = Post::with('user')
            ->visibleTo($request->user())
            ->latest()
            ->paginate(10);

        $userId = $request->user()->id;

        $likedIds = Like::where('user_id', $userId)
            ->where('likeable_type', Post::class)
            ->whereIn('likeable_id', $posts->pluck('id'))
            ->pluck('likeable_id')
            ->flip();

        $posts->getCollection()->transform(function ($post) use ($likedIds) {
            $post->is_liked_by_me = $likedIds->has($post->id);
            return $post;
        });

        return response()->json([
            'message'      => 'Successfully retrieve posts',
            'data'         => PostResource::collection($posts->getCollection()),
            'current_page' => $posts->currentPage(),
            'last_page'    => $posts->lastPage(),
            'total'        => $posts->total(),
        ]);
    }


    public function store(StorePostRequest $request): JsonResponse
    {
        $data = $request->only(['body', 'visibility']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        $post = $request->user()->posts()->create($data);
        $post->load('user');
        $post->is_liked_by_me = false;

        return response()->json([
            'message' => 'Post created successfully.',
            'data'    => new PostResource($post),
        ], 201);
    }


    public function show(Request $request, Post $post): JsonResponse
    {
        if ($post->visibility === 'private' && $post->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'This post is private.',
            ], 403);
        }

        $post->load('user');
        $post->is_liked_by_me = Like::where('user_id', $request->user()->id)
            ->where('likeable_type', Post::class)
            ->where('likeable_id', $post->id)
            ->exists();

        return response()->json([
            'data' => new PostResource($post),
        ]);
    }


    public function destroy(Request $request, Post $post): JsonResponse
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only delete your own posts.',
            ], 403);
        }

        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully.',
        ]);
    }
}
