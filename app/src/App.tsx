import { Route, Routes, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Home from "./pages/Home"
import TripPlanner from "./pages/TripPlanner"
import TripDetail from "./pages/TripDetail"
import ExperiencesPage from "./pages/Experiences"
import GuidesPage from "./pages/Guides"
import MapPage from "./pages/Map"
import DonatePage from "./pages/Donate"
import SigninPage from "./pages/SigninPage"
import SignupPage from "./pages/SignupPage"
import MyBookingsPage from "./pages/MyBookings"

function App() {
  const location = useLocation()

  // Debug: Log all route changes
  useEffect(() => {
    console.log("App route changed:", location.pathname, location.search)
  }, [location])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SigninPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/trip-planner/:tripId" element={<TripDetail />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Routes>
    </>
  )
}

export default App
