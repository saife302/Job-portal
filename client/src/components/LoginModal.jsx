import { useState, useContext } from "react"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import axios from "axios"
import { toast } from "react-toastify"

function LoginModal({ setShowLogin }) {
  const [state, setState] = useState('Login')
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { setUser, setUserToken, backendUrl } = useContext(AppContext)

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.")
      return
    }
    if (state === 'Register' && !name) {
      toast.error("Please enter your name.")
      return
    }

    setLoading(true)

    try {
      if (state === 'Login') {
     
        const { data } = await axios.post(backendUrl + '/api/auth/login', {
          email,
          password
        })

        if (data.success) {
          setUser(data.user)
          setUserToken(data.token)
          localStorage.setItem('userToken', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          toast.success('Welcome back, ' + data.user.name + '!')
          setShowLogin(false)
        }

      } else {
      
        const { data } = await axios.post(backendUrl + '/api/auth/register', {
          name,
          email,
          password
        })

        if (data.success) {
          setUser(data.user)
          setUserToken(data.token)
          localStorage.setItem('userToken', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          toast.success('Account created successfully!')
          setShowLogin(false)
        }
      }

    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit()
    if (e.key === "Escape") setShowLogin(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
      onClick={() => setShowLogin(false)}
    >
      <div
        className="bg-white rounded-2xl w-[420px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 relative">
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
          >
            <img src={assets.cross_icon} alt="close" className="h-3 w-3 brightness-0 invert" />
          </button>
          <img src={assets.logo} alt="logo" className="h-7 brightness-0 invert mb-3" />
          <h2 className="text-white text-2xl font-semibold">
            {state === 'Login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {state === 'Login' ? 'Sign in to continue your job search' : 'Join thousands of job seekers'}
          </p>
        </div>

        <div className="px-8 py-6">

        
          {state === 'Register' && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-blue-500 transition-colors">
                <img src={assets.person_icon} alt="" className="h-4 w-4 opacity-40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Email address</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-blue-500 transition-colors">
              <img src={assets.email_icon} alt="" className="h-4 w-4 opacity-40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-blue-500 transition-colors">
              <img src={assets.lock_icon} alt="" className="h-4 w-4 opacity-40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors shadow-md shadow-blue-100 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {state === 'Login' ? 'Sign in' : 'Create Account'}
          </button>

          {/* Toggle */}
          <p className="text-center text-sm text-gray-500 mt-4">
            {state === 'Login' ? (
              <>
                Don't have an account?{' '}
                <span
                  onClick={() => setState('Register')}
                  className="text-blue-600 font-medium cursor-pointer hover:underline"
                >
                  Register
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => setState('Login')}
                  className="text-blue-600 font-medium cursor-pointer hover:underline"
                >
                  Sign in
                </span>
              </>
            )}
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginModal