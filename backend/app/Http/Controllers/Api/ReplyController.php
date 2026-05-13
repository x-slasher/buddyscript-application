<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReplyRequest;
use App\Http\Resources\ReplyResource;
use App\Models\Comment;
use App\Models\Reply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReplyController extends Controller
{
    public function index(Request $request, Comment $comment): JsonResponse
    {
        $replies = $comment->replies()
            ->with(['user', 'likes'])
            ->latest()
            ->paginate(10);

        $userId = $request->user()->id;

        $replies->getCollection()->transform(function ($reply) use ($userId) {
            $reply->is_liked_by_me = $reply->likes->contains('user_id', $userId);
            return $reply;
        });

        return response()->json([
            'message'      => 'Data retrieved successfully.',
            'data'         => ReplyResource::collection($replies->getCollection()),
            'current_page' => $replies->currentPage(),
            'last_page'    => $replies->lastPage(),
            'total'        => $replies->total(),
        ]);
    }

    public function store(StoreReplyRequest $request, Comment $comment): JsonResponse
    {
        $reply = $comment->replies()->create([
            'user_id' => $request->user()->id,
            'body'    => $request->body,
        ]);

        $comment->incrementRepliesCount();

        $reply->load('user');
        $reply->is_liked_by_me = false;

        return response()->json([
            'message' => 'Reply added successfully.',
            'reply'   => new ReplyResource($reply),
        ], 201);
    }

    public function destroy(Request $request, Reply $reply): JsonResponse
    {
        if ($reply->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only delete your own replies.',
            ], 403);
        }

        $reply->comment->decrementRepliesCount();
        $reply->delete();

        return response()->json([
            'message' => 'Reply deleted successfully.',
        ]);
    }
}
