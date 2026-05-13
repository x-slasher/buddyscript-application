<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\Likeable;
use App\Models\Reply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReplyLikeController extends Controller
{
    use Likeable;

    public function toggle(Request $request, Reply $reply): JsonResponse
    {
        return $this->handleToggle($request, $reply);
    }

    public function index(Request $request, Reply $reply): JsonResponse
    {
        return $this->handleIndex($reply);
    }
}
