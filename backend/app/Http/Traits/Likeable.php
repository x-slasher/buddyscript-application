<?php

namespace App\Http\Traits;

use App\Http\Resources\UserResource;
use App\Models\Like;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

trait Likeable
{
    public function handleToggle(Request $request, Model $model): JsonResponse
    {
        $userId = $request->user()->id;

        $existing = Like::where([
            'user_id'       => $userId,
            'likeable_id'   => $model->id,
            'likeable_type' => get_class($model),
        ])->first();

        if ($existing) {
            $existing->delete();
            $model->decrementLikesCount();
            $liked = false;
        } else {
            Like::create([
                'user_id'       => $userId,
                'likeable_id'   => $model->id,
                'likeable_type' => get_class($model),
            ]);
            $model->incrementLikesCount();
            $liked = true;
        }

        return response()->json([
            'liked'       => $liked,
            'likes_count' => $model->fresh()->likes_count,
        ]);
    }

    public function handleIndex(Model $model): JsonResponse
    {
        $likes = Like::where([
            'likeable_id'   => $model->id,
            'likeable_type' => get_class($model),
        ])
            ->with('user')
            ->latest('created_at')
            ->paginate(20);

        return response()->json([
            'data'         => UserResource::collection($likes->pluck('user')),
            'current_page' => $likes->currentPage(),
            'last_page'    => $likes->lastPage(),
            'total'        => $likes->total(),
        ]);
    }
}
