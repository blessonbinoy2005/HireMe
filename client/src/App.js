import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;