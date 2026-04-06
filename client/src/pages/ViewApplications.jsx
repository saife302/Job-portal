import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const ViewApplications = () => {

  const { backendUrl, companyToken } = useContext(AppContext)

  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)

  const [schedulingAppId, setSchedulingAppId] = useState(null)
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)

  const fetchApplicants = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/company/applicants', {
        headers: { Authorization: `Bearer ${companyToken}` }
      })
      if (data.success) {
        setApplicants(data.applications)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load applications.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (applicationId, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/change-status',
        { applicationId, status },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      )

      if (data.success) {
        setApplicants(prev =>
          prev.map(app => app._id === applicationId ? { ...app, status } : app)
        )
        toast.success(`Application ${status}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status.')
    }
  }

  const handleScheduleInterview = async () => {
    if (!interviewDate || !interviewTime) {
      return toast.error("Please select a date and time.")
    }

    if (!schedulingAppId) return;

    setIsScheduling(true)

    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/schedule-interview',
        { applicationId: schedulingAppId, date: interviewDate, time: interviewTime },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      )

      if (data.success) {
        toast.success("Interview scheduled & email sent!")

        setApplicants(prev =>
          prev.map(app =>
            app._id === schedulingAppId
              ? { ...app, status: 'Interview Scheduled' }
              : app
          )
        )

        setSchedulingAppId(null)
        setInterviewDate('')
        setInterviewTime('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule interview.')
    } finally {
      setIsScheduling(false)
    }
  }

  useEffect(() => {
    if (companyToken) fetchApplicants()
  }, [companyToken])

  const statusStyle = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-600'
      case 'Rejected': return 'bg-red-100 text-red-500'
      case 'Interview Scheduled': return 'bg-blue-100 text-blue-600'
      default: return 'bg-gray-100 text-gray-500'
    }
  }

  return (
    <div>

      <div className='mb-6'>
        <h2 className='text-2xl font-semibold text-gray-800'>View Applications</h2>
        <p className='text-sm text-gray-400 mt-1'>
          {applicants.length} candidate{applicants.length !== 1 ? 's' : ''} applied
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-48'>
          <div className='w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin'></div>
        </div>
      ) : applicants.length === 0 ? (
        <div className='bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm'>
          <p className='text-gray-400 text-sm'>No applications received yet.</p>
        </div>
      ) : (
        <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-100'>
                <th className='py-3.5 px-4 text-left font-medium text-gray-500 w-8'>#</th>
                <th className='py-3.5 px-4 text-left font-medium text-gray-500'>Applicant</th>
                <th className='py-3.5 px-4 text-left font-medium text-gray-500 max-sm:hidden'>Job Title</th>
                <th className='py-3.5 px-4 text-left font-medium text-gray-500'>Resume</th>
                <th className='py-3.5 px-4 text-left font-medium text-gray-500'>Status</th>
                <th className='py-3.5 px-4 text-center font-medium text-gray-500 min-w-[140px]'>Action</th>
              </tr>
            </thead>

            <tbody>
              {applicants.map((app, index) => (
                <tr key={app._id} className='border-b border-gray-50 hover:bg-gray-50 transition-colors'>
                  <td className='py-4 px-4 text-gray-400 text-xs'>{index + 1}</td>

                  <td className='py-4 px-4'>
                    <div className='flex items-center gap-3'>
                      <img src={app.userId?.profilePic || assets.profile_img} className='w-9 h-9 rounded-full object-cover border border-gray-100' alt="profile" />
                      <div>
                        <p className='font-medium text-gray-700'>{app.userId?.name}</p>
                        <p className='text-xs text-gray-400'>{app.userId?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className='py-4 px-4 max-sm:hidden'>
                    <p className='text-gray-600'>{app.jobId?.title}</p>
                    <p className='text-xs text-gray-400'>{app.jobId?.level}</p>
                  </td>

                  <td className='py-4 px-4'>
                    {app.userId?.resume ? (
                      <a href={app.userId.resume} target='_blank' rel='noreferrer' className='flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium'>
                        Resume <img src={assets.resume_download_icon} className='h-3.5 w-3.5 opacity-60' alt="download" />
                      </a>
                    ) : <span className='text-xs text-gray-400'>Not uploaded</span>}
                  </td>

                  <td className='py-4 px-4'>
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </td>

                  <td className='py-4 px-4'>
                    {(app.status === 'Pending' || app.status === 'Interview Scheduled') ? (
                      <div className='flex items-center justify-center gap-2'>

                      
                        {app.status === 'Pending' && (
                          <button 
                            onClick={() => setSchedulingAppId(app._id)} 
                            className='flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors'
                            title="Schedule Interview"
                          >
                            📅
                          </button>
                        )}

                    
                        {app.status === 'Interview Scheduled' && (
                          <a 
                            href={`/interview/${app._id}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className='flex items-center justify-center w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors' 
                            title="Join Video Call"
                          >
                            🎥
                          </a>
                        )}

                     
                        <button 
                          onClick={() => updateStatus(app._id, 'Accepted')} 
                          className='flex items-center justify-center w-8 h-8 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-colors'
                          title="Accept"
                        >
                          ✓
                        </button>

                     
                        <button 
                          onClick={() => updateStatus(app._id, 'Rejected')} 
                          className='flex items-center justify-center w-8 h-8 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors'
                          title="Reject"
                        >
                          ✕
                        </button>

                      </div>
                    ) : (
                      <div className='flex justify-center'><span className='text-xs text-gray-300'>—</span></div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

     
      {schedulingAppId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-fadeIn">

            <h3 className="text-xl font-bold text-gray-800 mb-1">Schedule Interview</h3>
            <p className="text-sm text-gray-500 mb-6">Select a date and time for the video call. An email will be sent automatically.</p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input type="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setSchedulingAppId(null)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleScheduleInterview}
                disabled={isScheduling}
                className={`px-5 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                  isScheduling ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isScheduling ? 'Sending Email...' : 'Schedule & Send Email'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default ViewApplications