import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const test = async () => {
  const { data, error } = await resend.emails.send({
    from: "Carbon Bazzar <no-reply@carbonbazzar.com>", // ✅ Use your verified domain
    to: "anyemail@gmail.com", // can now be anyone after domain verification
    subject: "✅ Resend test from verified domain",
    html: "<p>Your domain verification is working!</p>",
  });

  console.log("data:", data);
  console.log("error:", error);
};

test();
