import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        try {
            await register(form)
            navigate('/feed')
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors)
            } else if (err.response?.data?.message) {
                setErrors({ email: [err.response.data.message] })
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <section className="_social_registration_wrapper _layout_main_wrapper">
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
            <div className="_social_registration_wrap">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="_social_registration_right">
                                <div className="_social_registration_right_image">
                                    <img src="/assets/images/registration.png" alt="Image" />
                                </div>
                                <div className="_social_registration_right_image_dark">
                                    <img src="/assets/images/registration1.png" alt="Image" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <div className="_social_registration_content">
                                <div className="_social_registration_right_logo _mar_b28">
                                    <img src="/assets/images/logo.svg" alt="Image" className="_right_logo" />
                                </div>
                                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
                                <button type="button" className="_social_registration_content_btn _mar_b40">
                                    <img src="/assets/images/google.svg" alt="Image" className="_google_img" />
                                    <span>Register with google</span>
                                </button>
                                <div className="_social_registration_content_bottom_txt _mar_b40">
                                    <span>Or</span>
                                </div>
                                <div className="_social_registration_form">
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-6 col-md-6">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">First Name</label>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={form.first_name}
                                                    onChange={handleChange}
                                                    className={`form-control _social_registration_input ${errors.first_name ? 'is-invalid' : ''}`}
                                                />
                                                {errors.first_name && (
                                                    <div className="invalid-feedback">{errors.first_name[0]}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={form.last_name}
                                                    onChange={handleChange}
                                                    className={`form-control _social_registration_input ${errors.last_name ? 'is-invalid' : ''}`}
                                                />
                                                {errors.last_name && (
                                                    <div className="invalid-feedback">{errors.last_name[0]}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-xl-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    className={`form-control _social_registration_input ${errors.email ? 'is-invalid' : ''}`}
                                                />
                                                {errors.email && (
                                                    <div className="invalid-feedback">{errors.email[0]}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-xl-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    className={`form-control _social_registration_input ${errors.password ? 'is-invalid' : ''}`}
                                                />
                                                {errors.password && (
                                                    <div className="invalid-feedback">{errors.password[0]}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-xl-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label _mar_b8">Repeat Password</label>
                                                <input
                                                    type="password"
                                                    name="password_confirmation"
                                                    value={form.password_confirmation}
                                                    onChange={handleChange}
                                                    className={`form-control _social_registration_input ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                                />
                                                {errors.password_confirmation && (
                                                    <div className="invalid-feedback">{errors.password_confirmation[0]}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-check _social_registration_form_check">
                                                <input
                                                    className="form-check-input _social_registration_form_check_input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault2"
                                                    defaultChecked
                                                />
                                                <label className="form-check-label _social_registration_form_check_label" htmlFor="flexRadioDefault2">
                                                    I agree to terms & conditions
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                    className="_social_registration_form_btn_link _btn1"
                                                >
                                                    {loading ? 'Creating account...' : 'Register now'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="_social_registration_bottom_txt">
                                            <p className="_social_registration_bottom_txt_para">
                                                Already have an account?{' '}
                                                <Link to="/login">Login</Link>
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
