import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext)
  const titleRef = useRef(null)
  const locationRef = useRef(null)

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value
    })
    setIsSearched(true)
    setTimeout(() => {
      document.getElementById('job-list')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className='container 2xl:px-20 mx-auto my-10'>

      <div className='bg-[#4e3a3a] text-white py-16 px-6 text-center mx-2 rounded-xl'>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>
          Over 10,000+ jobs to apply
        </h2>
        <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5 text-slate-400'>
          Your Next Big Career Move Starts Right Here  Explore the Best Job Opportunities and Take the First Step Toward Your Future!
        </p>

      
        <div className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl mx-auto'>

          <div className='flex items-center'>
            <img className='h-4 sm:h-5 mx-3' src={assets.search_icon} alt='search' />
            <input
              type='text'
              placeholder='Search for jobs'
              className='max-sm:text-xs p-2 rounded outline-none w-full'
              ref={titleRef}
            />
          </div>

          <div className='h-8 w-px bg-gray-300 mx-1'></div>

          <div className='flex items-center'>
            <img className='h-4 sm:h-5 mx-3' src={assets.location_icon} alt='location' />
            <input
              type='text'
              placeholder='Location'
              className='max-sm:text-xs p-2 rounded outline-none w-full'
              ref={locationRef}
            />
          </div>

          <button
            onClick={onSearch}
            className='bg-blue-600 px-6 py-2 rounded text-white m-1 text-sm'
          >
            Search
          </button>

        </div>
      </div>

      <div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-xl'>
        <div className='flex flex-wrap justify-start items-center gap-6'>
          <p className='font-medium text-sm text-gray-700 mr-2'>Trusted by</p>
          <img className='h-6' src={assets.microsoft_logo} alt='Microsoft' />
          <img className='h-6' src={assets.walmart_logo} alt='Walmart' />
          <img className='h-6' src={assets.accenture_logo} alt='Accenture' />
          <img className='h-6' src={assets.samsung_logo} alt='Samsung' />
          <img className='h-6' src={assets.amazon_logo} alt='Amazon' />
          <img className='h-6' src={assets.adobe_logo} alt='Adobe' />
        </div>
      </div>

    </div>
  )
}

export default Hero