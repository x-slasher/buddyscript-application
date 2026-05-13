import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import CommentItem from './CommentItem'

function timeAgo(dateStr) {
    const date = new Date(dateStr.replace(' ', 'T') + 'Z')
    const diff = Math.floor((new Date() - date) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
}

export default function PostCard({ post, onDelete }) {
    const { user } = useAuth()
    const [liked, setLiked] = useState(post.is_liked_by_me)
    const [likesCount, setLikesCount] = useState(post.likes_count)
    const [likeLoading, setLikeLoading] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState([])
    const [commentsLoaded, setCommentsLoaded] = useState(false)
    const [commentBody, setCommentBody] = useState('')
    const [commentLoading, setCommentLoading] = useState(false)
    const [commentsCount, setCommentsCount] = useState(post.comments_count)
    const [showDropdown, setShowDropdown] = useState(false)

    const handleLike = async () => {
        if (likeLoading) return
        setLikeLoading(true)
        try {
            const { data } = await api.post(`/posts/${post.id}/like`)
            setLiked(data.liked)
            setLikesCount(data.likes_count)
        } catch (e) {
            console.error(e)
        } finally {
            setLikeLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return
        try {
            await api.delete(`/posts/${post.id}`)
            onDelete(post.id)
        } catch (e) {
            console.error(e)
        }
    }

    const loadComments = async () => {
        if (commentsLoaded) {
            setShowComments(!showComments)
            return
        }
        try {
            const { data } = await api.get(`/posts/${post.id}/comments`)
            setComments(data.data)
            setCommentsLoaded(true)
            setShowComments(true)
        } catch (e) {
            console.error(e)
        }
    }

    const handleCommentSubmit = async () => {
        if (!commentBody.trim() || commentLoading) return
        setCommentLoading(true)
        try {
            const { data } = await api.post(`/posts/${post.id}/comments`, { body: commentBody })
            setComments([data.comment, ...comments])
            setCommentBody('')
            setCommentsCount(c => c + 1)
            setShowComments(true)
            setCommentsLoaded(true)
        } catch (e) {
            console.error(e)
        } finally {
            setCommentLoading(false)
        }
    }

    const handleCommentDelete = (commentId) => {
        setComments(comments.filter(c => c.id !== commentId))
        setCommentsCount(c => c - 1)
    }

    return (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">

                {/* post header */}
                <div className="_feed_inner_timeline_post_top">
                    <div className="_feed_inner_timeline_post_box">
                        <div className="_feed_inner_timeline_post_box_image">
                            <img src="/assets/images/post_img.png" alt="" className="_post_img" />
                        </div>
                        <div className="_feed_inner_timeline_post_box_txt">
                            <h4 className="_feed_inner_timeline_post_box_title">
                                {post.user?.full_name || `${post.user?.first_name} ${post.user?.last_name}`}
                            </h4>
                            <p className="_feed_inner_timeline_post_box_para">
                                {timeAgo(post.created_at)} .{' '}
                                <span style={{ textTransform: 'capitalize' }}>{post.visibility}</span>
                            </p>
                        </div>
                    </div>

                    {/* dropdown */}
                    <div className="_feed_inner_timeline_post_box_dropdown">
                        <div className="_feed_timeline_post_dropdown">
                            <button
                                className="_feed_timeline_post_dropdown_link"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                                </svg>
                            </button>
                        </div>
                        {showDropdown && (
                            <div className="_feed_timeline_dropdown _timeline_dropdown">
                                <ul className="_feed_timeline_dropdown_list">
                                    <li className="_feed_timeline_dropdown_item">
                                        <span
                                            className="_feed_timeline_dropdown_link"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                    <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
                                                </svg>
                                            </span>
                                            Save Post
                                        </span>
                                    </li>
                                    <li className="_feed_timeline_dropdown_item">
                                        <span
                                            className="_feed_timeline_dropdown_link"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                    <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" />
                                                </svg>
                                            </span>
                                            Hide
                                        </span>
                                    </li>
                                    {user?.id === post.user?.id && (
                                        <li className="_feed_timeline_dropdown_item">
                                            <span
                                                className="_feed_timeline_dropdown_link"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => { setShowDropdown(false); handleDelete() }}
                                            >
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5z" />
                                                    </svg>
                                                </span>
                                                Delete Post
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* post body */}
                <h4 className="_feed_inner_timeline_post_title">{post.body}</h4>

                {/* post image */}
                {post.image_url && (
                    <div className="_feed_inner_timeline_image">
                        <img src={post.image_url} alt="" className="_time_img" />
                    </div>
                )}
            </div>

            {/* likes + comments count row */}
            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {likesCount > 0 && (
                        <div style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#1890ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                        </div>
                    )}
                    <span style={{ fontSize: 13, color: '#666' }}>
                        {likesCount > 0 ? likesCount : ''}
                    </span>
                </div>
                <div>
                    <span
                        style={{ fontSize: 13, color: '#666', cursor: 'pointer' }}
                        onClick={loadComments}
                    >
                        {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
                    </span>
                </div>
            </div>

            {/* reaction buttons */}
            <div className="_feed_inner_timeline_reaction">
                <button
                    className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${liked ? '_feed_reaction_active' : ''}`}
                    onClick={handleLike}
                    disabled={likeLoading}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill={liked ? '#1890ff' : 'none'}
                                stroke={liked ? '#1890ff' : 'currentColor'}
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                            {liked ? 'Liked' : 'Like'}
                        </span>
                    </span>
                </button>

                <button
                    className="_feed_inner_timeline_reaction_comment _feed_reaction"
                    onClick={loadComments}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                            </svg>
                            Comment
                        </span>
                    </span>
                </button>

                <button className="_feed_inner_timeline_reaction_share _feed_reaction">
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                            </svg>
                            Share
                        </span>
                    </span>
                </button>
            </div>

            {/* comment input + list */}
            <div style={{ paddingLeft: 24, paddingRight: 24, marginTop: 12 }}>

                {/* comment input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <img
                        src="/assets/images/comment_img.png"
                        alt=""
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommentSubmit()
                        }}
                        style={{
                            flex: 1,
                            border: '1px solid #e5e7eb',
                            borderRadius: 20,
                            padding: '8px 16px',
                            fontSize: 13,
                            outline: 'none',
                            background: '#f9fafb',
                        }}
                    />
                </div>

                {/* comment list — display:none keeps CommentItem mounted so reply state is preserved */}
                <div style={{ display: commentsLoaded && showComments ? 'block' : 'none' }}>
                    {comments.length === 0 ? (
                        <p style={{ fontSize: 13, color: '#888', padding: '4px 0' }}>No comments yet.</p>
                    ) : (
                        comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onDelete={handleCommentDelete}
                            />
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}