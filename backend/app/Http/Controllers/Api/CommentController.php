<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, Post $post): JsonResponse
    {
        if ($post->visibility === 'private' && $post->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'This post is private.',
            ], 403);
        }

        $comments = $post->comments()
            ->with(['user', 'likes'])
            ->latest()
            ->paginate(10);

        $userId = $request->user()->id;

        $comments->getCollection()->transform(function ($comment) use ($userId) {
            $comment->is_liked_by_me = $comment->likes->contains('user_id', $userId);
            return $comment;
        });

        return response()->json([
            'message'      => 'Data retrieved successfully.',
            'data'         => CommentResource::collection($comments->getCollection()),
            'current_page' => $comments->currentPage(),
            'last_page'    => $comments->lastPage(),
            'total'        => $comments->total(),
        ]);
    }

    public function store(StoreCommentRequest $request, Post $post): JsonResponse
    {
        if ($post->visibility === 'private' && $post->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'This post is private.',
            ], 403);
        }

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'body'    => $request->body,
        ]);

        $post->incrementCommentsCount();

        $comment->load('user');
        $comment->is_liked_by_me = false;

        return response()->json([
            'message' => 'Comment added successfully.',
            'comment' => new CommentResource($comment),
        ], 201);
    }

    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only delete your own comments.',
            ], 403);
        }

        $comment->post->decrementCommentsCount();
        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully.',
        ]);
    }
}
