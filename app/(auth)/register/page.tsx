import Heading from '@/components/heading'
import prisma from '@/lib/db'
import { auth, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import RegisterForm from './(components)/register-form'


type Props = {}

const page = async(props: Props) => {


  const { userId} = auth()
  const user = await currentUser()
  console.log(user)

  if(!userId) return redirect('/')

const company = await prisma.company.findUnique({where:
{userId:userId}})

if(company) return redirect(`/${company.id}`)



  

 
  return (
    <div className='border rounded-lg p-8 xl:w-[700px]'>
      <Heading 
      title='Register'
      description='Add your company information'
      />
      <RegisterForm  userId={userId} userEmail={user?.emailAddresses[0].emailAddress as string} />
    </div>
  )
}

export default page