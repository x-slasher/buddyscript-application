<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['user_id', 'body', 'image', 'visibility'])]
class Post extends Model
{
    use SoftDeletes;

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset("storage/{$this->image}") : null;
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->latest();
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable')->latest('created_at');
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        return $query->where(function (Builder $q) use ($user) {
            $q->where('visibility', 'public')
                ->orWhere(function (Builder $inner) use ($user) {
                    $inner->where('visibility', 'private')
                        ->where('user_id', $user->id);
                });
        });
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

    public function incrementCommentsCount(): void
    {
        $this->increment('comments_count');
    }

    public function decrementCommentsCount(): void
    {
        $this->decrement('comments_count');
    }
}
