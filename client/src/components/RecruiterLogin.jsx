import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const RecruiterLogin = () => {
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (state === 'Sign Up' && !isTextDataSubmitted) {
      if (!name || !email || !password) {
        toast.error('Please fill in all fields.')
        return
      }
      setIsTextDataSubmitted(true)
      return
    }

    setLoading(true)

    try {
      if (state === 'Login') {
        const { data } = await axios.post(backendUrl + '/api/company/login', {
          email,
          password
        })

        if (data.success) {
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          localStorage.setItem('companyData', JSON.stringify(data.company))
          setShowRecruiterLogin(false)
          toast.success('Welcome back, ' + data.company.name + '!')
          navigate('/dashboard/add-job')
        } else {
          toast.error(data.message)
        }
      } else {
        if (!image) {
          toast.error('Please upload your company logo.')
          setLoading(false)
          return
        }

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('image', image)

        const { data } = await axios.post(backendUrl + '/api/company/register', formData)

        if (data.success) {
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          localStorage.setItem('companyData', JSON.stringify(data.company))
          setShowRecruiterLogin(false)
          toast.success('Company registered successfully!')
          navigate('/dashboard/add-job')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm'
      onClick={() => setShowRecruiterLogin(false)}
    >
      <div
        className='bg-white rounded-2xl w-[420px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='bg-gradient-to-r from-[#1a2e4c] to-blue-700 px-8 py-8 relative'>
          <button
            onClick={() => setShowRecruiterLogin(false)}
            className='absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-all'
          >
            &times;
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="relative bg-white h-9 w-9 rounded-full flex items-center justify-center">
              <span className="text-[#1a2e4c] font-bold text-lg">H</span>
              <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Hire<span className="text-blue-300">Hub</span>
            </span>
          </div>

          <h2 className='text-white text-2xl font-semibold mt-1'>
            {state === 'Login' ? 'Recruiter Login' : 'Recruiter Sign Up'}
          </h2>
          <p className='text-blue-100 text-sm mt-1'>
            {state === 'Login'
              ? 'Welcome back! Please sign in to continue'
              : isTextDataSubmitted
              ? 'Upload your company logo to finish'
              : 'Create your recruiter account'}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className='px-8 py-8'>
          {state === 'Sign Up' && isTextDataSubmitted ? (
            <div className='flex flex-col items-center gap-4 my-6'>
              <label htmlFor='image' className='cursor-pointer group'>
                <div className='w-24 h-24 rounded-full border-2 border-dashed border-blue-300 group-hover:border-blue-500 flex items-center justify-center overflow-hidden bg-blue-50 transition-all'>
                  {imagePreview ? (
                    <img src={imagePreview} alt='preview' className='w-full h-full object-cover' />
                  ) : (
                    <img src={assets.profile_upload_icon} alt='' className='h-8 w-8 opacity-60' />
                  )}
                </div>
                <input id='image' type='file' accept='image/*' hidden onChange={handleImageChange} />
              </label>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-700'>Upload Company Logo</p>
                <p className='text-xs text-gray-400 mt-0.5'>Click the circle to upload</p>
              </div>
            </div>
          ) : (
            <>
              {state !== 'Login' && (
                <div className='mb-4'>
                  <label className='text-sm font-medium text-gray-600 mb-1 block'>Company Name</label>
                  <div className='flex items-center border border-gray-200 rounded-lg focus-within:border-blue-500 transition-colors'>
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder='Your company name'
                      className='w-full px-4 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400 rounded-lg'
                    />
                  </div>
                </div>
              )}

              <div className='mb-4'>
                <label className='text-sm font-medium text-gray-600 mb-1 block'>Email address</label>
                <div className='flex items-center border border-gray-200 rounded-lg focus-within:border-blue-500 transition-colors'>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='you@company.com'
                    className='w-full px-4 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400 rounded-lg'
                    required
                  />
                </div>
              </div>

              <div className='mb-5'>
                <label className='text-sm font-medium text-gray-600 mb-1 block'>Password</label>
                <div className='flex items-center border border-gray-200 rounded-lg focus-within:border-blue-500 transition-colors'>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='••••••••'
                    className='w-full px-4 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400 rounded-lg'
                    required
                  />
                </div>
              </div>

              {state === 'Login' && (
                <p className='text-sm text-blue-600 cursor-pointer hover:underline mb-5 -mt-2'>
                  Forgot password?
                </p>
              )}
            </>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2'
          >
            {loading ? (
              <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
            ) : (state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Create Account' : 'Next')}
          </button>

          <p className='text-center text-sm text-gray-500 mt-6'>
            {state === 'Login' ? (
              <>
                Don't have an account?{' '}
                <span
                  onClick={() => { setState('Sign Up'); setIsTextDataSubmitted(false) }}
                  className='text-blue-600 font-semibold cursor-pointer hover:underline'
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => { setState('Login'); setIsTextDataSubmitted(false) }}
                  className='text-blue-600 font-semibold cursor-pointer hover:underline'
                >
                  Login
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}

export default RecruiterLogin