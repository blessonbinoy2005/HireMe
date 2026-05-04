import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobsPage from "./pages/JobPage";
import Profile from "./pages/Profile";
import CompanyPage from "./pages/company_page";
import Companies from "./pages/Companies";
import CompanySetup from "./pages/CompanySetup";
import CompanyEdit from "./pages/CompanyEdit";
import CompanyApplicants from "./pages/CompanyApplicants";
import ApplicantProfile from "./pages/ApplicantProfile";
import ApplicationTracker from "./pages/ApplicationTracker";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes with Navbar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/new" element={<CompanySetup />} />
            <Route path="/company/:companyID" element={<CompanyPage />} />
            <Route path="/company/:companyID/edit" element={<CompanyEdit />} />
            <Route path="/company/:companyID/jobs/:jobId/applicants" element={<CompanyApplicants />} />
            <Route path="/applicants/:userId" element={<ApplicantProfile />} />
          </Route>

          {/* Routes without Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/jobs" element={<JobsPage />} />

          <Route path="/tracker" element={<ApplicationTracker />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;