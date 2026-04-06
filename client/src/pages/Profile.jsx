import React, { useContext, useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user, setUser, logout, userToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  
  const [resumeFile, setResumeFile] = useState(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const resumeInputRef = useRef(null)

  
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [profilePicFile, setProfilePicFile] = useState(null)
  const [profilePicPreview, setProfilePicPreview] = useState(null)
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const profilePicInputRef = useRef(null)


  useEffect(() => {
    if (user) {
      setEditName(user.name || '')
      setProfilePicPreview(user.profilePic || null)
    }
  }, [user])

  const handleResumeUpload = async () => {
    if (!resumeFile) return
    setUploadingResume(true)
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      
      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      
      if (data.success) {
        toast.success('Resume updated successfully!')
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        setResumeFile(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume')
    } finally {
      setUploadingResume(false)
    }
  }

  
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePicFile(file)
      setProfilePicPreview(URL.createObjectURL(file))
    }
  }


  const handleProfileUpdate = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    setUpdatingProfile(true)
    try {
      const formData = new FormData()
      formData.append('name', editName)
      if (profilePicFile) formData.append('profilePic', profilePicFile)

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      
      if (data.success) {
        toast.success('Profile updated successfully!')
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        setIsEditing(false)
        setProfilePicFile(null) 
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setUpdatingProfile(false)
    }
  }

  
  const cancelEdit = () => {
    setIsEditing(false)
    setEditName(user?.name || '')
    setProfilePicPreview(user?.profilePic || null)
    setProfilePicFile(null)
  }

  
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className='min-h-screen flex flex-col bg-[#1e2939]'>
      <Navbar />

      <div className='flex-1 flex justify-center items-start py-10 px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-3xl space-y-8'>

          {/*  PROFILE HEADER CARD */}
          <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative'>
            
            {/* Top Gradient Banner */}
            <div className='h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600' />

            <div className='px-6 sm:px-10 pb-8'>
              <div className='flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-16 mb-6 gap-4'>
                
                {/* Avatar Section */}
                <div className='relative group'>
                  <div className='w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center text-blue-600 text-4xl font-bold overflow-hidden shrink-0 transition-transform duration-300'>
                    {profilePicPreview ? (
                      <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  
                  {isEditing && (
                    <label className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={profilePicInputRef}
                        onChange={handleProfilePicChange} 
                      />
                    </label>
                  )}
                </div>

              
                <div className='flex items-center gap-3 self-start sm:self-end mt-4 sm:mt-0'>
                  {isEditing ? (
                    <>
                      <button onClick={cancelEdit} className='text-sm px-5 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-medium transition-colors'>
                        Cancel
                      </button>
                      <button 
                        onClick={handleProfileUpdate} 
                        disabled={updatingProfile}
                        className='text-sm px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70'
                      >
                        {updatingProfile && <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>}
                        {updatingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className='text-sm px-5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors flex items-center gap-2'
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Edit Profile
                      </button>
                      <button onClick={handleLogout} className='text-sm text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-50 px-5 py-2 rounded-xl font-medium transition-colors'>
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>

              
              <div className='max-w-md'>
                {isEditing ? (
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-1 ml-1'>Full Name</label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800 font-medium'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-400 mb-1 ml-1'>Email (Cannot be changed)</label>
                      <input 
                        type="email" 
                        value={user?.email}
                        disabled
                        className='w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 outline-none cursor-not-allowed'
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className='text-2xl font-bold text-gray-900'>{user?.name}</h2>
                    <p className='text-gray-500 mt-1 flex items-center gap-2'>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {user?.email}
                    </p>
                  </>
                )}
              </div>

            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          
            <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-2.5 bg-blue-50 text-blue-600 rounded-xl'>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>Career Hub</h3>
              </div>
              <p className='text-sm text-gray-500 mb-6'>Track your job applications, view status updates, and manage your job seeking journey.</p>
              <button
                onClick={() => navigate('/applications')}
                className='w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium border border-gray-200 transition-colors flex items-center justify-center gap-2'
              >
                View My Applications
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

           
            <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-2.5 bg-green-50 text-green-600 rounded-xl'>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>Your Resume</h3>
              </div>

              {user?.resume ? (
                <div className='flex items-center justify-between p-4 bg-green-50/50 border border-green-100 rounded-2xl mb-5 transition-all hover:bg-green-50'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0'>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-semibold text-gray-800'>Ready to apply</p>
                      <p className='text-xs text-gray-500 truncate'>Resume uploaded successfully</p>
                    </div>
                  </div>
                  <a
                    href={user.resume}
                    target='_blank'
                    rel='noreferrer'
                    className='text-sm text-green-700 hover:text-green-800 bg-white border border-green-200 px-4 py-1.5 rounded-lg hover:shadow-sm transition-all shrink-0 font-medium'
                  >
                    View
                  </a>
                </div>
              ) : (
                <p className='text-sm text-amber-600 mb-5 bg-amber-50 p-4 rounded-2xl border border-amber-100'>
                  No resume uploaded. You won't be able to apply for jobs until you upload one.
                </p>
              )}

              <div
                onClick={() => resumeInputRef.current?.click()}
                className='border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all'
              >
                <div className='w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3'>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <p className='text-sm text-gray-600 font-medium'>
                  {resumeFile ? resumeFile.name : 'Click to select a new PDF'}
                </p>
                <input
                  ref={resumeInputRef}
                  type='file'
                  accept='.pdf'
                  className='hidden'
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </div>

              {resumeFile && (
                <button
                  onClick={handleResumeUpload}
                  disabled={uploadingResume}
                  className='mt-4 w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-70 flex justify-center items-center gap-2'
                >
                  {uploadingResume && <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>}
                  {uploadingResume ? 'Uploading...' : 'Confirm Upload'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile