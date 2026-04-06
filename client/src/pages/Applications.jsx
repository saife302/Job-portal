import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import moment from 'moment'

const Applications = () => {
  const { backendUrl, userToken, user, setUser } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(true)

  const fetchApplications = async () => {
    setLoadingApps(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/users/applications', {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      if (data.success) setApplications(data.applications)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load applications.')
    } finally {
      setLoadingApps(false)
    }
  }

  const handleSaveResume = async () => {
    if (!resume) { toast.error('Please select a PDF file first.'); return }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', resume)
      const { data } = await axios.post(backendUrl + '/api/users/update-resume', formData, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      if (data.success) {
        const updatedUser = { ...user, resume: data.user.resume }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        toast.success('Resume uploaded successfully!')
        setIsEdit(false)
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume.')
    } finally {
      setUploading(false)
    }
  }

  const statusStyle = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-green-50 text-green-600 border border-green-200'
      case 'Rejected': return 'bg-red-50 text-red-500 border border-red-200'
      default: return 'bg-blue-50 text-blue-500 border border-blue-200'
    }
  }

  useEffect(() => { if (userToken) fetchApplications() }, [userToken])

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />

      <div className='flex-1 container px-4 2xl:px-20 mx-auto my-10'>

        {/* Resume Section */}
        <div className='bg-[#6e5a5a] rounded-2xl p-6 mb-6 text-white'>
          <h2 className='text-lg font-semibold mb-1'>Your Resume</h2>
          <p className='text-slate-400 text-sm mb-4'>Keep your resume updated to improve your chances</p>

          <div className='flex items-center gap-3 flex-wrap'>
            {isEdit ? (
              <>
                <label className='cursor-pointer'>
                  <div className='flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-colors'>
                    <img src={assets.upload_area} alt='' className='h-4 w-4 invert' />
                    <span>{resume ? resume.name : 'Choose PDF file'}</span>
                  </div>
                  <input type='file' accept='application/pdf' hidden onChange={(e) => setResume(e.target.files[0])} />
                </label>
                <button onClick={handleSaveResume} disabled={uploading}
                  className='bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-sm transition-colors flex items-center gap-2'>
                  {uploading && <span className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>}
                  {uploading ? 'Uploading...' : 'Save'}
                </button>
                <button onClick={() => { setIsEdit(false); setResume(null) }}
                  className='text-slate-400 text-sm hover:text-white transition-colors'>Cancel</button>
              </>
            ) : (
              <>
                {user?.resume ? (
                  <a href={user.resume} target='_blank' rel='noreferrer'
                    className='bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-colors'>
                    View Resume
                  </a>
                ) : (
                  <span className='text-slate-400 text-sm'>No resume uploaded yet</span>
                )}
                <button onClick={() => setIsEdit(true)}
                  className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition-colors'>
                  {user?.resume ? 'Update' : 'Upload'}
                </button>
                {user?.resume && (
                  <a href={user.resume} download target='_blank' rel='noreferrer'
                    className='w-9 h-9 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors'>
                    <img src={assets.resume_download_icon} alt='download' className='w-4 h-4 invert' />
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* Applications Table */}
        <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-100'>
            <h2 className='text-lg font-semibold text-gray-800'>Jobs Applied</h2>
            <p className='text-sm text-gray-400 mt-0.5'>{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
          </div>

          {loadingApps ? (
            <div className='flex justify-center items-center h-40'>
              <div className='w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin'></div>
            </div>
          ) : applications.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-40 text-center px-4'>
              <p className='text-gray-400 text-sm'>You haven't applied to any jobs yet.</p>
              <a href='/' className='mt-2 text-blue-500 text-sm hover:underline'>Browse jobs →</a>
            </div>
          ) : (
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-slate-50 border-b border-gray-100'>
                  <th className='py-3 px-6 text-left font-medium text-gray-500'>Company</th>
                  <th className='py-3 px-4 text-left font-medium text-gray-500'>Job Title</th>
                  <th className='py-3 px-4 text-left font-medium text-gray-500 max-sm:hidden'>Location</th>
                  <th className='py-3 px-4 text-left font-medium text-gray-500 max-sm:hidden'>Applied On</th>
                  <th className='py-3 px-4 text-left font-medium text-gray-500'>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app._id || index} className='border-b border-gray-50 hover:bg-slate-50 transition-colors'>
                    <td className='py-4 px-6'>
                      <div className='flex items-center gap-3'>
                        <img src={app.companyId?.image || assets.company_icon} alt={app.companyId?.name}
                          className='w-9 h-9 rounded-xl object-contain bg-white border border-gray-200 p-1 shadow-sm' />
                        <span className='font-medium text-gray-700'>{app.companyId?.name}</span>
                      </div>
                    </td>
                    <td className='py-4 px-4 text-gray-600'>{app.jobId?.title}</td>
                    <td className='py-4 px-4 text-gray-500 max-sm:hidden'>{app.jobId?.location}</td>
                    <td className='py-4 px-4 text-gray-500 max-sm:hidden'>{moment(app.date).format('MMM D, YYYY')}</td>
                    <td className='py-4 px-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default Applications