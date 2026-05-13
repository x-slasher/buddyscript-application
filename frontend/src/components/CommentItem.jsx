import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import ReplyItem from './ReplyItem'

function timeAgo(dateStr) {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
}

export default function CommentItem({ comment, onDelete }) {
    const { user } = useAuth()
    const [liked, setLiked] = useState(comment.is_liked_by_me)
    const [likesCount, setLikesCount] = useState(comment.likes_count)
    const [likeLoading, setLikeLoading] = useState(false)
    const [showReplies, setShowReplies] = useState(false)
    const [replies, setReplies] = useState([])
    const [repliesLoaded, setRepliesLoaded] = useState(false)
    const [replyBody, setReplyBody] = useState('')
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyLoading, setReplyLoading] = useState(false)
    const [repliesCount, setRepliesCount] = useState(comment.replies_count)

    const handleLike = async () => {
        if (likeLoading) return
        setLikeLoading(true)
        try {
            const { data } = await api.post(`/comments/${comment.id}/like`)
            setLiked(data.liked)
            setLikesCount(data.likes_count)
        } catch (e) {
            console.error(e)
        } finally {
            setLikeLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Delete this comment?')) return
        try {
            await api.delete(`/comments/${comment.id}`)
            onDelete(comment.id)
        } catch (e) {
            console.error(e)
        }
    }

    const loadReplies = async () => {
        if (repliesLoaded) {
            setShowReplies(!showReplies)
            return
        }
        try {
            const { data } = await api.get(`/comments/${comment.id}/replies`)
            setReplies(data.data)
            setRepliesLoaded(true)
            setShowReplies(true)
        } catch (e) {
            console.error(e)
        }
    }

    const handleReplySubmit = async () => {
        if (!replyBody.trim() || replyLoading) return
        setReplyLoading(true)
        try {
            const { data } = await api.post(`/comments/${comment.id}/replies`, { body: replyBody })
            setReplies([data.reply, ...replies])
            setReplyBody('')
            setShowReplyBox(false)
            setShowReplies(true)
            setRepliesLoaded(true)
            setRepliesCount(c => c + 1)
        } catch (e) {
            console.error(e)
        } finally {
            setReplyLoading(false)
        }
    }

    const handleReplyDelete = (replyId) => {
        setReplies(replies.filter(r => r.id !== replyId))
        setRepliesCount(c => c - 1)
    }

    return (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>

            {/* avatar */}
            <img
                src="/assets/images/txt_img.png"
                alt=""
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginTop: 2 }}
            />

            {/* content */}
            <div style={{ flex: 1 }}>

                {/* comment bubble */}
                <div style={{
                    background: '#f0f2f5',
                    borderRadius: 12,
                    padding: '8px 12px',
                    display: 'inline-block',
                    maxWidth: '100%',
                }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>
                        {comment.user?.full_name || `${comment.user?.first_name} ${comment.user?.last_name}`}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, marginTop: 2 }}>{comment.body}</p>
                </div>

                {/* action row */}
                <div style={{ display: 'flex', gap: 12, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span
                        onClick={handleLike}
                        style={{
                            fontSize: 12,
                            cursor: 'pointer',
                            fontWeight: liked ? 700 : 500,
                            color: liked ? '#1890ff' : '#65676b',
                        }}
                    >
                        Like {likesCount > 0 && `(${likesCount})`}
                    </span>
                    <span
                        onClick={() => setShowReplyBox(!showReplyBox)}
                        style={{ fontSize: 12, cursor: 'pointer', fontWeight: 500, color: '#65676b' }}
                    >
                        Reply
                    </span>
                    {repliesCount > 0 && (
                        <span
                            onClick={loadReplies}
                            style={{ fontSize: 12, cursor: 'pointer', color: '#1890ff', fontWeight: 500 }}
                        >
                            {showReplies ? 'Hide replies' : `View ${repliesCount} ${repliesCount === 1 ? 'reply' : 'replies'}`}
                        </span>
                    )}
                    {user?.id === comment.user?.id && (
                        <span
                            onClick={handleDelete}
                            style={{ fontSize: 12, cursor: 'pointer', color: '#dc3545', fontWeight: 500 }}
                        >
                            Delete
                        </span>
                    )}
                    <span style={{ fontSize: 11, color: '#999' }}>{timeAgo(comment.created_at)}</span>
                </div>

                {/* reply input */}
                {showReplyBox && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                        <img
                            src="/assets/images/comment_img.png"
                            alt=""
                            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleReplySubmit()
                            }}
                            autoFocus
                            style={{
                                flex: 1,
                                border: '1px solid #e5e7eb',
                                borderRadius: 20,
                                padding: '6px 14px',
                                fontSize: 12,
                                outline: 'none',
                                background: '#f9fafb',
                            }}
                        />
                    </div>
                )}

                {/* replies list — display:none keeps ReplyItem mounted so state is preserved */}
                <div style={{ display: repliesLoaded && showReplies ? 'block' : 'none' }}>
                    {replies.map(reply => (
                        <ReplyItem
                            key={reply.id}
                            reply={reply}
                            onDelete={handleReplyDelete}
                        />
                    ))}
                </div>

            </div>
        </div>
    )
}