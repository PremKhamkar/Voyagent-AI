import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/ui/Button";

function Register({
  isModal = false,
  switchToLogin,
}) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] =
    useState("");
  const [termsError, setTermsError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  function handleRegister(event) {
    event.preventDefault();

    // Clear previous errors
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");

    let isValid = true;

    // Full Name validation
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setFullNameError("Full name is required.");
      isValid = false;
    } else if (trimmedName.length < 2) {
      setFullNameError("Please enter your full name.");
      isValid = false;
    }

    // Email validation
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
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

    // Terms validation
    if (!agreeTerms) {
      setTermsError(
        "Please agree to the Terms of Service and Privacy Policy."
      );
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);

    /*
     * Demo authentication:
     * Save the user's basic profile information so it can
     * be displayed in the Landing navbar and Profile page.
     */
    localStorage.setItem("userName", trimmedName);
    localStorage.setItem("userEmail", trimmedEmail);

    setTimeout(() => {
      setIsLoading(false);

      if (switchToLogin) {
        switchToLogin();
      } else {
        navigate("/login");
      }
    }, 1000);
  }

  return (
    <AuthLayout isModal={isModal}>
      {/* Heading */}
      <div className="mb-7 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Create Account
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Create your account and start exploring.
        </p>
      </div>

      {/* Social Sign Up */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="
            flex h-11 items-center justify-center gap-2
            rounded-xl
            border border-slate-200
            bg-white
            text-sm font-medium text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
          "
        >
          <span className="text-base font-bold text-blue-600">
            f
          </span>

          Facebook
        </button>

        <button
          type="button"
          className="
            flex h-11 items-center justify-center gap-2
            rounded-xl
            border border-slate-200
            bg-white
            text-sm font-medium text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
          "
        >
          <span className="text-base font-bold text-slate-700">
            G
          </span>

          Google
        </button>
      </div>

      {/* Divider */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          or
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Registration Form */}
      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >
        {/* Full Name */}
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-slate-700"
          >
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
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
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
                transition
                hover:text-cyan-600
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
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700"
          >
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
                transition
                hover:text-cyan-600
              "
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {confirmPasswordError && (
            <p className="text-sm text-red-500">
              {confirmPasswordError}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(event) => {
                setAgreeTerms(event.target.checked);
                setTermsError("");
              }}
              className="
                mt-1
                h-4
                w-4
                shrink-0
                rounded
                border-slate-300
                accent-cyan-500
              "
            />

            <span className="text-sm leading-5 text-slate-500">
              I agree to the{" "}
              <button
                type="button"
                className="
                  font-medium
                  text-cyan-600
                  hover:underline
                "
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="
                  font-medium
                  text-cyan-600
                  hover:underline
                "
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>

          {termsError && (
            <p className="text-sm text-red-500">
              {termsError}
            </p>
          )}
        </div>

        {/* Create Account */}
        <Button
          type="submit"
          disabled={isLoading}
          className="
            h-12
            w-full
            rounded-xl
            bg-cyan-500
            text-white
            shadow-md
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-cyan-600
            hover:shadow-lg
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
              onClick={() => {
                if (switchToLogin) {
                  switchToLogin();
                } else {
                  navigate("/login");
                }
              }}
              className="
                font-semibold
                text-cyan-600
                transition
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