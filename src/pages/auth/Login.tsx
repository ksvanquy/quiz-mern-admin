import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../redux/slices/auth.slice";
import { authApi } from "../../api/auth.api";
import type { RootState } from "../../redux/store";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const loading = useSelector((s: RootState) => s.auth.loading);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    dispatch(loginStart());
    authApi
      .login({ email, password })
      .then((res: any) => {
        const token = res?.token as string;
        if (!token) throw new Error("Missing token in response");
        dispatch(loginSuccess({ token }));
        navigate("/", { replace: true });
      })
      .catch((err: any) => {
        dispatch(loginFailure());
        setError(err?.message || "Login failed");
      });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

        {token && (
          <div className="text-green-700 bg-green-100 border border-green-300 text-sm p-2 rounded mb-3">
            You are already logged in
          </div>
        )}
        {error && (
          <div className="text-red-700 bg-red-100 border border-red-300 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        <input
          type="email"
          className="border w-full p-2 rounded mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full p-2 rounded mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
