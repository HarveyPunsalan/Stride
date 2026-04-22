import { BrowserRouter, Routes, Route } from "react-router-dom";
import Activity from "./pages/Activity";
import AiCoach from "./pages/AiCoach";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import PublicProfile from "./pages/PublicProfile";
import Repositories from "./pages/Repositories";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/activity" element={<Activity />} />
        <Route path="/aiCoach" element={<AiCoach />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Landing />} />
        <Route path="/publicProfile" element={<PublicProfile />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
