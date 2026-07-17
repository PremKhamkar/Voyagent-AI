import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/ui/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  function handleSignIn(event) {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
    localStorage.setItem("isLoggedIn", "true");

    setIsLoading(false);

    navigate("/dashboard");
    }, 1000);
    }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-center">
            Welcome Back
          </h1>

          <p className="text-center text-gray-500">
            Sign in to continue planning your trips.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSignIn}
          className="space-y-4"
        >
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError("");
            }}
          />

          {emailError && (
            <p className="text-sm text-red-500">
              {emailError}
            </p>
          )}

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordError("");
            }}
          />

          {passwordError && (
            <p className="text-sm text-red-500">
              {passwordError}
            </p>
          )}

          <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
          <input
          type="checkbox"
          checked={rememberMe}
          onChange={(event) =>
          setRememberMe(event.target.checked)
          }
          />

          <span className="text-sm text-gray-700">
          Remember Me
          </span>
          </label>

          <button
          type="button"
          className="text-sm text-teal-600 hover:underline"
          >
          Forgot Password?
          </button>
          </div>

          <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          >
          {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center">
          <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          
          <Link
          to="/register"
          className="font-semibold text-teal-600 hover:underline"
          >
          Sign Up
          </Link>
          </p>
          </div>
          
          </form>
          </div>
          </AuthLayout>
  );
}

export default Login;