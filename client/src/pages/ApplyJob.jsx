import React, { useEffect, useState, useContext, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import JobCard from '../components/JobCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import moment from 'moment'

const ApplyJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { backendUrl, jobs, userToken, user, userAxios } = useContext(AppContext)

  const [jobData, setJobData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [appliedJobIds, setAppliedJobIds] = useState([])

  const fetchJob = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`)
      if (data.success) setJobData(data.job)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load job.')
    } finally {
      setLoading(false)
    }
  }, [backendUrl, id])

 
  const fetchAppliedJobs = useCallback(async () => {
  
    if (!userToken) {
      setAlreadyApplied(false)
      setAppliedJobIds([])
      return
    }

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/users/applications`,
        userAxios()
      )
      if (data.success) {
        const ids = data.applications.map(app => app.jobId?._id)
        setAppliedJobIds(ids)
     
        setAlreadyApplied(ids.includes(id))
      }
    } catch (error) {
      console.error('Could not fetch applied jobs:', error)
      setAlreadyApplied(false)
    }
  }, [backendUrl, id, userToken, userAxios])

 
  useEffect(() => {
    fetchJob()
    window.scrollTo(0, 0)
  }, [fetchJob])

  useEffect(() => {
    fetchAppliedJobs()
  }, [fetchAppliedJobs, userToken]) 

  // Apply for job
  const handleApply = async () => {
    if (!userToken) {
      toast.error('Please login to apply for this job.')
      return
    }
    if (!user?.resume) {
      navigate('/applications')
      toast.error('Please upload your resume before applying.')
      return
    }

    setApplying(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: id },
        userAxios()
      )
      if (data.success) {
        toast.success('Applied successfully!')
        setAlreadyApplied(true)
        setAppliedJobIds(prev => [...prev, id])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply.')
    } finally {
      setApplying(false)
    }
  }

  const moreJobs = jobs
    .filter(job =>
      job._id !== id &&
      job.companyId?._id === jobData?.companyId?._id &&
      !appliedJobIds.includes(job._id)
    )
    .slice(0, 4)

  if (loading) return <Loading />

  if (!jobData) return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 flex items-center justify-center'>
        <p className='text-gray-400'>Job not found.</p>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <Navbar />

      <div className='flex-1'>
        <div className='container px-4 2xl:px-20 mx-auto py-10'>


          <div className='bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 mb-10 shadow-sm'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>


              <div className='flex gap-5 items-center'>
                <div className='bg-white rounded-2xl border border-gray-200 p-3 shadow-sm shrink-0'>
                  <img
                    src={jobData.companyId?.image}
                    alt={jobData.companyId?.name}
                    className='h-16 w-16 object-contain'
                  />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900 mb-2'>{jobData.title}</h1>
                  <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500'>
                    <span className='flex items-center gap-1.5'>
                      <img src={assets.suitcase_icon} alt='' className='h-4 opacity-60' />
                      {jobData.companyId?.name}
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <img src={assets.location_icon} alt='' className='h-4 opacity-60' />
                      {jobData.location}
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <img src={assets.person_icon} alt='' className='h-4 opacity-60' />
                      {jobData.level}
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <img src={assets.money_icon} alt='' className='h-4 opacity-60' />
                      CTC: {jobData.salary / 1000}k / year
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-start md:items-end gap-3 shrink-0'>
                <button
                  onClick={handleApply}
                  disabled={applying || alreadyApplied}
                  className={`px-10 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm
                    ${alreadyApplied
                      ? 'bg-green-50 text-green-600 cursor-default border border-green-200'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white disabled:opacity-60'
                    }`}
                >
                  {applying && (
                    <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  )}
                  {alreadyApplied ? '✓ Already Applied' : applying ? 'Applying...' : 'Apply Now'}
                </button>
                <p className='text-xs text-gray-400'>
                  Posted {moment(jobData.date).fromNow()}
                </p>
              </div>

            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-12 items-start'>

         
            <div className='w-full lg:w-2/3'>
              <div className='flex items-center gap-3 mb-6'>
                <h2 className='font-bold text-2xl text-gray-800'>Job Description</h2>
                <div className='flex-1 h-px bg-gray-100'></div>
              </div>

              <div
                className='text-gray-600 leading-loose text-sm
                  [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:text-base [&_h2]:mt-8 [&_h2]:mb-3
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2
                  [&_p]:mb-4 [&_p]:leading-relaxed'
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              />

              <button
                onClick={handleApply}
                disabled={applying || alreadyApplied}
                className={`mt-10 px-10 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2
                  ${alreadyApplied
                    ? 'bg-green-50 text-green-600 cursor-default border border-green-200'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white disabled:opacity-60'
                  }`}
              >
                {alreadyApplied ? '✓ Already Applied' : 'Apply Now'}
              </button>
            </div>

           
            <div className='w-full lg:w-1/3'>
              <div className='sticky top-6'>
                <div className='flex items-center gap-3 mb-5'>
                  <h2 className='font-semibold text-base text-gray-800 whitespace-nowrap'>
                    More from {jobData.companyId?.name}
                  </h2>
                  <div className='flex-1 h-px bg-gray-100'></div>
                </div>

                <div className='flex flex-col gap-4'>
                  {moreJobs.length > 0
                    ? moreJobs.map(job => <JobCard key={job._id} job={job} />)
                    : (
                      <div className='bg-gray-50 border border-gray-100 rounded-xl p-6 text-center'>
                        <p className='text-sm text-gray-400'>No other jobs available from this company.</p>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ApplyJob