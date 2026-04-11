import React, { createContext, useContext, useEffect, useState } from "react"
import { Toaster } from "sonner";
const AdmintoContext = createContext()

export const AdmintoProvider = ({ children, session: sessionDB }) => {

  const [session, setSession] = useState(sessionDB)
  return <AdmintoContext.Provider value={{
    session, setSession
  }}>
    {children}
    <Toaster />
  </AdmintoContext.Provider>
}

export const useAdminto = () => {
  const context = useContext(AdmintoContext)
  if (!context) throw new Error('useAdminto must be used within a AdmintoProvider')
  return context
}