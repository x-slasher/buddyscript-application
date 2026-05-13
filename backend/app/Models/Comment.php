<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[Fillable(['post_id', 'user_id', 'body'])]
class Comment extends Model
{
    use SoftDeletes;

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class)->withTrashed();
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Reply::class)->latest();
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable')->latest('created_at');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isLikedBy(User $user): bool
    {
        return $this->likes->contains('user_id', $user->id);
    }

    public function incrementLikesCount(): void
    {
        $this->increment('likes_count');
    }

    public function decrementLikesCount(): void
    {
        $this->decrement('likes_count');
    }

    public function incrementRepliesCount(): void
    {
        $this->increment('replies_count');
    }

    public function decrementRepliesCount(): void
    {
        $this->decrement('replies_count');
    }
}
