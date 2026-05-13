import { useState, useRef } from 'react'
import api from '../api/axios'

export default function CreatePost({ onPostCreated }) {
    const [body, setBody] = useState('')
    const [visibility, setVisibility] = useState('public')
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const fileRef = useRef()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const removeImage = () => {
        setImage(null)
        setPreview(null)
        if (fileRef.current) fileRef.current.value = ''
    }

    const handleSubmit = async () => {
        if (!body.trim()) {
            setError('Post body is required.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const formData = new FormData()
            formData.append('body', body)
            formData.append('visibility', visibility)
            if (image) formData.append('image', image)

            const { data } = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const newPost = data.post || data.data
            if (newPost) onPostCreated(newPost)

            setBody('')
            setImage(null)
            setPreview(null)
            setVisibility('public')
            if (fileRef.current) fileRef.current.value = ''
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">

            {/* input row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%' }}>
                <img
                    src="/assets/images/comment_img.png"
                    alt=""
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginTop: 4 }}
                />
                <textarea
                    placeholder="Write something ..."
                    value={body}
                    onChange={(e) => { setBody(e.target.value); setError('') }}
                    style={{
                        flex: 1,
                        minHeight: 80,
                        resize: 'none',
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        outline: 'none',
                        boxShadow: 'none',
                        background: '#f9fafb',
                        width: '100%',
                        fontSize: 14,
                        padding: '10px 14px',
                        lineHeight: 1.5,
                        fontFamily: 'inherit',
                    }}
                ></textarea>
            </div>

            {/* image preview */}
            {preview && (
                <div style={{ marginTop: 12, position: 'relative', display: 'inline-block' }}>
                    <img src={preview} alt="preview" style={{ maxHeight: 160, borderRadius: 8, display: 'block' }} />
                    <button
                        type="button"
                        onClick={removeImage}
                        style={{
                            position: 'absolute', top: 4, right: 4,
                            background: 'rgba(0,0,0,0.55)', color: '#fff',
                            border: 'none', borderRadius: '50%',
                            width: 24, height: 24, cursor: 'pointer',
                            lineHeight: '24px', textAlign: 'center', fontSize: 16,
                        }}
                    >×</button>
                </div>
            )}

            {error && (
                <p style={{ color: '#dc3545', fontSize: 13, marginTop: 6, marginBottom: 0 }}>{error}</p>
            )}

            {/* bottom toolbar */}
            <div className="_feed_inner_text_area_bottom" style={{ marginTop: 12 }}>
                <div className="_feed_inner_text_area_item">

                    {/* photo */}
                    <div className="_feed_inner_text_area_bottom_photo _feed_common">
                        <button type="button" className="_feed_inner_text_area_bottom_photo_link" onClick={() => fileRef.current?.click()}>
                            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                                    <path fill="#666" fillRule="evenodd" d="M14.167 1.667H5.833A4.171 4.171 0 001.667 5.833v8.334a4.171 4.171 0 004.166 4.166h8.334a4.171 4.171 0 004.166-4.166V5.833a4.171 4.171 0 00-4.166-4.166zm2.5 12.5c0 .46-.1.897-.27 1.295l-4.314-4.314a2.917 2.917 0 00-4.166 0L4.603 14.47a2.483 2.483 0 01-.27-1.137V5.833c0-1.378 1.122-2.5 2.5-2.5h8.334c1.378 0 2.5 1.122 2.5 2.5v8.334z" clipRule="evenodd" />
                                    <path fill="#666" d="M7.083 8.75a1.667 1.667 0 100-3.333 1.667 1.667 0 000 3.333z" />
                                </svg>
                            </span>
                            Photo
                        </button>
                        <input type="file" ref={fileRef} accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </div>

                    {/* video (dummy) */}
                    <div className="_feed_inner_text_area_bottom_video _feed_common">
                        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
                                    <path fill="#666" d="M14.96 2c3.101 0 5.159 2.417 5.159 5.893v8.214c0 3.476-2.058 5.893-5.16 5.893H6.989c-3.101 0-5.159-2.417-5.159-5.893V7.893C1.83 4.42 3.892 2 6.988 2h7.972zm0 1.395H6.988c-2.37 0-3.883 1.774-3.883 4.498v8.214c0 2.727 1.507 4.498 3.883 4.498h7.972c2.375 0 3.883-1.77 3.883-4.498V7.893c0-2.727-1.508-4.498-3.883-4.498zM7.036 9.63c.323 0 .59.263.633.604l.005.094v6.382c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094v-6.382c0-.385.286-.697.638-.697zm3.97-3.053c.323 0 .59.262.632.603l.006.095v9.435c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094V7.274c0-.386.286-.698.638-.698zm3.905 6.426c.323 0 .59.262.632.603l.006.094v3.01c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094v-3.01c0-.385.286-.697.638-.697z" />
                                </svg>
                            </span>
                            Video
                        </button>
                    </div>

                    {/* event (dummy) */}
                    <div className="_feed_inner_text_area_bottom_event _feed_common">
                        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
                                    <path fill="#666" d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692z" />
                                </svg>
                            </span>
                            Event
                        </button>
                    </div>

                    {/* article (dummy) */}
                    <div className="_feed_inner_text_area_bottom_article _feed_common">
                        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none" viewBox="0 0 18 20">
                                    <path fill="#666" d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056zm-.008 1.457H5.434c-2.244 0-3.381 1.263-3.381 3.752v9.582c0 2.489 1.137 3.752 3.38 3.752h7.049c2.242 0 3.372-1.263 3.372-3.752V5.209c0-2.489-1.13-3.752-3.372-3.752zm-.239 12.053c.36 0 .652.324.652.724 0 .4-.292.724-.652.724H5.656c-.36 0-.652-.324-.652-.724 0-.4.293-.724.652-.724h6.587zm0-4.239a.643.643 0 01.632.339.806.806 0 010 .78.643.643 0 01-.632.339H5.656c-.334-.042-.587-.355-.587-.729s.253-.688.587-.729h6.587zM8.17 5.042c.335.041.588.355.588.729 0 .373-.253.687-.588.728H5.665c-.336-.041-.589-.355-.589-.728 0-.374.253-.688.589-.729H8.17z" />
                                </svg>
                            </span>
                            Article
                        </button>
                    </div>

                    {/* visibility */}
                    <div className="_feed_common" style={{ display: 'flex', alignItems: 'center' }}>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#666', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                </div>

                {/* post button */}
                <div className="_feed_inner_text_area_btn">
                    <button type="button" className="_feed_inner_text_area_btn_link" onClick={handleSubmit} disabled={loading}>
                        <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
                            <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88z" clipRule="evenodd" />
                        </svg>
                        <span>{loading ? 'Posting...' : 'Post'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}