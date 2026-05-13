import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

export default function LikesModal({ isOpen, onClose, endpoint }) {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    const fetchLikes = useCallback(async (page = 1) => {
        setLoading(true)
        try {
            const { data } = await api.get(`${endpoint}?page=${page}`)
            if (page === 1) {
                setUsers(data.data)
            } else {
                setUsers(prev => [...prev, ...data.data])
            }
            setCurrentPage(data.current_page)
            setLastPage(data.last_page)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [endpoint])

    useEffect(() => {
        if (!isOpen) return
        setUsers([])
        setCurrentPage(1)
        setLastPage(1)
        fetchLikes(1)
    }, [isOpen, fetchLikes])

    if (!isOpen) return null

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1050,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#fff', borderRadius: 12, width: '100%', maxWidth: 400,
                    maxHeight: '70vh', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)', margin: '0 16px',
                }}
            >
                {/* header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderBottom: '1px solid #f0f2f5',
                }}>
                    <h6 style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>People who liked this</h6>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 22, color: '#65676b', lineHeight: 1, padding: 0,
                        }}
                    >×</button>
                </div>

                {/* body */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
                    {loading && users.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 32 }}>
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : users.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', padding: '32px 24px', margin: 0, fontSize: 14 }}>
                            No likes yet.
                        </p>
                    ) : (
                        <>
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' }}
                                >
                                    <img
                                        src="/assets/images/profile.png"
                                        alt=""
                                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                                    />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                                            {user.full_name || `${user.first_name} ${user.last_name}`}
                                        </p>
                                        <p style={{ margin: 0, fontSize: 12, color: '#65676b' }}>{user.email}</p>
                                    </div>
                                </div>
                            ))}

                            {currentPage < lastPage && (
                                <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                                    <button
                                        onClick={() => fetchLikes(currentPage + 1)}
                                        disabled={loading}
                                        style={{
                                            border: 'none', background: 'none',
                                            color: '#1890ff', fontSize: 13,
                                            cursor: 'pointer', fontWeight: 500,
                                        }}
                                    >
                                        {loading ? 'Loading...' : 'Load more'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
