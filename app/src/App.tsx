import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import TripPlanner from "./pages/TripPlanner"
import TripDetail from "./pages/TripDetail"
import ExperiencesPage from "./pages/Experiences"
import GuidesPage from "./pages/Guides"
import MapPage from "./pages/Map"
import DonatePage from "./pages/Donate"
import SigninPage from "./pages/SigninPage"
import SignupPage from "./pages/SignupPage"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/sign-in" element={<SigninPage/>} />
        <Route path="/sign-up" element={<SignupPage/>} />
        <Route path="/map" element={<MapPage/>} />
        <Route path="/experiences" element={<ExperiencesPage/>} />
        <Route path="/guides" element={<GuidesPage/>} />
        <Route path="/trip-planner" element={<TripPlanner/>} />
        <Route path="/trip-planner/:tripId" element={<TripDetail/>} />
        <Route path="/donate" element={<DonatePage />} />
      </Routes>
    </>
  )
}

export default App
