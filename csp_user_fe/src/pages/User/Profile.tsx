import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { type User } from "@/lib/types"
import useAxiosToken from '@/hooks/useAxiosToken'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useAuth from '@/hooks/useAuth'
import EditAccountDialog from './_components/EditAccountDialog'
import ChangePassword from './_components/ChangePassword'
import AddNewAddress from './_components/AddNewAddress'

const UserProfile = () => {
    const {auth} = useAuth()
    const navigate = useNavigate()
    const {id} =useParams()
    const axios_instance_token = useAxiosToken()

    const user = useQuery<User>({
      queryKey: ["users", id],
      queryFn: async() => await axios_instance_token.get(`/users/${id}`).then(res => {
        console.log(res.data);

        return res.data
      })
    })

    return (
      <div className='mx-auto container mt-4 mb-16 px-4'>
        <div className="flex items-center justify-between">
          <div className='flex items-center gap-4'>
            <button className='p-2 bg-blue-100 flex items-center justify-center rounded-lg' onClick={()=>{navigate(-1)}}>
              <ArrowLeft className='w-4 h-4'/>
            </button>
            <h4 className=" font-semibold">User Account</h4>
          </div>
          <div className=" flex items-center justify-end gap-2 flex-wrap">
            <AddNewAddress userId={Number(user.data?.id)} trigger={
              <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-cyan-500 to-cyan-800 text-white">
                <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add New Address</span>
              </button>
              } />
            <EditAccountDialog user={user.data as User} trigger={
            <Button className="border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent">Edit Profile</Button>} />
            <ChangePassword id={Number(id)} trigger={
            <Button className="border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent">Change Password</Button>} />
          </div>
        </div>
        <div className='bg-white my-4 border border-gray-300 rounded-lg h-full relative'>
          <div className='w-full h-48 bg-gray-200 rounded-lg relative'>
          </div>
          <div className='px-4 pt-4 pb-8'>
            <div className='absolute w-36 h-36 rounded-full bg-white border-4 border-gray-200 top-16 left-4'></div>
            <h3 className="font-bold text-4xl capitalize">{user.data?.name}</h3>
            <p className="mt-2 text-muted-foreground">{user.data?.email}</p>
            
            <Separator />
            <div className="my-4">
              <h4 className="text-xl font-semibold">User Information</h4>
              <div className='flex flex-wrap gap-8'>
                <div>
                  <span className='text-xs text-gray-300'>User contact</span>
                  <p className="capitalize">{user.data?.phone ? user.data?.phone : "-"}</p>
                </div>

                {auth?.role === "SUPERADMIN" && <div>
                  <span className='text-xs text-gray-300'>User role</span>
                  <p className="capitalize">{user.data?.role}</p>
                </div>
                }
              </div>
            </div>
            <Separator />
            <div className="my-4">
              <h4 className="text-xl font-semibold">User Address</h4>
              {user.data?.addresses.map((address:any) => {
                return <div className='flex flex-wrap gap-8'>
                  <div>
                    <span className='text-xs text-gray-300'>Country</span>
                    <p>{address?.country ? address?.country : "-"}</p>
                  </div>
                  <div>
                    <span className='text-xs text-gray-300'>State</span>
                    <p>{address?.state ? address?.state : "-"}</p>
                  </div>
                  <div>
                    <span className='text-xs text-gray-300'>City</span>
                    <p>{address?.city ? address?.city : "-"}</p>
                  </div>
                  <div>
                    <span className='text-xs text-gray-300'>Street Address</span>
                    <p>{address?.addressLineOne ? address?.addressLineOne : "-"}</p>
                  </div>
                  <div>
                    <span className='text-xs text-gray-300'>Nearest Landmark</span>
                    <p>{address?.landmark ? address?.landmark : "-"}</p>
                  </div>
                  {/* <div>
                    <span className='text-xs text-gray-300'>Zip</span>
                    <p>{user.data?.address?.zip ? user.data?.address?.zip : "-"}</p>
                  </div> */}
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    )
}

export default UserProfile
