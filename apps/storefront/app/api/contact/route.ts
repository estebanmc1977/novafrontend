// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, subject } = await request.json();

    // Si no hay API key (preview o dev sin config), devolvemos success simulado
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY no configurada → modo preview/demo');
      return NextResponse.json({ 
        success: true, 
        message: "Mensaje recibido (modo demo)" 
      }, { status: 200 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Novapatch <no-reply@novapatch.care>',
      to: ['soporte@novapatch.mx'], // cambia según mercado si quieres
      subject: subject || `Nuevo contacto: ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject || 'Sin asunto'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error al enviar email:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al procesar el mensaje' 
    }, { status: 500 });
  }
}
