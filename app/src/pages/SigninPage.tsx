import { SignIn } from "@clerk/clerk-react"
import { useLocation } from "react-router-dom"

const SigninPage = () => {
  const location = useLocation()
  
  // Get the redirect URL from the location state or query params, default to home
  const searchParams = new URLSearchParams(location.search)
  const redirectUrl = location.state?.from?.pathname || searchParams.get("redirect_url") || "/"
  
  return <div className="h-screen flex justify-center items-center pb-20">
    <SignIn 
      routing="path"
      path="/sign-in"
      afterSignInUrl={redirectUrl}
      afterSignUpUrl={redirectUrl}
      fallbackRedirectUrl={redirectUrl}
    />
  </div>
}

export default SigninPage