function Navbar() {
  return (
    <nav className="flex items-center justify-between py-5">
      <h1 className="text-2xl font-bold">
        VOYAGENT AI
      </h1>

      <button className="rounded-xl bg-cyan-500 px-4 py-2">
        Dashboard
      </button>
    </nav>
  );
}

export default Navbar;