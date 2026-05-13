// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      {/* This layout ensures all login/signup forms 
          are perfectly centered and have the same background.
      */}
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}