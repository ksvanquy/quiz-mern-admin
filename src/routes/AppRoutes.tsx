import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import UsersList from "../pages/users/UsersList";
import NodesList from "../pages/nodes/NodesList";
import AssessmentsList from "../pages/assessments/AssessmentsList";
import QuestionsList from "../pages/questions/QuestionsList";
import AnswersList from "../pages/answers/AnswersList";
import AttemptsList from "../pages/attempts/AttemptsList";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

function RequireAuth() {
  const token = useSelector((s: RootState) => s.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected/Admin area */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/nodes" element={<NodesList />} />
            <Route path="/assessments" element={<AssessmentsList />} />
            <Route path="/questions" element={<QuestionsList />} />
            <Route path="/answers" element={<AnswersList />} />
            <Route path="/attempts" element={<AttemptsList />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}
