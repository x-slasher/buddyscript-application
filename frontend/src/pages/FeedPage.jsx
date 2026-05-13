import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'

export default function FeedPage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [initialLoad, setInitialLoad] = useState(true)

    const currentPageRef = useRef(1)
    const lastPageRef = useRef(1)
    const loadingRef = useRef(false)
    const scrollContainerRef = useRef(null)

    const fetchPosts = useCallback(async (page = 1) => {
        if (loadingRef.current) return
        loadingRef.current = true
        setLoading(true)
        try {
            const { data } = await api.get(`/posts?page=${page}`)
            if (page === 1) {
                setPosts(data.data)
            } else {
                setPosts(prev => [...prev, ...data.data])
            }
            currentPageRef.current = data.current_page
            lastPageRef.current = data.last_page
        } catch (e) {
            console.error('Failed to fetch posts:', e)
        } finally {
            loadingRef.current = false
            setLoading(false)
            setInitialLoad(false)
        }
    }, [])

    useEffect(() => {
        fetchPosts(1)
    }, [fetchPosts])

    useEffect(() => {
        const el = scrollContainerRef.current
        if (!el) return
        const handleScroll = () => {
            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 300
            if (nearBottom && !loadingRef.current && currentPageRef.current < lastPageRef.current) {
                fetchPosts(currentPageRef.current + 1)
            }
        }
        el.addEventListener('scroll', handleScroll)
        return () => el.removeEventListener('scroll', handleScroll)
    }, [fetchPosts])

    const handlePostCreated = (newPost) => setPosts(prev => [newPost, ...prev])
    const handlePostDelete  = (postId)  => setPosts(prev => prev.filter(p => p.id !== postId))

    return (
        <div className="_layout _layout_main_wrapper">
            <div className="_main_layout">
                <Navbar />
                <div className="_layout_main _padd_t24">
                    <div className="container _custom_container">
                        <div className="_layout_inner_wrap">
                            <div className="row">

                                {/* ── Left Sidebar ─────────────────────────────── */}
                                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                    <div className="_layout_left_sidebar_wrap">

                                        {/* Explore */}
                                        <div className="_layout_left_sidebar_inner">
                                            <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                                                <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
                                                <ul className="_left_inner_area_explore_list">
                                                    <li className="_left_inner_area_explore_item _explore_item">
                                                        <a href="#0" className="_left_inner_area_explore_link">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#666" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 1.395a8.605 8.605 0 100 17.21 8.605 8.605 0 000-17.21zm-1.233 4.65l.104.01c.188.028.443.113.668.203 1.026.398 3.033 1.746 3.8 2.563l.223.239.08.092a1.16 1.16 0 01.025 1.405c-.04.053-.086.105-.19.215l-.269.28c-.812.794-2.57 1.971-3.569 2.391-.277.117-.675.25-.865.253a1.167 1.167 0 01-1.07-.629c-.053-.104-.12-.353-.171-.586l-.051-.262c-.093-.57-.143-1.437-.142-2.347l.001-.288c.01-.858.063-1.64.157-2.147.037-.207.12-.563.167-.678.104-.25.291-.45.523-.575a1.15 1.15 0 01.58-.14z" /></svg>
                                                            Learning
                                                        </a>
                                                        <span className="_left_inner_area_explore_link_txt">New</span>
                                                    </li>
                                                    <li className="_left_inner_area_explore_item">
                                                        <a href="#0" className="_left_inner_area_explore_link">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24"><path fill="#666" d="M14.96 2c3.101 0 5.159 2.417 5.159 5.893v8.214c0 3.476-2.058 5.893-5.16 5.893H6.989c-3.101 0-5.159-2.417-5.159-5.893V7.893C1.83 4.42 3.892 2 6.988 2h7.972zm0 1.395H6.988c-2.37 0-3.883 1.774-3.883 4.498v8.214c0 2.727 1.507 4.498 3.883 4.498h7.972c2.375 0 3.883-1.77 3.883-4.498V7.893c0-2.727-1.508-4.498-3.883-4.498z" /></svg>
                                                            Insights
                                                        </a>
                                                    </li>
                                                    <li className="_left_inner_area_explore_item">
                                                        <a href="#0" className="_left_inner_area_explore_link">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24"><path fill="#666" d="M9.032 14.456l.297.002c4.404.041 6.907 1.03 6.907 3.678 0 2.586-2.383 3.573-6.615 3.654l-.589.005c-4.588 0-7.203-.972-7.203-3.68 0-2.704 2.604-3.659 7.203-3.659zm0 1.5l-.308.002c-3.645.038-5.523.764-5.523 2.157 0 1.44 1.99 2.18 5.831 2.18 3.847 0 5.832-.728 5.832-2.159 0-1.44-1.99-2.18-5.832-2.18zm8.53-8.037c.347 0 .634.282.679.648l.006.102v1.255h1.185c.38 0 .686.336.686.75 0 .38-.258.694-.593.743l-.093.007h-1.185v1.255c0 .414-.307.75-.686.75-.347 0-.634-.282-.68-.648l-.005-.102-.001-1.255h-1.183c-.379 0-.686-.336-.686-.75 0-.38.258-.694.593-.743l.093-.007h1.183V8.669c0-.414.308-.75.686-.75zM9.031 2c2.698 0 4.864 2.369 4.864 5.319 0 2.95-2.166 5.318-4.864 5.318-2.697 0-4.863-2.369-4.863-5.318C4.17 4.368 6.335 2 9.032 2z" /></svg>
                                                            Find friends
                                                        </a>
                                                    </li>
                                                    <li className="_left_inner_area_explore_item">
                                                        <a href="#0" className="_left_inner_area_explore_link">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24"><path fill="#666" d="M13.704 2c2.8 0 4.585 1.435 4.585 4.258V20.33c0 .443-.157.867-.436 1.18-.279.313-.658.489-1.063.489a1.456 1.456 0 01-.708-.203l-5.132-3.134-5.112 3.14c-.615.36-1.361.194-1.829-.405l-.09-.126-.085-.155a1.913 1.913 0 01-.176-.786V6.434C3.658 3.5 5.404 2 8.243 2h5.46z" /></svg>
                                                            Bookmarks
                                                        </a>
                                                    </li>
                                                    <li className="_left_inner_area_explore_item">
                                                        <a href="#0" className="_left_inner_area_explore_link">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                                            Group
                                                        </a>
                                                    </li>
                                                    <li className="_left_inner_area_explore_item _explore_item">
                                                        <a href="#0" className="_left_inner_area_explore_link">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24"><path fill="#666" d="M7.625 2c.315-.015.642.306.645.69.003.309.234.558.515.558h.928c1.317 0 2.402 1.169 2.419 2.616v.24h2.604c2.911-.026 5.255 2.337 5.377 5.414.005.12.006.245.004.368v4.31c.062 3.108-2.21 5.704-5.064 5.773-.117.003-.228 0-.34-.005a199.325 199.325 0 01-7.516 0c-2.816.132-5.238-2.292-5.363-5.411a6.262 6.262 0 01-.004-.371V11.87c-.03-1.497.48-2.931 1.438-4.024.956-1.094 2.245-1.714 3.629-1.746a3.28 3.28 0 01.342.005l3.617-.001v-.231c-.008-.676-.522-1.23-1.147-1.23h-.93c-.973 0-1.774-.866-1.785-1.937-.003-.386.28-.701.631-.705z" /></svg>
                                                            Gaming
                                                        </a>
                                                        <span className="_left_inner_area_explore_link_txt">New</span>
                                                    </li>
                                                    <li className="_left_inner_area_explore_item">
                                                        <a href="#0" className="_left_inner_area_explore_link">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"></path></svg>
                                                            Settings
                                                        </a>
                                                    </li>
                                                    <li className="_left_inner_area_explore_item">
                                                        <a href="#0" className="_left_inner_area_explore_link">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                                            Save post
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Suggested People */}
                                        <div className="_layout_left_sidebar_inner">
                                            <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                                                <div className="_left_inner_area_suggest_content _mar_b24">
                                                    <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
                                                    <span className="_left_inner_area_suggest_content_txt">
                                                        <a className="_left_inner_area_suggest_content_txt_link" href="#0">See All</a>
                                                    </span>
                                                </div>
                                                {[
                                                    { img: 'people1.png', name: 'Steve Jobs',     role: 'CEO of Apple'    },
                                                    { img: 'people2.png', name: 'Ryan Roslansky', role: 'CEO of Linkedin'  },
                                                    { img: 'people3.png', name: 'Dylan Field',    role: 'CEO of Figma'    },
                                                ].map((p, i) => (
                                                    <div className="_left_inner_area_suggest_info" key={i}>
                                                        <div className="_left_inner_area_suggest_info_box">
                                                            <div className="_left_inner_area_suggest_info_image">
                                                                <a href="#0">
                                                                    <img src={`/assets/images/${p.img}`} alt="" className="_info_img" />
                                                                </a>
                                                            </div>
                                                            <div className="_left_inner_area_suggest_info_txt">
                                                                <a href="#0">
                                                                    <h4 className="_left_inner_area_suggest_info_title">{p.name}</h4>
                                                                </a>
                                                                <p className="_left_inner_area_suggest_info_para">{p.role}</p>
                                                            </div>
                                                        </div>
                                                        <div className="_left_inner_area_suggest_info_link">
                                                            <a href="#0" className="_info_link">Connect</a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Events */}
                                        <div className="_layout_left_sidebar_inner">
                                            <div className="_left_inner_area_event _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                                                <div className="_left_inner_event_content">
                                                    <h4 className="_left_inner_event_title _title5">Events</h4>
                                                    <a href="#0" className="_left_inner_event_link">See all</a>
                                                </div>
                                                {[1, 2].map(i => (
                                                    <div className="_left_inner_event_card_link" key={i} style={{ cursor: 'pointer' }}>
                                                        <div className="_left_inner_event_card">
                                                            <div className="_left_inner_event_card_iamge">
                                                                <img src="/assets/images/feed_event1.png" alt="" className="_card_img" />
                                                            </div>
                                                            <div className="_left_inner_event_card_content">
                                                                <div className="_left_inner_card_date">
                                                                    <p className="_left_inner_card_date_para">10</p>
                                                                    <p className="_left_inner_card_date_para1">Jul</p>
                                                                </div>
                                                                <div className="_left_inner_card_txt">
                                                                    <h4 className="_left_inner_event_card_title">No more terrorism no more cry</h4>
                                                                </div>
                                                            </div>
                                                            <hr className="_underline" />
                                                            <div className="_left_inner_event_bottom">
                                                                <p className="_left_iner_event_bottom">17 People Going</p>
                                                                <a href="#0" className="_left_iner_event_bottom_link">Going</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* ── Center Feed ──────────────────────────────── */}
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="_layout_middle_wrap" ref={scrollContainerRef}>
                                        <div className="_layout_middle_inner">

                                            {/* Stories — exact structure from original HTML */}
                                            <div className="_feed_inner_ppl_card _mar_b16">
                                                <div className="_feed_inner_story_arrow">
                                                    <button type="button" className="_feed_inner_story_arrow_btn">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
                                                            <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                                                        <div className="_feed_inner_profile_story _b_radious6">
                                                            <div className="_feed_inner_profile_story_image">
                                                                <img src="/assets/images/card_ppl1.png" alt="" className="_profile_story_img" />
                                                                <div className="_feed_inner_story_txt">
                                                                    <div className="_feed_inner_story_btn">
                                                                        <button className="_feed_inner_story_btn_link">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                                                                                <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                    <p className="_feed_inner_story_para">Your Story</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {[
                                                        { bg: 'card_ppl2.png' },
                                                        { bg: 'card_ppl3.png' },
                                                        { bg: 'card_ppl4.png' },
                                                    ].map((s, i) => (
                                                        <div className={`col-xl-3 col-lg-3 col-md-4 col-sm-4${i === 1 ? ' _custom_mobile_none' : i === 2 ? ' _custom_none' : ' col'}`} key={i}>
                                                            <div className="_feed_inner_public_story _b_radious6">
                                                                <div className="_feed_inner_public_story_image">
                                                                    <img src={`/assets/images/${s.bg}`} alt="" className="_public_story_img" />
                                                                    <div className="_feed_inner_pulic_story_txt">
                                                                        <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                                                    </div>
                                                                    <div className="_feed_inner_public_mini">
                                                                        <img src="/assets/images/mini_pic.png" alt="" className="_public_mini_img" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Create Post */}
                                            <CreatePost onPostCreated={handlePostCreated} />

                                            {/* Feed Posts */}
                                            {initialLoad ? (
                                                <div style={{ textAlign: 'center', padding: 60 }}>
                                                    <div className="spinner-border" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            ) : posts.length === 0 ? (
                                                <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16" style={{ textAlign: 'center', padding: 40 }}>
                                                    <p style={{ color: '#888', margin: 0 }}>No posts yet. Be the first to post!</p>
                                                </div>
                                            ) : (
                                                posts.map(post => (
                                                    <PostCard key={post.id} post={post} onDelete={handlePostDelete} />
                                                ))
                                            )}

                                            {loading && !initialLoad && (
                                                <div style={{ textAlign: 'center', padding: 20 }}>
                                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                                </div>
                                            )}

                                            {!loading && currentPageRef.current >= lastPageRef.current && posts.length > 0 && (
                                                <div style={{ textAlign: 'center', padding: 20, color: '#888', fontSize: 13 }}>
                                                    You have seen all posts
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>

                                {/* ── Right Sidebar ────────────────────────────── */}
                                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                    <div className="_layout_right_sidebar_wrap">

                                        {/* You Might Like */}
                                        <div className="_layout_right_sidebar_inner">
                                            <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                                                <div className="_right_inner_area_info_content _mar_b24">
                                                    <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
                                                    <span className="_right_inner_area_info_content_txt">
                                                        <a className="_right_inner_area_info_content_txt_link" href="#0">See All</a>
                                                    </span>
                                                </div>
                                                <hr className="_underline" />
                                                {[
                                                    { img: 'Avatar.png',      name: 'Radovan SkillArena', role: 'Founder & CEO at Trophy' },
                                                    { img: 'people2.png',     name: 'Ryan Roslansky',     role: 'CEO of Linkedin'        },
                                                    { img: 'people3.png',     name: 'Dylan Field',        role: 'CEO of Figma'           },
                                                ].map((p, i) => (
                                                    <div className="_right_inner_area_info_ppl" key={i}>
                                                        <div className="_right_inner_area_info_box">
                                                            <div className="_right_inner_area_info_box_image">
                                                                <a href="#0">
                                                                    <img src={`/assets/images/${p.img}`} alt="" className="_ppl_img" />
                                                                </a>
                                                            </div>
                                                            <div className="_right_inner_area_info_box_txt">
                                                                <a href="#0">
                                                                    <h4 className="_right_inner_area_info_box_title">{p.name}</h4>
                                                                </a>
                                                                <p className="_right_inner_area_info_box_para">{p.role}</p>
                                                            </div>
                                                        </div>
                                                        <div className="_right_info_btn_grp">
                                                            <button type="button" className="_right_info_btn_link">Ignore</button>
                                                            <button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Your Friends */}
                                        <div className="_layout_right_sidebar_inner">
                                            <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                                                <div className="_feed_top_fixed">
                                                    <div className="_feed_right_inner_area_card_content _mar_b24">
                                                        <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                                                        <span className="_feed_right_inner_area_card_content_txt">
                                                            <a className="_feed_right_inner_area_card_content_txt_link" href="#0">See All</a>
                                                        </span>
                                                    </div>
                                                    <form className="_feed_right_inner_area_card_form" onSubmit={(e) => e.preventDefault()}>
                                                        <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                                                            <circle cx="7" cy="7" r="6" stroke="#666" />
                                                            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                                                        </svg>
                                                        <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="input search text" />
                                                    </form>
                                                </div>
                                                <div className="_feed_bottom_fixed">
                                                    {[
                                                        { img: 'people1.png', name: 'Steve Jobs',     role: 'CEO of Apple',    online: false, time: '5 minute ago' },
                                                        { img: 'people2.png', name: 'Ryan Roslansky', role: 'CEO of Linkedin',  online: true                      },
                                                        { img: 'people3.png', name: 'Dylan Field',    role: 'CEO of Figma',    online: true                      },
                                                        { img: 'people1.png', name: 'Steve Jobs',     role: 'CEO of Apple',    online: false, time: '5 minute ago' },
                                                        { img: 'people2.png', name: 'Ryan Roslansky', role: 'CEO of Linkedin',  online: true                      },
                                                        { img: 'people3.png', name: 'Dylan Field',    role: 'CEO of Figma',    online: true                      },
                                                    ].map((f, i) => (
                                                        <div className={`_feed_right_inner_area_card_ppl${f.online ? '' : ' _feed_right_inner_area_card_ppl_inactive'}`} key={i}>
                                                            <div className="_feed_right_inner_area_card_ppl_box">
                                                                <div className="_feed_right_inner_area_card_ppl_image">
                                                                    <a href="#0">
                                                                        <img src={`/assets/images/${f.img}`} alt="" className="_box_ppl_img" />
                                                                    </a>
                                                                </div>
                                                                <div className="_feed_right_inner_area_card_ppl_txt">
                                                                    <a href="#0">
                                                                        <h4 className="_feed_right_inner_area_card_ppl_title">{f.name}</h4>
                                                                    </a>
                                                                    <p className="_feed_right_inner_area_card_ppl_para">{f.role}</p>
                                                                </div>
                                                            </div>
                                                            <div className="_feed_right_inner_area_card_ppl_side">
                                                                {f.online ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                                                                        <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                                                                    </svg>
                                                                ) : (
                                                                    <span>{f.time}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}