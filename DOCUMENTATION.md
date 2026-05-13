# BuddyScript — Technical Documentation

## What Was Built

BuddyScript is a social media feed application similar to Facebook. It allows users to register, log in, create posts (with text and images), interact through likes and comments, and control the visibility of their content.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Backend | Laravel 13 (PHP 8.3) | Mature REST framework with built-in auth, validation, file storage, and an expressive ORM |
| Auth | Laravel Sanctum | Lightweight token-based auth purpose-built for SPAs — no session cookie complexity |
| Database | MySQL 8.0 | Relational integrity matters here: users own posts, posts own comments, foreign keys enforce that |
| Frontend | React 18 + Vite | Component model maps naturally to a feed of posts/comments/replies; Vite gives fast HMR in dev |
| Routing | React Router v6 | Client-side navigation with protected and guest route guards |
| HTTP client | Axios | Interceptors let us attach the Bearer token and handle 401s globally in one place |
| Infrastructure | Docker Compose | Reproducible environment across machines; dev and prod configs are separate |

---

## Architecture Decisions

### Token-based authentication (Sanctum)
Sanctum issues a plain-text Bearer token on login. The token is stored in `localStorage` on the frontend and sent via the `Authorization` header on every request. On login, all previous tokens for the user are deleted so only one active session exists at a time. On logout, the current token is deleted server-side.

### Single-page application with protected routes
The React app uses two route guard wrappers:
- `ProtectedRoute` — redirects unauthenticated users to `/login`
- `GuestRoute` — redirects already-authenticated users to `/feed`

A global Axios response interceptor handles token expiry: any `401` from the API clears localStorage and hard-redirects to `/login`.

### Polymorphic likes
Posts, comments, and replies all support likes using a single `likes` table with a polymorphic relationship (`likeable_type` / `likeable_id`). This avoids three separate like tables and keeps the schema clean. A unique constraint on `(user_id, likeable_id, likeable_type)` enforces one like per user per item at the database level, preventing duplicates even under concurrent requests.

### Counter caching
Rather than running `COUNT(*)` queries every time a post is displayed, the `likes_count`, `comments_count`, and `replies_count` are stored as columns and updated atomically using `increment()` / `decrement()`. This trades a small amount of write overhead for much faster reads — critical at scale where the feed is read far more often than it is written.

### Soft deletes
Posts, comments, and replies use Laravel's `SoftDeletes`. Deleted records stay in the database with a `deleted_at` timestamp. This means:
- Counters remain accurate (they are decremented at delete time)
- Related records (e.g. replies on a deleted comment) still resolve their parent via `withTrashed()`
- Data can be recovered if needed

### Lazy-loaded comments and replies on the frontend
Comments and replies are not loaded with the post. They are fetched on demand when the user clicks "Comment" or "View replies". Once loaded, the component keeps them mounted with `display: none` instead of unmounting — this preserves nested reply state (open reply boxes, loaded replies) when the user toggles the section closed and open again.

---

## Database Design

```
users
  id, first_name, last_name, email, password
  index: email (unique)

posts
  id, user_id, body, image, visibility (public|private)
  likes_count, comments_count
  deleted_at
  indexes: (visibility, created_at), (user_id, created_at)

comments
  id, post_id, user_id, body
  likes_count, replies_count
  deleted_at
  index: (post_id, created_at)

replies
  id, comment_id, user_id, body
  likes_count
  deleted_at
  index: (comment_id, created_at)

likes
  id, user_id, likeable_id, likeable_type, created_at
  unique: (user_id, likeable_id, likeable_type)
  index: (likeable_type, likeable_id, created_at)

personal_access_tokens   ← managed by Sanctum
```

Compound indexes on `(foreign_key, created_at)` support the most common query pattern: "give me the latest N records belonging to X", which is what every list endpoint does.

---

## API Design

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

```
POST   /api/user/register          Create account + return token (auto-login)
POST   /api/user/login             Authenticate + return token
POST   /api/user/logout            Revoke current token
GET    /api/user/                  Authenticated user profile

GET    /api/posts                  Paginated feed (public + own private), newest first
POST   /api/posts                  Create post (text + optional image)
GET    /api/posts/{post}           Single post
DELETE /api/posts/{post}           Delete own post

GET    /api/posts/{post}/comments  Paginated comments on a post
POST   /api/posts/{post}/comments  Add a comment
DELETE /api/comments/{comment}     Delete own comment

GET    /api/comments/{comment}/replies   Paginated replies on a comment
POST   /api/comments/{comment}/replies   Add a reply
DELETE /api/replies/{reply}              Delete own reply

POST   /api/posts/{post}/like            Toggle like on post
GET    /api/posts/{post}/likes           Paginated list of users who liked a post

POST   /api/comments/{comment}/like     Toggle like on comment
GET    /api/comments/{comment}/likes    Paginated list of users who liked a comment

POST   /api/replies/{reply}/like        Toggle like on reply
GET    /api/replies/{reply}/likes       Paginated list of users who liked a reply
```

---

## Security Decisions

**Rate limiting on auth endpoints**
Login is limited to 5 requests per minute per IP, registration to 10. This prevents brute-force password attacks. Laravel returns `429 Too Many Requests` when the limit is exceeded.

**Input validation via Form Requests**
Every write endpoint uses a dedicated Form Request class with explicit validation rules. For example:
- Passwords require a minimum of 8 characters and must be confirmed
- Email must be unique in the users table
- Post images are validated for MIME type (`jpg, jpeg, png, webp`) and size (max 2 MB)
- Post body is capped at 5000 characters; comment and reply bodies at 2000

**Ownership checks**
Delete endpoints check that the authenticated user owns the resource before proceeding. Attempting to delete another user's post, comment, or reply returns a `403 Forbidden`.

**Private post enforcement**
Private posts are filtered out of the feed for all users except the author via a query scope (`scopeVisibleTo`). The filter runs at the database level, not in PHP — users never receive private post data they shouldn't see.

**Password hashing**
Passwords are hashed using Laravel's `hashed` cast, which uses `bcrypt` automatically. Plain-text passwords never touch the database.

**XSS prevention**
React escapes all rendered content by default. No `dangerouslySetInnerHTML` is used anywhere in the application.

**SQL injection prevention**
All database interaction goes through Laravel's Eloquent ORM, which uses PDO prepared statements for every query.

---

## Performance Decisions

**`is_liked_by_me` via batch query**
An early approach loaded the entire `likes` relationship for each post to check if the current user liked it. On a post with 100k likes, this would load 100k rows into PHP memory per post. The fix: after paginating posts, one targeted query fetches only the current user's likes for that page of IDs:

```php
$likedIds = Like::where('user_id', $userId)
    ->where('likeable_type', Post::class)
    ->whereIn('likeable_id', $posts->pluck('id'))  // max 10 IDs
    ->pluck('likeable_id')
    ->flip();
```

This is always a single query with at most 10 values in the `IN` clause, regardless of how many likes a post has.

**Pagination throughout**
Every list endpoint paginates its results (posts: 10 per page, comments: 10, replies: 10, likes: 20). The frontend uses infinite scroll for the post feed so users never experience a hard page load.

**Compound database indexes**
Every foreign key + `created_at` pair that appears in a query `ORDER BY` clause has a compound index. This lets MySQL satisfy `WHERE post_id = ? ORDER BY created_at DESC LIMIT 10` entirely from the index without a filesort.

**Unique constraint on likes as a guard**
The database-level unique constraint on `(user_id, likeable_id, likeable_type)` means that even if two concurrent like requests arrive simultaneously, only one will succeed. The application code handles the race condition gracefully — this is defence in depth beyond the application-level check.

---

## Key Features Summary

| Feature | Detail |
|---|---|
| Registration | First name, last name, email, password with confirmation. Auto-logs in after success. |
| Login / Logout | Token-based. Single active session per user (old tokens revoked on login). |
| Create post | Text body + optional image upload. Public or private visibility. |
| Feed | All public posts + own private posts, newest first, infinite scroll. |
| Like / Unlike | Posts, comments, and replies. Toggle endpoint; count updated atomically. |
| Who liked this | Clicking the like count on any post, comment, or reply opens a modal with the paginated list of users. |
| Comments | Threaded under posts. Lazy-loaded. Owner can delete. |
| Replies | Threaded under comments. Lazy-loaded. Owner can delete. |
| Private posts | Visible only to the author in the feed and via direct URL. |
| Image display | Uploaded images are stored on the server's public disk and served via a URL accessor. |
