<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        // ─── Users ────────────────────────────────────────────────────────────

        $users = [];

        for ($i = 0; $i < 10; $i++) {
            $users[] = User::create([
                'first_name' => $faker->firstName(),
                'last_name'  => $faker->lastName(),
                'email'      => $faker->unique()->safeEmail(),
                'password'   => Hash::make('password'),
            ]);
        }

        // ─── Posts ────────────────────────────────────────────────────────────

        $posts = [];

        foreach ($users as $user) {
            $postCount = $faker->numberBetween(2, 5);

            for ($i = 0; $i < $postCount; $i++) {
                $posts[] = Post::create([
                    'user_id'    => $user->id,
                    'body'       => $faker->paragraph(rand(1, 4)),
                    'visibility' => $faker->randomElement(['public', 'public', 'public', 'private']),
                ]);
            }
        }

        // ─── Likes on Posts ───────────────────────────────────────────────────

        foreach ($posts as $post) {
            $likers = $faker->randomElements($users, rand(0, count($users)));

            foreach ($likers as $user) {
                $this->like($user, $post);
            }
        }

        // ─── Comments ─────────────────────────────────────────────────────────

        $comments = [];

        foreach ($posts as $post) {
            if ($post->visibility === 'private') {
                continue;
            }

            $commentCount = $faker->numberBetween(0, 5);

            for ($i = 0; $i < $commentCount; $i++) {
                $commenter  = $faker->randomElement($users);
                $comments[] = $this->comment(
                    $commenter,
                    $post,
                    $faker->sentence(rand(5, 15))
                );
            }
        }

        // ─── Likes on Comments ────────────────────────────────────────────────

        foreach ($comments as $comment) {
            $likers = $faker->randomElements($users, rand(0, 5));

            foreach ($likers as $user) {
                $this->like($user, $comment);
            }
        }

        // ─── Replies ──────────────────────────────────────────────────────────

        $replies = [];

        foreach ($comments as $comment) {
            $replyCount = $faker->numberBetween(0, 4);

            for ($i = 0; $i < $replyCount; $i++) {
                $replier   = $faker->randomElement($users);
                $replies[] = $this->reply(
                    $replier,
                    $comment,
                    $faker->sentence(rand(4, 12))
                );
            }
        }

        // ─── Likes on Replies ─────────────────────────────────────────────────

        foreach ($replies as $reply) {
            $likers = $faker->randomElements($users, rand(0, 4));

            foreach ($likers as $user) {
                $this->like($user, $reply);
            }
        }

        // ─── Output ───────────────────────────────────────────────────────────

        $this->command->newLine();
        $this->command->info('Project seeded successfully.');
        $this->command->newLine();
        $this->command->table(
            ['Name', 'Email', 'Password'],
            array_map(fn ($u) => [
                $u->first_name . ' ' . $u->last_name,
                $u->email,
                'password',
            ], $users)
        );
        $this->command->newLine();
        $this->command->info('Total posts    : ' . count($posts));
        $this->command->info('Total comments : ' . count($comments));
        $this->command->info('Total replies  : ' . count($replies));
        $this->command->newLine();
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function like(User $user, \Illuminate\Database\Eloquent\Model $target): void
    {
        $alreadyLiked = Like::where([
            'user_id'       => $user->id,
            'likeable_id'   => $target->id,
            'likeable_type' => get_class($target),
        ])->exists();

        if ($alreadyLiked) {
            return;
        }

        Like::create([
            'user_id'       => $user->id,
            'likeable_id'   => $target->id,
            'likeable_type' => get_class($target),
        ]);

        $target->increment('likes_count');
    }

    private function comment(User $user, Post $post, string $body): Comment
    {
        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'body'    => $body,
        ]);

        $post->increment('comments_count');

        return $comment;
    }

    private function reply(User $user, Comment $comment, string $body): Reply
    {
        $reply = Reply::create([
            'comment_id' => $comment->id,
            'user_id'    => $user->id,
            'body'       => $body,
        ]);

        $comment->increment('replies_count');

        return $reply;
    }
}
