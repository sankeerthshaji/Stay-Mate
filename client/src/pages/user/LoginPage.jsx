import React from 'react'
import Footer from '../../components/user/Footer/Footer'
import Login from '../../components/user/Login'
import Navbar from '../../components/user/Navbar/Navbar'

function LoginPage() {
  return (
    <div>
        <Navbar />
        <Login/>
        <Footer/>
    </div>
  )
}

export default LoginPage