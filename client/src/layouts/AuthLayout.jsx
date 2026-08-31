function AuthLayout({ children, isModal = false }) {
  if (isModal) {
    return (
      <div className="w-full">
        {children}
      </div>
    );
  }

  return (
    <main
      className="
        flex min-h-screen items-center justify-center
        bg-slate-100 px-6 py-12
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-3xl
          bg-white
          p-8
          shadow-xl
        "
      >
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;