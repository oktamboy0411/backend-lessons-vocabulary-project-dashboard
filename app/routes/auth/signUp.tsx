import { useState } from "react";
import axios from "axios";
import { API_URL } from "~/config";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";

interface FormData {
  name: string;
  phone: string;
  reg_key: string;
  password: string;
}

interface ResponseData {
  success: boolean;
  message: string;
}

function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    reg_key: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    setMessage("");

    if (formData.password !== confirmPassword) {
      setSuccess(false);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post<ResponseData>(
        `${API_URL}/admin/sign-up`,
        formData
      );
      setSuccess(res.data.success);
      setMessage(res.data.message);
      if (res.data.success) {
        navigate("/login");
      }
    } catch (err: any) {
      setSuccess(false);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Something went wrong.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full px-4 py-2 border rounded-md"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full px-4 py-2 border rounded-md"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="reg_key"
          placeholder="Registration Key"
          className="w-full px-4 py-2 border rounded-md"
          value={formData.reg_key}
          onChange={handleChange}
        />

        {/* Parol */}
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

        {/* Confirm password */}
        <input
          type={passwordVisible ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded-md"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleClick}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Account
        </button>

        {message && (
          <p
            className={`text-center font-medium ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Signup;
