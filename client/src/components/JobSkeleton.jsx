import React from 'react'

const JobSkeleton = () => {
  return (
    <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse'>
      <div className='flex items-start justify-between mb-4'>
       
        <div className='w-12 h-12 bg-gray-200 rounded-xl'></div>
        
        <div className='w-20 h-6 bg-gray-100 rounded-full'></div>
      </div>

     
      <div className='h-5 bg-gray-200 rounded-md w-3/4 mb-3'></div>
      
 
      <div className='flex gap-2 mb-6'>
        <div className='w-16 h-5 bg-gray-100 rounded-md'></div>
        <div className='w-16 h-5 bg-gray-100 rounded-md'></div>
      </div>

     
      <div className='space-y-2 mb-6'>
        <div className='h-3 bg-gray-50 rounded w-full'></div>
        <div className='h-3 bg-gray-50 rounded w-5/6'></div>
      </div>

      
      <div className='flex gap-2'>
        <div className='flex-1 h-10 bg-gray-200 rounded-xl'></div>
        <div className='flex-1 h-10 bg-gray-100 rounded-xl'></div>
      </div>
    </div>
  )
}

export default JobSkeleton