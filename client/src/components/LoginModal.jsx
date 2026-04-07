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
    
      const endpoint = state === 'Login' ? '/api/auth/login' : '/api/auth/register'
      const payload = state === 'Login' ? { email, password } : { name, email, password }

      const { data } = await axios.post(backendUrl + endpoint, payload)

      if (data.success) {
        setUser(data.user)
        setUserToken(data.token)
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success(state === 'Login' ? `Welcome back, ${data.user.name}!` : 'Account created successfully!')
        setShowLogin(false)
      } else {
        toast.error(data.message)
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
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm"
      onClick={() => setShowLogin(false)}
    >
      <div
        className="bg-white rounded-2xl w-[420px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >

       
        <div className="bg-gradient-to-r from-[#1a2e4c] to-blue-700 px-8 py-8 relative">
          
          
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-all"
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

          <h2 className="text-white text-2xl font-semibold">
            {state === 'Login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {state === 'Login' ? 'Sign in to continue your job search' : 'Join thousands of job seekers'}
          </p>
        </div>

        <div className="px-8 py-8">

          {state === 'Register' && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-blue-500 transition-colors">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full py-2.5 text-sm outline-none text-gray-700"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Email address</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-blue-500 transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full py-2.5 text-sm outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-blue-500 transition-colors">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 text-sm outline-none text-gray-700"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {state === 'Login' ? 'Sign in' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            {state === 'Login' ? (
              <>
                Don't have an account?{' '}
                <span
                  onClick={() => setState('Register')}
                  className="text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  Register
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => setState('Login')}
                  className="text-blue-600 font-semibold cursor-pointer hover:underline"
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