function AuthLayout({ children }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;