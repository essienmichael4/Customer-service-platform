// import shopping from "../../assets/shopping.jpg"
import logo from "../../assets/logo.png"
import LoginForm from "@/components/Login"

const Login = () => {
  return (
    <>
        <div className="h-screen flex flex-col md:flex-row w-full max-h-[800px] items-center md:justify-between">
            <div className="bg-blue-700 py-8 w-full mb-8 flex justify-center items-start text-white md:hidden">
                <div className="px-4 w-full sm:w-3/4">
                    <div className="w-16 h-16 mb-6  md:hidden">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className="md:hidden">
                        <h2 className="text-4xl mb-2">Sign in</h2>
                        <p className="text-white/70 text-xs">Welcome to Ghana Post Admin Panel - Let's help you sign in</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-start w-full lg:w-[50%]">
                <div className="px-4 w-full sm:w-3/4">
                    <div className="w-36 h-36 mb-2 hidden md:block">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className="hidden md:block">
                        <h2 className="font-bold text-4xl mb-2">Sign in</h2>
                        <p className="text-neutral-500 text-xs lg:text-sm">Welcome to Ghana Post Admin - Let's help you sign in</p>
                    </div>

                    <LoginForm />
                </div>
            </div>
            <div className="w-full hidden md:block lg:w-[50%] h-full p-4 rounded-lg overflow-hidden">
                {/* <div className={`w-full h-full bg-slate-500 flex bg-cover rounded-lg bg-center`} style={{backgroundImage:`url(${shopping})`}}>
                    <div className="overlay w-full h-full bg-black opacity-40 sm:hidden"></div>
                </div> */}
            </div>
        </div>
    </>
  )
}

export default Login
