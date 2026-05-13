<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
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
            'image_url'      => $this->image_url,
            'visibility'     => $this->visibility,
            'likes_count'    => $this->likes_count,
            'comments_count' => $this->comments_count,
            'is_liked_by_me' => $this->is_liked_by_me ?? false,
            'user'           => new UserResource($this->whenLoaded('user')),
            'created_at'     => $this->created_at->toDateTimeString(),
        ];
    }
}
