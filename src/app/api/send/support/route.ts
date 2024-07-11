import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'support@recy.life',
      to: ['phil@detrashtoken.com', 'yuri@detrashtoken.com'],
      subject: 'I want a personalized support',
      html: `<strong>Email:</strong> ${email}`,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
