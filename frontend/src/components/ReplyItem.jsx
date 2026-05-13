import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function timeAgo(dateStr) {
    const date = new Date(dateStr.replace(' ', 'T') + 'Z')
    const diff = Math.floor((new Date() - date) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
}

export default function ReplyItem({ reply, onDelete }) {
    const { user } = useAuth()
    const [liked, setLiked] = useState(reply.is_liked_by_me)
    const [likesCount, setLikesCount] = useState(reply.likes_count)
    const [likeLoading, setLikeLoading] = useState(false)

    const handleLike = async () => {
        if (likeLoading) return
        setLikeLoading(true)
        try {
            const { data } = await api.post(`/replies/${reply.id}/like`)
            setLiked(data.liked)
            setLikesCount(data.likes_count)
        } catch (e) {
            console.error(e)
        } finally {
            setLikeLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Delete this reply?')) return
        try {
            await api.delete(`/replies/${reply.id}`)
            onDelete(reply.id)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, marginLeft: 8 }}>

            {/* avatar */}
            <img
                src="/assets/images/txt_img.png"
                alt=""
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginTop: 2 }}
            />

            {/* content */}
            <div style={{ flex: 1 }}>

                {/* reply bubble */}
                <div style={{
                    background: '#f0f2f5',
                    borderRadius: 12,
                    padding: '6px 12px',
                    display: 'inline-block',
                    maxWidth: '100%',
                }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 12 }}>
                        {reply.user?.full_name || `${reply.user?.first_name} ${reply.user?.last_name}`}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, marginTop: 2 }}>{reply.body}</p>
                </div>

                {/* action row */}
                <div style={{ display: 'flex', gap: 12, marginTop: 3, alignItems: 'center' }}>
                    <span
                        onClick={handleLike}
                        style={{
                            fontSize: 11,
                            cursor: 'pointer',
                            fontWeight: liked ? 700 : 500,
                            color: liked ? '#1890ff' : '#65676b',
                        }}
                    >
                        Like {likesCount > 0 && `(${likesCount})`}
                    </span>
                    {user?.id === reply.user?.id && (
                        <span
                            onClick={handleDelete}
                            style={{ fontSize: 11, cursor: 'pointer', color: '#dc3545', fontWeight: 500 }}
                        >
                            Delete
                        </span>
                    )}
                    <span style={{ fontSize: 11, color: '#999' }}>{timeAgo(reply.created_at)}</span>
                </div>
            </div>
        </div>
    )
}