import { SignIn } from "@clerk/clerk-react"

const SigninPage = () => {
  return <div className="h-screen flex justify-center items-center pb-20">
    <SignIn />
  </div>
}

export default SigninPage