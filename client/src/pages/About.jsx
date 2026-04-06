import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  {
    title: 'User & Company Authentication',
    desc: 'Separate login for job seekers and recruiters with secure authentication.',
  },
  {
    title: 'Company Dashboard',
    desc: 'Recruiters can post jobs, view applicants, update status, and manage their profile.',
  },
  {
    title: 'Resume Upload',
    desc: 'Users can upload resumes which are securely stored and attached to applications.',
  },
  {
    title: 'Interview Scheduling',
    desc: 'Recruiters can schedule interviews and candidates receive email notifications.',
  },
]

const About = () => {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />

      <div className='flex-1 container px-4 2xl:px-20 mx-auto my-10'>

       
        <div className='bg-[#2d5282] rounded-2xl p-8 mb-6 text-white'>
          <h1 className='text-2xl md:text-3xl font-bold mb-2'>About HireHub</h1>
          <p className='text-slate-300 text-sm leading-relaxed max-w-2xl'>
            HireHub is a job portal that connects job seekers with companies.
            Users can apply for jobs, and recruiters can manage applications and schedule interviews efficiently.
          </p>
        </div>


        <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-5'>Key Features</h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {features.map(f => (
              <div key={f.title} className='bg-slate-50 border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-200'>
                <p className='text-sm font-semibold text-gray-800 mb-1'>{f.title}</p>
                <p className='text-sm text-gray-500'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default About