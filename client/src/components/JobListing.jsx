import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'
import JobSkeleton from './JobSkeleton' 

const JobListing = () => {

  const { searchFilter, setSearchFilter, isSearched, jobs, isLoadingJobs } = useContext(AppContext)

  const [showFilter, setShowFilter] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])

  const jobsPerPage = 6

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
    setCurrentPage(1)
  }

  const toggleLocation = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    )
    setCurrentPage(1)
  }

  const removeTitle = () => setSearchFilter(prev => ({ ...prev, title: '' }))
  const removeLocation = () => setSearchFilter(prev => ({ ...prev, location: '' }))

  useEffect(() => {
    let result = jobs

    if (searchFilter.title) {
      const searchTxt = String(searchFilter.title).toLowerCase().trim()
      result = result.filter(job => {
        const jobTitle = job.title ? String(job.title).toLowerCase() : ''
        const jobCategory = job.category ? String(job.category).toLowerCase() : ''
        return jobTitle.includes(searchTxt) || jobCategory.includes(searchTxt)
      })
    }

    if (searchFilter.location) {
      const locSearch = String(searchFilter.location).toLowerCase().trim()
      result = result.filter(job => {
        const jobLoc = job.location ? String(job.location).toLowerCase() : ''
        return jobLoc.includes(locSearch)
      })
    }

    if (selectedCategories.length > 0) {
      result = result.filter(job => selectedCategories.includes(job.category))
    }

    if (selectedLocations.length > 0) {
      result = result.filter(job => selectedLocations.includes(job.location))
    }

    setFilteredJobs(result)
    setCurrentPage(1)
  }, [jobs, searchFilter, selectedCategories, selectedLocations])

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  )

  return (
    <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>

      
      <div className='w-full lg:w-1/4 bg-white px-4'>
        {isSearched && (searchFilter.title || searchFilter.location) && (
          <div className='mb-6'>
            <h3 className='font-medium text-lg mb-3'>Current Search</h3>
            <div className='flex flex-wrap gap-2'>
              {searchFilter.title && (
                <span className='inline-flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded'>
                  {searchFilter.title}
                  <img onClick={removeTitle} src={assets.cross_icon} alt='remove' className='h-3 w-3 cursor-pointer' />
                </span>
              )}
              {searchFilter.location && (
                <span className='inline-flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded'>
                  {searchFilter.location}
                  <img onClick={removeLocation} src={assets.cross_icon} alt='remove' className='h-3 w-3 cursor-pointer' />
                </span>
              )}
            </div>
          </div>
        )}

        <div className='mb-8'>
          <h3 className='font-medium text-base mb-3'>Search by Categories</h3>
          <ul className='space-y-2 text-gray-600'>
            {JobCategories.map((category, index) => (
              <li key={index} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  id={`cat-${index}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className='cursor-pointer'
                />
                <label htmlFor={`cat-${index}`} className='cursor-pointer text-sm'>{category}</label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className='font-medium text-base mb-3'>Search by Location</h3>
          <ul className='space-y-2 text-gray-600'>
            {JobLocations.map((location, index) => (
              <li key={index} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  id={`loc-${index}`}
                  checked={selectedLocations.includes(location)}
                  onChange={() => toggleLocation(location)}
                  className='cursor-pointer'
                />
                <label htmlFor={`loc-${index}`} className='cursor-pointer text-sm'>{location}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>

    
      <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
        <h3 className='font-medium text-3xl py-2' id='job-list'>Latest jobs</h3>
        <p className='mb-6 text-gray-500'>Get your desired job from top companies</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          
          {isLoadingJobs ? (
            Array(6).fill(0).map((_, index) => (
              <JobSkeleton key={index} />
            ))
          ) : paginatedJobs.length > 0 ? (
            paginatedJobs.map((job, index) => (
              <JobCard key={job._id || index} job={job} />
            ))
          ) : (
            <div className='col-span-full flex items-center justify-center h-48 text-gray-400'>
              <p>No jobs found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoadingJobs && filteredJobs.length > jobsPerPage && (
          <div className='flex items-center justify-center gap-2 mt-10'>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='p-2 disabled:opacity-30'
            >
              <img src={assets.left_arrow_icon} alt='prev' className='h-4' />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => { setCurrentPage(page); document.getElementById('job-list')?.scrollIntoView() }}
                className={`w-8 h-8 rounded text-sm transition-colors ${
                  currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='p-2 disabled:opacity-30'
            >
              <img src={assets.right_arrow_icon} alt='next' className='h-4' />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default JobListing