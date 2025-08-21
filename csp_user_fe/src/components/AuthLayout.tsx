import { Outlet } from "react-router-dom"
import Navbar from "./AuthNavbar"
import SideNav from "./SideNav"
import { useState } from "react"

const AuthLayout = () => {
  const [isToggled, setIsToggled] = useState(false)
  const toggleNavbar = ()=>{

    setIsToggled(!isToggled)
    console.log(isToggled);
    
  }
  return (
    <>
        <SideNav isToggled={isToggled} />
        <main className={`${isToggled ? 'lg:w-[calc(100%-4rem)] lg:ml-[4rem] md:w-[calc(100%-220px)] md:ml-[220px] ' : 'lg:w-[calc(100%-220px)] lg:ml-[220px]'} w-[calc(100%-4rem)] ml-[4rem] transition-all ease-in-out duration-500`}>
          <Navbar toggleNavbar={toggleNavbar}/>
          <Outlet />
        </main>
    </>
  )
}

export default AuthLayout
