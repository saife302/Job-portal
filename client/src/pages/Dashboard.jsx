import React, { useContext, useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Dashboard = () => {

  const navigate = useNavigate()
  const { companyData, companyLogout } = useContext(AppContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    companyLogout()
    setShowDropdown(false)
    navigate('/')
  }

  useEffect(() => {
    if (companyData) {
      navigate('/dashboard/manage-jobs')
    }
  }, [companyData])

  return (
    <div className='min-h-screen bg-gray-50'>


      <div className='bg-white shadow-sm border-b border-gray-100 py-3 px-6 flex justify-between items-center'>

      
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative bg-[#1a2e4c] h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">H</span>
            <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-[#1a2e4c]"></div>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight max-sm:hidden">
            Hire<span className="text-blue-600">Hub</span>
          </span>
        </Link>

        {companyData && (
          <div className='flex items-center gap-4'>
            <p className='text-sm text-gray-600 max-sm:hidden max-w-[220px] truncate'>
              Welcome,{' '}
              <span
                className='font-semibold text-gray-800'
                title={companyData.name}
              >
                {companyData.name}
              </span>
            </p>

            <div className='relative' ref={dropdownRef}>
              <img
                src={companyData.image}
                alt='profile'
                onClick={() => setShowDropdown(prev => !prev)}
                className='w-10 h-10 rounded-full border-2 border-gray-100 cursor-pointer object-cover hover:border-blue-200 transition-all'
              />

              {showDropdown && (
                <div className='absolute right-0 top-12 bg-white border border-gray-100 rounded-xl shadow-lg w-52 py-2 z-50'>
                  <div className='px-4 py-2 border-b border-gray-50'>
                    <p
                      className='text-xs font-semibold text-gray-700 truncate'
                      title={companyData.name}
                    >
                      {companyData.name}
                    </p>
                    <p className='text-xs text-gray-400 truncate'>{companyData.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('/dashboard/company-profile')
                      setShowDropdown(false)
                    }}
                    className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 mt-1'
                  >
                    <svg className='w-4 h-4 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                    Company Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2'
                  >
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

   
      <div className='flex'>

     
        <div className='w-16 sm:w-52 min-h-[calc(100vh-57px)] bg-white border-r border-gray-100 pt-6 flex flex-col gap-1 shrink-0'>

          <NavLink
            to='/dashboard/add-job'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all
              ${isActive
                ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <img src={assets.add_icon} alt='' className='h-5 w-5 shrink-0' />
            <p className='max-sm:hidden'>Add Job</p>
          </NavLink>

          <NavLink
            to='/dashboard/manage-jobs'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all
              ${isActive
                ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <img src={assets.home_icon} alt='' className='h-5 w-5 shrink-0' />
            <p className='max-sm:hidden'>Manage Jobs</p>
          </NavLink>

          <NavLink
            to='/dashboard/view-applications'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all
              ${isActive
                ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <img src={assets.person_tick_icon} alt='' className='h-5 w-5 shrink-0' />
            <p className='max-sm:hidden'>View Applications</p>
          </NavLink>

        </div>

     
        <div className='flex-1 p-6'>
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default Dashboard