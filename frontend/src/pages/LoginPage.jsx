import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            setErrors({ email: ['Email and password are required.'] })
            return
        }

        setLoading(true)
        setErrors({})

        try {
            await login(form.email, form.password)
            window.location.href = '/feed'
        } catch (err) {
            const serverErrors = err.response?.data?.errors
            const serverMessage = err.response?.data?.message

            if (serverErrors) {
                setErrors(serverErrors)
            } else if (serverMessage) {
                setErrors({ email: [serverMessage] })
            } else {
                setErrors({ email: ['Something went wrong. Please try again.'] })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="_social_login_wrapper _layout_main_wrapper">
            <div className="_shape_one">
                <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
            </div>
            <div className="_shape_two">
                <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>
            <div className="_shape_three">
                <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>
            <div className="_social_login_wrap">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="_social_login_left">
                                <div className="_social_login_left_image">
                                    <img src="/assets/images/login.png" alt="Image" className="_left_img" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <div className="_social_login_content">
                                <div className="_social_login_left_logo _mar_b28">
                                    <img src="/assets/images/logo.svg" alt="Image" className="_left_logo" />
                                </div>
                                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                                <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
                                <button type="button" className="_social_login_content_btn _mar_b40">
                                    <img src="/assets/images/google.svg" alt="Image" className="_google_img" />
                                    <span>Or sign-in with google</span>
                                </button>
                                <div className="_social_login_content_bottom_txt _mar_b40">
                                    <span>Or</span>
                                </div>
                                <div className="_social_login_form">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="_social_login_form_input _mar_b14">
                                                <label className="_social_login_label _mar_b8">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    className={`form-control _social_login_input ${errors.email ? 'is-invalid' : ''}`}
                                                />
                                                {errors.email && (
                                                    <div className="invalid-feedback">{errors.email[0]}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-xl-12">
                                            <div className="_social_login_form_input _mar_b14">
                                                <label className="_social_login_label _mar_b8">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    className={`form-control _social_login_input ${errors.password ? 'is-invalid' : ''}`}
                                                />
                                                {errors.password && (
                                                    <div className="invalid-feedback">{errors.password[0]}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {errors.general && (
                                        <div className="col-xl-12">
                                            <div className="alert alert-danger" style={{ fontSize: 13, padding: '8px 12px' }}>
                                                {errors.general[0]}
                                            </div>
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="form-check _social_login_form_check">
                                                <input
                                                    className="form-check-input _social_login_form_check_input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault2"
                                                    defaultChecked
                                                />
                                                <label className="form-check-label _social_login_form_check_label" htmlFor="flexRadioDefault2">
                                                    Remember me
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="_social_login_form_left">
                                                <p className="_social_login_form_left_para">Forgot password?</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="_social_login_form_btn _mar_t40 _mar_b60">
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                    className="_social_login_form_btn_link _btn1"
                                                >
                                                    {loading ? 'Logging in...' : 'Login now'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="_social_login_bottom_txt">
                                            <p className="_social_login_bottom_txt_para">
                                                Dont have an account?{' '}
                                                <Link to="/register">Create New Account</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
