import Dashboard from '@/components/dashboard/Dashboard'
import { ROUTES } from '@/router/Routes'
import React from 'react'

const index = () => {
   return (
      <Dashboard route={ROUTES}/>
   )
}

export default index