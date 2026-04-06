import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const ManageJobs = () => {

  const navigate = useNavigate()
  const { backendUrl, companyToken } = useContext(AppContext)

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/company/list-jobs', {
        headers: { Authorization: `Bearer ${companyToken}` }
      })

      if (data.success) {
        setJobs(data.jobsData.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load jobs.')
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async (jobId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/change-visibility',
        { id: jobId },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      )

      if (data.success) {
        setJobs(prev =>
          prev.map(job => job._id === jobId ? { ...job, visible: data.job.visible } : job)
        )
        toast.success(`Job ${data.job.visible ? 'visible' : 'hidden'} successfully`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update visibility.')
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        const { data } = await axios.post(
          backendUrl + '/api/company/delete-job',
          { jobId },
          { headers: { Authorization: `Bearer ${companyToken}` } }
        )

        if (data.success) {
          toast.warn("Job deleted successfully")
          setJobs(prev => prev.filter(job => job._id !== jobId))
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete job.')
      }
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchJobs()
    }
  }, [companyToken])

  const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0)

  return (
    <div>

      
      <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
        <div>
          <h2 className='text-2xl font-semibold text-gray-800'>Manage Jobs</h2>
          <p className='text-sm text-gray-400 mt-1'>
            {jobs.length} jobs posted · {totalApplicants} total applicants
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-blue-100 w-fit'
        >
          <span className='text-lg leading-none'>+</span>
          Add New Job
        </button>
      </div>

     
      {loading ? (
        <div className='flex justify-center items-center h-48'>
          <div className='w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin'></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className='bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm'>
          <p className='text-gray-400 text-sm'>No jobs posted yet.</p>
          <button
            onClick={() => navigate('/dashboard/add-job')}
            className='mt-4 text-blue-600 text-sm hover:underline'
          >
            Post your first job →
          </button>
        </div>
      ) : (
        <>
          
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6'>
            {jobs.slice(0, 4).map((job) => (
              <div key={job._id} className='bg-white border border-gray-100 rounded-xl p-4 shadow-sm'>
                <p className='text-xs text-gray-400 mb-1 truncate'>{job.title}</p>
                <p className='text-2xl font-semibold text-gray-800'>{job.applicants || 0}</p>
                <p className='text-xs text-gray-400 mt-0.5'>applicants</p>
              </div>
            ))}
          </div>

        
          <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-gray-50 border-b border-gray-100'>
                  <th className='py-3.5 px-4 text-left font-medium text-gray-500 w-8'>#</th>
                  <th className='py-3.5 px-4 text-left font-medium text-gray-500'>Job Title</th>
                  <th className='py-3.5 px-4 text-left font-medium text-gray-500 max-sm:hidden'>Date Posted</th>
                  <th className='py-3.5 px-4 text-left font-medium text-gray-500 max-sm:hidden'>Location</th>
                  <th className='py-3.5 px-4 text-center font-medium text-gray-500'>Applicants</th>
                  <th className='py-3.5 px-4 text-center font-medium text-gray-500'>Visible</th>
                  
                  <th className='py-3.5 px-4 pr-12 text-right font-medium text-gray-500 w-24'>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={job._id} className='border-b border-gray-50 hover:bg-gray-50 transition-colors'>

                    <td className='py-4 px-4 text-gray-400 text-xs'>{index + 1}</td>

                    <td className='py-4 px-4'>
                      <p className='font-medium text-gray-700'>{job.title}</p>
                      <p className='text-xs text-gray-400 mt-0.5'>{job.category}</p>
                    </td>

                    <td className='py-4 px-4 text-gray-500 max-sm:hidden'>
                      {moment(job.date).format('MMM D, YYYY')}
                    </td>

                    <td className='py-4 px-4 text-gray-500 max-sm:hidden'>
                      {job.location}
                    </td>

                    <td className='py-4 px-4 text-center'>
                      <span className='bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full'>
                        {job.applicants || 0}
                      </span>
                    </td>

                    <td className='py-4 px-4'>
                      <div className='flex justify-center'>
                        <button
                          onClick={() => toggleVisibility(job._id)}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                            ${job.visible ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                              ${job.visible ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>
                    </td>

                  
                    <td className='py-4 px-4 pr-12 text-right'>
                      <button 
                        onClick={() => handleDeleteJob(job._id)}
                        className='text-gray-400 hover:text-red-500 transition-colors'
                        title="Delete Job"
                      >
                        <svg className='w-5 h-5 inline' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  )
}

export default ManageJobs