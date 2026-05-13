<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\Likeable;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentLikeController extends Controller
{
    use Likeable;

    public function toggle(Request $request, Comment $comment): JsonResponse
    {
        return $this->handleToggle($request, $comment);
    }

    public function index(Request $request, Comment $comment): JsonResponse
    {
        return $this->handleIndex($comment);
    }
}
