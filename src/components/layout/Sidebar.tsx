import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 fixed left-0 top-0 h-full bg-white shadow p-6">
      <h2 className="text-2xl font-bold mb-8">Quiz Admin</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/users" className="hover:text-blue-600">Users</Link>
        <Link to="/nodes" className="hover:text-blue-600">Nodes</Link>
        <Link to="/assessments" className="hover:text-blue-600">Assessments</Link>
        <Link to="/questions" className="hover:text-blue-600">Questions</Link>
        <Link to="/answers" className="hover:text-blue-600">Answers</Link>
        <Link to="/attempts" className="hover:text-blue-600">Attempts</Link>
        <Link to="/settings" className="hover:text-blue-600">Settings</Link>
      </nav>
    </aside>
  );
}
