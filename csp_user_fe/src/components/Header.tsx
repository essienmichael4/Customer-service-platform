import { useState } from 'react'
import logo from '@/assets/logo.png'
import { Bell, LogOut, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { Link, useLocation, useNavigate, useResolvedPath } from 'react-router-dom'
import { ScrollArea } from './ui/scroll-area'
import useAuth from '@/hooks/useAuth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'

const Header = ()=> {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    const {auth, dispatch} = useAuth()
    
    const location = useLocation()
    const urlParams = new URLSearchParams(location.search)
    const [search, setSearch] = useState(urlParams.get("q"))
    // @ts-ignore comment
    const path = useResolvedPath().pathname.split("/")[1].toLowerCase()
    const navigate = useNavigate()

    const toggleNavbar = ()=>{
        setMobileDrawerOpen(!mobileDrawerOpen)
    }

    return (
        <>
            <nav className="sticky top-0 z-20 py-3 backdrop-blur-lg border-b border-neutral-100/80">
            <div className="container relative px-4 mx-auto text-sm">
                <div className="flex justify-between items-center">
                    <div className='flex items-center gap-2'>
                        <div className="lg:hidden md:flex flex-col justify-end pt-1">
                            <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X className='w-3 h-3  md:w-4 md:h-4'/> : <Menu className='w-3 h-3  md:w-5 md:h-5'/>}</button>
                        </div>
                        <Link to={"/"} className="flex items-center flex-shrink-0">
                            <img src={logo} alt="logo" className='h-6 w-6 lg:h-10 lg:w-10 mr-2' />
                            <span className="text-sm lg:text-xl tracking-tight">CLIXMART</span>
                        </Link>
                    </div>
                    
                    <div className="flex justify-center items-center space-x-1">
                        {auth?.id ? <>
                            <button className='p-2 relative bg-gray-100 hover:bg-gray-200 rounded-full'>
                                <Bell className='w-3 md:w-4 h-3 md:h-4 text-gray-500'/>
                                <div className='w-3 md:w-4 h-3 md:h-4 absolute top-0 right-0 text-[.5rem] md:text-[.6rem] text-white flex items-center justify-center bg-rose-500 rounded-full'>2</div>
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className='w-10 h-10 rounded-full'><User className="h-6 w-6 text-muted-foreground" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={()=>{navigate(`../profile/${auth!.id}`)}}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=>{navigate(`../orders`)}}>
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        <span>Orders</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=>{
                                        dispatch({type: "REMOVE_AUTH", payload: undefined})
                                    }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            
                        </> :
                        <Link to={"../login"} className="py-2 px-3 rounded-md text-xs md:text-sm uppercase text-gray-500" >Login</Link>
                        }
                    </div>
                </div>
                <div className="flex w-full rounded-md md:hidden justify-center items-center h-9 mt-2">
                    <div className="flex w-full sm:w-2/3 md:w-2/4 border h-full items-center px-3 gap-3 rounded-s-md bg-white focus-within:border-gray-500">
                        <Search className="h-4 w-4 text-gray-400 pointer-events-none" />
                        <input type="text" onChange={(e)=>setSearch(e.target.value)}
                            value={search as string} placeholder="Search products, categories & brands" className="text-xs md:text-sm outline-none w-full bg-transparent"/>
                    </div>
                    {/* <button className="text-white text-xs bg-blue-700 h-full px-6 rounded-e-md hover:bg-blue-500" onClick={handleSearch}>Search</button> */}
                </div>
            </div>

            </nav>
            {mobileDrawerOpen && 
                <div className="fixed inset-0 z-50 w-full bg-gray-700/10 backdrop-blur-lg flex flex-col lg:hidden">
                    <ScrollArea className='w-[300px] h-full bg-white pt-4'>
                        <div className='flex items-center gap-2 pl-4 mb-4'>
                            <div className="lg:hidden md:flex flex-col justify-end pt-1">
                                <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X className='w-4 h-4  md:w-5 md:h-5'/> : <Menu className='w-4 h-4 md:w-5 md:h-5'/>}</button>
                            </div>
                            <Link to={"../"} className="flex items-center flex-shrink-0">
                                <img src={logo} alt="logo" className='h-5 w-5 md:h-10 md:w-10 mr-2' />
                                <span className="text-sm md:text-xl tracking-tight">CLIXMART MALL</span>
                            </Link>
                        </div>
                    </ScrollArea>
                </div>
            }
        </>
    )
}

export default Header
