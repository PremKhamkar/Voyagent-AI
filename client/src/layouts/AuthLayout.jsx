function AuthLayout({ children, isModal = false }) {
  if (isModal) {
    return (
      <div className="w-full p-8 md:p-10">
        {children}
      </div>
    );
  }

  return (
    <main
      className="
        flex min-h-screen items-center
        justify-center bg-gray-100
      "
    >
      <div
        className="
          w-full max-w-md rounded-xl
          bg-white p-8 shadow-lg
        "
      >
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;