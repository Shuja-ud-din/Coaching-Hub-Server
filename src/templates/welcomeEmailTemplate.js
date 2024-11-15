export const welcomeEmailTemplate = (name) => {
    return `
      <div style=" line-height: 1.5; max-width: 600px; margin: auto; text-align: left;">
        <p style="font-size: 18px; font-weight: bold; text-align: center;">Hi ${name},</p>
        <p>Welcome to Coaching Hub! We’re thrilled to have you join our community of passionate life coaches, all dedicated to empowering people to live their best lives.</p>
        <p>Your journey with us is just beginning, and we can’t wait to see the incredible impact you’ll make!</p>
        <p style="font-size: 20px; font-weight: 400; text-align: center; margin-top: 20px;">Here’s what to expect:</p>
        <ul style="margin: auto; padding-left: 20px;">
          <li><strong>Supportive Community:</strong> Connect with fellow coaches who share your drive and commitment to growth.</li>
          <li><strong>Innovative Tools:</strong> Access resources designed to help you manage and grow your coaching business.</li>
          <li><strong>Endless Opportunities:</strong> Together, we’ll reach clients looking for guidance, purpose, and positive change.</li>
        </ul>
        <p>Let’s dive in! You can log in to your account , once we are live through our Android & iOS apps and start exploring all that Coaching Hub has to offer.</p>
        <p>If you have any questions, our team is just an email away at admin@coachinghub.ae </p>
        <p>Thank you for choosing to make Coaching Hub part of your journey. Let’s inspire, uplift, and create lasting change – one session at a time!</p>
        <p style="text-align: center;">Welcome aboard, Coach!</p>
        <p style="margin-top: 20px; text-align: center;">Warmly,<br><strong>The Coaching Hub Team</strong></p>
      </div>
    `;
  };
  