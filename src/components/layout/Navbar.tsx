import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/auth.slice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Admin Panel</h1>

      <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
        Logout
      </button>
    </div>
  );
}
