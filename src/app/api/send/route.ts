import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, assuntos, mensagem } = body;

    // Validação básica
    if (!nome || !email || !telefone || !mensagem) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios (Nome, E-mail, Telefone, Mensagem) devem ser preenchidos.' },
        { status: 400 }
      );
    }

    const assuntosTexto = assuntos && assuntos.length > 0 ? assuntos.join(', ') : 'Não especificado / Geral';

    const { data, error } = await resend.emails.send({
      from: 'Lajeadense Contato <onboarding@resend.dev>',
      to: 'mainratones@gmail.com',
      subject: `[Contato Site] Novo contato de ${nome} - Assunto: ${assuntosTexto}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #C8102E; margin-top: 0; border-bottom: 2px solid #C8102E; padding-bottom: 10px;">Novo Contato - Lajeadense Vidros</h2>
          
          <p>Você recebeu uma nova mensagem enviada através do formulário de contato do site.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Nome:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${nome}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">E-mail:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${telefone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Assunto(s):</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; color: #C8102E; font-weight: bold;">${assuntosTexto}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #C8102E; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #333; font-size: 16px;">Mensagem:</h3>
            <p style="white-space: pre-wrap; color: #444; line-height: 1.6; margin-bottom: 0;">${mensagem.replace(/\n/g, '<br />')}</p>
          </div>
          
          <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
            Este e-mail foi gerado automaticamente pelo formulário de contato do site Lajeadense Vidros.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Erro no Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('Erro interno no servidor:', err);
    return NextResponse.json({ error: err.message || 'Erro interno no servidor.' }, { status: 500 });
  }
}
