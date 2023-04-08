import React from 'react'
import AdminSideBar from '../../components/admin/AdminSideBar'
import UserDetails from '../../components/admin/UserDetails'

function UserDetailsPage() {
  return (
    <div className="flex h-screen">
      <div className="w-16 flex-shrink-0">
        <AdminSideBar />
      </div>
      <UserDetails />
    </div>
  )
}

export default UserDetailsPage