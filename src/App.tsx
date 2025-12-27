import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import TripPlanner from "./pages/TripPlanner"
import ExperiencesPage from "./pages/Experiences"
import MapPage from "./pages/Map"
import DonatePage from "./pages/Donate"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/map" element={<MapPage/>} />
        <Route path="/experiences" element={<ExperiencesPage/>} />
        <Route path="/trip-planner" element={<TripPlanner/>} />
        <Route path="/donate" element={<DonatePage />} />
      </Routes>
    </>
  )
}

export default App
