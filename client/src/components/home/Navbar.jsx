import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Container from "../ui/Container";

function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold text-teal-600"
          >
            Voyagent AI
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/">Home</Link>
            <Link to="/">Features</Link>
            <Link to="/">Destinations</Link>
            <Link to="/">About</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/login">
            <Button className="border border-teal-500 text-teal-600 hover:bg-teal-50">
            Login
            </Button>
            </Link>

            <Link to="/register">
            <Button className="bg-teal-500 text-white hover:bg-teal-600">
            Register
            </Button>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;