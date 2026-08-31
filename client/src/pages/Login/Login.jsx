import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/ui/Button";

function Login({
  isModal = false,
  switchToRegister,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function handleSignIn(event) {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!email.trim()) {
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

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  }

  return (
    <AuthLayout isModal={isModal}>
      <form
  onSubmit={handleSignIn}
  className="mx-auto w-full max-w-[390px] space-y-7"
>
        {/* Email */}

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Email Address
          </label>

          <Input
            type="email"
            placeholder="Enter your email"
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
        </div>

        {/* Password */}

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-sm
                font-medium
                text-slate-500
                transition-colors
                hover:text-slate-800
              "
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">
              {passwordError}
            </p>
          )}
        </div>

        {/* Remember Me / Forgot Password */}

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
              className="
                h-4
                w-4
                rounded
                border-slate-300
                accent-cyan-500
              "
            />

            <span className="text-sm text-slate-600">
              Remember me
            </span>
          </label>

          <button
            type="button"
            className="
              text-sm
              font-medium
              text-cyan-600
              transition-colors
              hover:text-cyan-700
              hover:underline
            "
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}

        <Button
          type="submit"
          disabled={isLoading}
          className="
            mt-2
            h-12
            w-56
            rounded-xl
            bg-cyan-500
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-cyan-600
            hover:shadow-md
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>

        {/* Sign Up */}

        <div className="pt-1 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}

            <button
              type="button"
              onClick={switchToRegister}
              className="
                font-semibold
                text-cyan-600
                transition-colors
                hover:text-cyan-700
                hover:underline
              "
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;