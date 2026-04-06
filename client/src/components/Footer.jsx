import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='border-t border-gray-200 mt-10'>
      <div className='container px-4 2xl:px-20 mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-4'>

        <div className='flex items-center gap-4'>
        
          <div className="flex items-center gap-2">
            <div className="relative bg-[#1a2e4c] h-7 w-7 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
              <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-[#1a2e4c]"></div>
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              Hire<span className="text-blue-600">Hub</span>
            </span>
          </div>

          <div className='h-5 w-px bg-gray-300'></div>
          
          <p className='text-sm text-gray-500'>
            Copyright © {new Date().getFullYear()} HireHub | All rights reserved.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <a
            href='#'
            aria-label='Facebook'
            className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors'
          >
            <img src={assets.facebook_icon} alt='facebook' className='w-4 h-4' />
          </a>
          <a
            href='#'
            aria-label='Twitter'
            className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors'
          >
            <img src={assets.twitter_icon} alt='twitter' className='w-4 h-4' />
          </a>
          <a
            href='#'
            aria-label='Instagram'
            className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors'
          >
            <img src={assets.instagram_icon} alt='instagram' className='w-4 h-4' />
          </a>
        </div>

      </div>
    </footer>
  )
}

export default Footer