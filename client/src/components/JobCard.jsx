import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const JobCard = ({ job }) => {
  const navigate = useNavigate()
  const goToJob = () => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }

  return (
    <div className='bg-slate-50 rounded-2xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-lg transition-all duration-200 flex flex-col justify-between'>
      
      <div>
        
        <div className='flex items-center justify-between mb-4'>
          <img className='h-9 w-9 rounded-lg object-contain border border-gray-100 p-1'
            src={job.companyId?.image || assets.company_icon}
            alt={job.companyId?.name || 'Company'} />
          <span className='text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full'>
            {job.location}
          </span>
        </div>

     
        <h4 className='font-semibold text-gray-900 text-base mb-1'>{job.title}</h4>

      
        <span className='inline-block text-xs text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full mb-3'>
          {job.level}
        </span>

        
        <p className='text-gray-400 text-sm leading-relaxed line-clamp-3'
          dangerouslySetInnerHTML={{ __html: job.description?.slice(0, 150) }} />
      </div>

      <div className='flex gap-2 mt-5'>
        <button onClick={goToJob}
          className='flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors'>
          Apply now
        </button>
        <button onClick={goToJob}
          className='flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm py-2 rounded-lg transition-colors'>
          Learn more
        </button>
      </div>

    </div>
  )
}

export default JobCard