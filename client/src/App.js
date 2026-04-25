import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobsPage from "./pages/JobPage";
import Profile from "./pages/Profile";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes with Navbar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Routes without Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Home />} />
          import JobsPage from "./pages/JobsPage";

          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;