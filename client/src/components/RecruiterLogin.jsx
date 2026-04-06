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
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm'
      onClick={() => setShowRecruiterLogin(false)}
    >
      <div
        className='bg-white rounded-2xl w-[420px] shadow-2xl overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >

     
        <div className='bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 relative'>
          <button
            onClick={() => setShowRecruiterLogin(false)}
            className='absolute top-4 right-4 w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all'
          >
            <img src={assets.cross_icon} alt='close' className='h-3 w-3 brightness-0 invert' />
          </button>
          <img src={assets.logo} alt='logo' className='h-7 brightness-0 invert mb-3' />
          <h2 className='text-white text-2xl font-semibold'>
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

  
        <form onSubmit={onSubmitHandler} className='px-8 py-6'>


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
                  <div className='flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-blue-500 transition-colors'>
                    <img src={assets.person_icon} alt='' className='h-4 w-4 opacity-40' />
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder='Your company name'
                      className='w-full py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400'
                    />
                  </div>
                </div>
              )}

   
              <div className='mb-4'>
                <label className='text-sm font-medium text-gray-600 mb-1 block'>Email address</label>
                <div className='flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-blue-500 transition-colors'>
                  <img src={assets.email_icon} alt='' className='h-4 w-4 opacity-40' />
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='you@company.com'
                    className='w-full py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400'
                    required
                  />
                </div>
              </div>

   
              <div className='mb-5'>
                <label className='text-sm font-medium text-gray-600 mb-1 block'>Password</label>
                <div className='flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-blue-500 transition-colors'>
                  <img src={assets.lock_icon} alt='' className='h-4 w-4 opacity-40' />
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='••••••••'
                    className='w-full py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400'
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
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors shadow-md shadow-blue-100 flex items-center justify-center gap-2'
          >
            {loading && (
              <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
            )}
            {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Create Account' : 'Next'}
          </button>


          <p className='text-center text-sm text-gray-500 mt-4'>
            {state === 'Login' ? (
              <>
                Don't have an account?{' '}
                <span
                  onClick={() => { setState('Sign Up'); setIsTextDataSubmitted(false) }}
                  className='text-blue-600 font-medium cursor-pointer hover:underline'
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => { setState('Login'); setIsTextDataSubmitted(false) }}
                  className='text-blue-600 font-medium cursor-pointer hover:underline'
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