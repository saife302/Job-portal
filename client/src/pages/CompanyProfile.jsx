import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const CompanyProfile = () => {
  const { backendUrl, companyToken, companyData, setCompanyData } = useContext(AppContext)

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [logo, setLogo] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (companyData) {
      setName(companyData.name || '')
      setPreview(companyData.image || '')
    }
  }, [companyData])

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) { setLogo(file); setPreview(URL.createObjectURL(file)) }
  }

  const updateProfile = async () => {
    if (!name.trim()) return toast.error('Company name required')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      if (logo) formData.append('image', logo)
      const { data } = await axios.post(`${backendUrl}/api/company/update-profile`, formData, {
        headers: { Authorization: `Bearer ${companyToken}` }
      })
      if (data.success) {
        setCompanyData(data.company)
        toast.success('Profile updated')
        setIsEditing(false)
      }
    } catch (err) {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-5'>

    
      <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
        <div className='h-28 bg-[#1e2939]'></div>

        <div className='px-6 pb-6'>
          <div className='flex justify-between items-start -mt-10 flex-wrap gap-3'>

        
            <label className={isEditing ? 'cursor-pointer' : ''}>
              <img
                src={preview || 'https://via.placeholder.com/80'}
                className='w-20 h-20 rounded-full border-4 border-white shadow-md object-cover bg-white'
              />
              {isEditing && <input type='file' hidden onChange={handleFile} />}
              {isEditing && <span className='block text-xs text-center text-blue-500 mt-1'>Change logo</span>}
            </label>

         
            <div className='flex gap-2 mt-12'>
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)}
                    className='px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors'>
                    Cancel
                  </button>
                  <button onClick={updateProfile}
                    className='px-4 py-2 text-sm bg-[#1e3a5f] hover:bg-[#16304f] text-white rounded-xl transition-colors flex items-center gap-2'>
                    {loading && <span className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)}
                  className='px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5'>
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>

       
          <div className='mt-4'>
            {isEditing ? (
              <input
                className='text-xl font-bold border border-gray-200 bg-slate-50 rounded-xl px-3 py-1.5 outline-none w-full max-w-xs mb-1'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <h3 className='text-xl font-bold text-gray-900'>{companyData?.name}</h3>
            )}
            <p className='text-sm text-gray-400 flex items-center gap-1.5 mt-1'>
              <span></span> {companyData?.email}
            </p>
            <span className='inline-block mt-2 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full'>
              ✔ Verified
            </span>
          </div>
        </div>
      </div>

    
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>

     
        <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg'>
              💼
            </div>
            <h4 className='font-semibold text-gray-800'>Company Stats</h4>
          </div>
          <div className='space-y-3'>
            {[
              { label: 'Jobs Posted', value: companyData?.jobsPosted || 0 },
              { label: 'Total Applicants', value: companyData?.applicants || 0 },
              { label: 'Hired', value: companyData?.hired || 0 },
            ].map(s => (
              <div key={s.label} className='flex items-center justify-between bg-slate-50 border border-gray-100 rounded-xl px-4 py-2.5'>
                <span className='text-sm text-gray-500'>{s.label}</span>
                <span className='text-sm font-bold text-[#1e3a5f]'>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

      
        <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-lg'>
              🏢
            </div>
            <h4 className='font-semibold text-gray-800'>Company Info</h4>
          </div>
          <div className='space-y-4'>
            <div>
              <p className='text-xs text-gray-400 mb-1'>Company Name</p>
              <p className='text-sm font-medium text-gray-700'>{companyData?.name}</p>
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-1'>Email Address</p>
              <p className='text-sm text-gray-500'>{companyData?.email}</p>
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-1'>Account Status</p>
              <span className='inline-block text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full'>
                ✔ Verified Account
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CompanyProfile