const resetPasswordTemplate = (verifyUrl) => {
  return `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center; color: #1f2937;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
                        
                        <!-- Logo / Brand Header -->
                        <h1 style="font-size: 24px; font-weight: 800; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.025em;">
                            Social<span style="color: #6366f1;"> Network</span>
                        </h1>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 24px;"></div>
                        
                        <!-- Content -->
                        <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px;">Verify your email address</h2>
                        <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 0; margin-bottom: 28px;">
                             Click the button below to reset your password.
                        </p>
                        
                        <!-- CTA Button -->
                        <div style="margin-bottom: 32px;">
                            <a href="${verifyUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 28px; font-size: 15px; font-weight: 500; text-decoration: none; border-radius: 8px; display: inline-block; transition: background-color 0.2s ease;">
                                Reset Your Password
                            </a>
                        </div>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 20px;"></div>
                        
                        <!-- Fallback Link -->
                        <p style="font-size: 12px; line-height: 1.5; color: #9ca3af; margin: 0;">
                            If the button doesn't work, copy and paste this link into your browser:<br>
                            <a href="${verifyUrl}" style="color: #6366f1; text-decoration: underline;">${verifyUrl}</a>
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; margin-bottom: 0;">
                        &copy; ${new Date().getFullYear()} Social Network. All rights reserved.
                    </p>
                </div>
    `;
};

module.exports = resetPasswordTemplate;