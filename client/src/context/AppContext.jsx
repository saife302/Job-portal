import { createContext, useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext()

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

 
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })
  const [userToken, setUserToken] = useState(() => localStorage.getItem("userToken") || null)


  const [companyData, setCompanyData] = useState(() => {
    const saved = localStorage.getItem("companyData")
    return saved ? JSON.parse(saved) : null
  })
  const [companyToken, setCompanyToken] = useState(() => localStorage.getItem("companyToken") || null)


  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
  const [searchFilter, setSearchFilter] = useState({ title: '', location: '' })
  const [isSearched, setIsSearched] = useState(false)
  const [jobs, setJobs] = useState([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)

  
  const userAxios = () => ({
    headers: { Authorization: `Bearer ${userToken}` }
  })

  const companyAxios = () => ({
    headers: { Authorization: `Bearer ${companyToken}` }
  })

  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/jobs')
      if (data.success) {
        setJobs(data.jobs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load jobs.')
    } finally {
      setIsLoadingJobs(false)
    }
  }, [])


  const fetchCompanyData = useCallback(async () => {
    if (!companyToken) return
    try {
      const { data } = await axios.get(
        backendUrl + '/api/company/company',
        companyAxios()
      )
      if (data.success) {
        setCompanyData(data.company)
        localStorage.setItem("companyData", JSON.stringify(data.company))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch company data.')
    }
  }, [companyToken])


  const loginUser = (userData, token) => {
    setUser(userData)
    setUserToken(token)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("userToken", token)
  }


  const loginCompany = (companyData, token) => {
    setCompanyData(companyData)
    setCompanyToken(token)
    localStorage.setItem("companyData", JSON.stringify(companyData))
    localStorage.setItem("companyToken", token)
  }


  const logout = () => {
    setUser(null)
    setUserToken(null)
    localStorage.removeItem("userToken")
    localStorage.removeItem("user")
  }

 
  const companyLogout = () => {
    setCompanyData(null)
    setCompanyToken(null)
    localStorage.removeItem("companyToken")
    localStorage.removeItem("companyData")
  }


  useEffect(() => { fetchJobs() }, [])
  useEffect(() => { if (companyToken) fetchCompanyData() }, [companyToken])

  const value = {
    backendUrl,
  
    user, setUser,
    userToken, setUserToken,
    loginUser, logout,
    userAxios,
    companyData, setCompanyData,
    companyToken, setCompanyToken,
    loginCompany, companyLogout,
    fetchCompanyData,
    companyAxios,
    // jobs
    jobs, setJobs,
    isLoadingJobs,
    fetchJobs,
    // ui
    showRecruiterLogin, setShowRecruiterLogin,
    searchFilter, setSearchFilter,
    isSearched, setIsSearched,
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}