import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { API_URL } from "~/config";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormData {
  phone: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
}

function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    phone: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError(""); // reset error
    try {
      const res = await axios.post<LoginResponse>(
        `${API_URL}/admin/login`,
        formData
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        setError("Login failed. Check phone or password.");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full px-4 py-2 border rounded-md"
          value={formData.phone}
          onChange={handleChange}
        />

        {/* Parol va ko‘rsatish tugmasi */}
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md pr-10"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setPasswordVisible((prev) => !prev)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>

        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
