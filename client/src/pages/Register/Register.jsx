import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/ui/Button";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleRegister(event) {
    event.preventDefault();

    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!fullName.trim()) {
      setFullNameError("Full name is required.");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm your password.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);

    setTimeout(() => {
    setIsLoading(false);
    navigate("/login");
    }, 1000);
    } 

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-center">
            Create Account
          </h1>

          <p className="text-center text-gray-500">
            Create your account to start planning amazing trips.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setFullNameError("");
            }}
          />

          {fullNameError && (
            <p className="text-sm text-red-500">
              {fullNameError}
            </p>
          )}

          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
          />

          {passwordError && (
            <p className="text-sm text-red-500">
              {passwordError}
            </p>
          )}

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError("");
            }}
          />

          {confirmPasswordError && (
            <p className="text-sm text-red-500">
              {confirmPasswordError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Creating Account..."
              : "Create Account"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-teal-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Register;