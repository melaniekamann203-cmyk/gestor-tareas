import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

interface SummaryPayload {
  to: string;
  subject: string;
  text: string;
}

// Validamos el payload ANTES de enviar: si falta algo, respondemos 400.
function isValidPayload(body: unknown): body is SummaryPayload {
  if (typeof body !== "object" || body === null) return false;
  const { to, subject, text } = body as Record<string, unknown>;
  return (
    typeof to === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) &&
    typeof subject === "string" &&
    subject.trim() !== "" &&
    typeof text === "string" &&
    text.trim() !== ""
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo debe ser JSON válido." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return Response.json(
      { error: "Faltan datos o son inválidos: to, subject y text." },
      { status: 400 }
    );
  }

  // Las credenciales viven SOLO en el servidor (variables de entorno de Vercel).
  const { SES_REGION, SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY, SES_FROM_EMAIL } = process.env;
  if (!SES_REGION || !SES_ACCESS_KEY_ID || !SES_SECRET_ACCESS_KEY || !SES_FROM_EMAIL) {
    return Response.json(
      { error: "El servidor no tiene configurado el envío de emails." },
      { status: 500 }
    );
  }

  const client = new SESClient({
    region: SES_REGION,
    credentials: { accessKeyId: SES_ACCESS_KEY_ID, secretAccessKey: SES_SECRET_ACCESS_KEY },
  });

  try {
    await client.send(
      new SendEmailCommand({
        Source: SES_FROM_EMAIL,
        Destination: { ToAddresses: [body.to] },
        Message: {
          Subject: { Data: body.subject, Charset: "UTF-8" },
          Body: { Text: { Data: body.text, Charset: "UTF-8" } },
        },
      })
    );
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error al enviar con SES:", error);
    return Response.json({ error: "No se pudo enviar el email." }, { status: 502 });
  }
} 