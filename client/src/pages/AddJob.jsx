import React, { useEffect, useRef, useState, useContext } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddJob = () => {

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Bangalore')
  const [category, setCategory] = useState('Programming')
  const [level, setLevel] = useState('Beginner Level')
  const [salary, setSalary] = useState('')
  const [loading, setLoading] = useState(false)

  const { backendUrl, companyToken } = useContext(AppContext)

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ]
        },
        placeholder: 'Write a detailed job description...',
      })
    }
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

   
    const description = quillRef.current.root.innerHTML


    if (!description || quillRef.current.getText().trim().length === 0) {
      toast.error('Please write a job description.')
      return
    }

    if (!salary || salary <= 0) {
      toast.error('Please enter a valid salary.')
      return
    }

    setLoading(true)

    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/post-job',
        { title, description, location, salary: Number(salary), level, category },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      )

      if (data.success) {
        toast.success('Job posted successfully!')
     
        setTitle('')
        setSalary('')
        setCategory('Programming')
        setLocation('Bangalore')
        setLevel('Beginner Level')
        quillRef.current.setText('')
      }

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to post job. Try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-2xl'>

  
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold text-gray-800'>Post a New Job</h2>
        <p className='text-sm text-gray-400 mt-1'>Fill in the details below to publish a job listing</p>
      </div>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-6'>

      
        <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-sm'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Job Title <span className='text-red-400'>*</span>
          </label>
          <input
            type='text'
            placeholder='e.g. Senior React Developer'
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className='w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 transition-colors placeholder-gray-400'
          />
        </div>

   
        <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-sm'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Job Description <span className='text-red-400'>*</span>
          </label>
          <div ref={editorRef} className='min-h-[160px] text-sm text-gray-700' />
        </div>

     
        <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-sm'>
          <p className='text-sm font-medium text-gray-700 mb-4'>Job Details</p>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>

            <div>
              <label className='block text-xs text-gray-500 mb-1.5'>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className='w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 transition-colors bg-white'
              >
                {JobCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-xs text-gray-500 mb-1.5'>Location</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className='w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 transition-colors bg-white'
              >
                {JobLocations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-xs text-gray-500 mb-1.5'>Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className='w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 transition-colors bg-white'
              >
                <option value='Beginner Level'>Beginner Level</option>
                <option value='Intermediate Level'>Intermediate Level</option>
                <option value='Senior Level'>Senior Level</option>
              </select>
            </div>

          </div>
        </div>

    
        <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-sm'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Job Salary <span className='text-gray-400 font-normal'>(per year in USD)</span>
          </label>
          <div className='flex items-center border border-gray-200 rounded-lg px-4 focus-within:border-blue-500 transition-colors w-48'>
            <span className='text-gray-400 text-sm mr-2'>$</span>
            <input
              type='number'
              min={0}
              placeholder='e.g. 75000'
              value={salary}
              onChange={e => setSalary(e.target.value)}
              className='w-full py-2.5 text-sm text-gray-700 outline-none bg-transparent'
            />
          </div>
        </div>

     
        <div>
          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-10 py-3 rounded-xl transition-colors shadow-md shadow-blue-100 text-sm flex items-center gap-2'
          >
            {loading && (
              <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
            )}
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default AddJob