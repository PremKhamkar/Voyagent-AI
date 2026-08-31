import { useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/ui/Button";

function Register({
  isModal = false,
  switchToLogin,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] =
    useState("");

  const [isLoading, setIsLoading] = useState(false);

  function handleRegister(event) {
    event.preventDefault();

    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    // Full Name validation

    if (!fullName.trim()) {
      setFullNameError("Full name is required.");
      isValid = false;
    }

    // Email validation

    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Password validation

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(
        "Password must be at least 6 characters."
      );
      isValid = false;
    }

    // Confirm Password validation

    if (!confirmPassword) {
      setConfirmPasswordError(
        "Please confirm your password."
      );
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(
        "Passwords do not match."
      );
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (switchToLogin) {
        switchToLogin();
      }
    }, 1000);
  }

  return (
    <AuthLayout isModal={isModal}>
      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >
        {/* Full Name */}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <Input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              setFullNameError("");
            }}
          />

          {fullNameError && (
            <p className="text-sm text-red-500">
              {fullNameError}
            </p>
          )}
        </div>

        {/* Email */}

        <div className="space-y-2">
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

        <div className="space-y-2">
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

        {/* Confirm Password */}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Confirm Password
          </label>

          <div className="relative">
            <Input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setConfirmPasswordError("");
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
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
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          {confirmPasswordError && (
            <p className="text-sm text-red-500">
              {confirmPasswordError}
            </p>
          )}
        </div>

        {/* Terms */}

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            required
            className="
              mt-1
              h-4
              w-4
              rounded
              border-slate-300
              accent-cyan-500
            "
          />

          <span className="text-sm leading-5 text-slate-500">
            I agree to the Terms of Service and
            Privacy Policy.
          </span>
        </label>

        {/* Create Account */}

        <Button
          type="submit"
          disabled={isLoading}
          className="
            mt-2
            h-12
            w-full
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
          {isLoading
            ? "Creating Account..."
            : "Create Account"}
        </Button>

        {/* Sign In */}

        <div className="pt-1 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}

            <button
              type="button"
              onClick={switchToLogin}
              className="
                font-semibold
                text-cyan-600
                transition-colors
                hover:text-cyan-700
                hover:underline
              "
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Register;