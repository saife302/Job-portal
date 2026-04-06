import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile';
import Interview from './pages/Interview';
import CompanyProfile from './pages/CompanyProfile';
import About from './pages/About';

const App = () => {

  const { showRecruiterLogin, companyToken } = useContext(AppContext)

  return (
    <div className='min-h-screen bg-white'>
      
      {showRecruiterLogin && <RecruiterLogin />}
      

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route path='/interview/:id' element={<Interview />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/' element={<Home />} />
        
        <Route path='/about' element={<About />} />
        
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
        
        <Route path='/dashboard' element={<Dashboard />}>
      
          {companyToken && (
            <>
              <Route path='add-job' element={<AddJob />} />
              <Route path='manage-jobs' element={<ManageJobs />} />
              <Route path='view-applications' element={<ViewApplications />} />
              <Route path='company-profile' element={<CompanyProfile />} />
            </>
          )}
        </Route>
      </Routes>
    </div>
  )
}

export default App