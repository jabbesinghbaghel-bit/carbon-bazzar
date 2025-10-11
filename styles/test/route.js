export async function GET() {
  return Response.json({
    resendKeyLoaded: !!process.env.RESEND_API_KEY,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  });
}
