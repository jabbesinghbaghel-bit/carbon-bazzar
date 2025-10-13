import ResendVerificationButton from "../../components/ResendVerificationButton";

export default function VerifyPage() {
  // You can later replace this with the actual logged-in user’s email
  const userEmail = "user@example.com";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0B0D17] text-white">
      <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        We’ve sent a verification email to <span className="font-semibold">{userEmail}</span>.  
        Didn’t get it? Click below to resend.
      </p>

      <ResendVerificationButton email={userEmail} />
    </main>
  );
}
