const verifyEmailTemplate = (verifyUrl) => {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f9fafb;padding:40px 20px;text-align:center;color:#1f2937;">
      <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,.05);border:1px solid #e5e7eb;">

        <h1 style="font-size:24px;font-weight:800;color:#000;margin:0 0 24px;">
          Social<span style="color:#6366f1;"> Network</span>
        </h1>

        <hr style="border:none;border-top:1px solid #f3f4f6;margin-bottom:24px;" />

        <h2 style="font-size:20px;margin-bottom:12px;">
          Verify your email address
        </h2>

        <p style="font-size:15px;line-height:1.6;color:#4b5563;">
          Thanks for signing up! Click the button below to verify your account.
        </p>

        <div style="margin:32px 0;">
          <a
            href="${verifyUrl}"
            style="background:#6366f1;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;"
          >
            Verify Email
          </a>
        </div>

        <hr style="border:none;border-top:1px solid #f3f4f6;margin-bottom:20px;" />

        <p style="font-size:12px;color:#9ca3af;">
          If the button doesn't work, copy this link into your browser:
        </p>

        <a
          href="${verifyUrl}"
          style="font-size:12px;color:#6366f1;word-break:break-all;"
        >
          ${verifyUrl}
        </a>

      </div>

      <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
        © ${new Date().getFullYear()} Social Network. All rights reserved.
      </p>
    </div>
  `;
};

module.exports = verifyEmailTemplate;