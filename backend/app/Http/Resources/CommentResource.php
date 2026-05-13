<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'body'           => $this->body,
            'likes_count'    => $this->likes_count,
            'replies_count'  => $this->replies_count,
            'is_liked_by_me' => $this->is_liked_by_me ?? false,
            'user'           => new UserResource($this->whenLoaded('user')),
            'created_at'     => $this->created_at->toDateTimeString(),
        ];
    }
}
