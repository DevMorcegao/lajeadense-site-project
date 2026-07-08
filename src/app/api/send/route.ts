import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, cidade, estado, mensagem } = body;

    // Validação rígida no servidor
    if (!nome || !email || !telefone || !cidade || !estado || !mensagem) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios (Nome, E-mail, Telefone, Cidade, Estado, Mensagem) devem ser preenchidos.' },
        { status: 400 }
      );
    }

    const trimmedNome = nome.trim();
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(trimmedNome)) {
      return NextResponse.json({ error: 'Por favor, insira um nome completo válido contendo apenas letras.' }, { status: 400 });
    }

    const nameParts = trimmedNome.split(/\s+/);
    const prepositions = ['de', 'da', 'do', 'dos', 'das', 'e'];
    const mainNameParts = nameParts.filter((part: string) => !prepositions.includes(part.toLowerCase()));

    if (mainNameParts.length < 2) {
      return NextResponse.json({ error: 'Por favor, insira seu nome e sobrenome completo.' }, { status: 400 });
    }

    if (mainNameParts.some((part: string) => part.length < 4)) {
      return NextResponse.json({ error: 'Cada nome/sobrenome deve conter pelo menos 4 letras.' }, { status: 400 });
    }

    if (prepositions.includes(nameParts[nameParts.length - 1].toLowerCase())) {
      return NextResponse.json({ error: 'O nome completo não pode terminar com uma preposição.' }, { status: 400 });
    }

    const trimmedEmail = email.trim();
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Endereço de e-mail inválido.' }, { status: 400 });
    }

    const lowerEmail = trimmedEmail.toLowerCase();
    const domain = lowerEmail.split('@')[1];
    const commonTypos: Record<string, string> = {
        'gmails.com': 'gmail.com',
        'gamil.com': 'gmail.com',
        'gmaill.com': 'gmail.com',
        'gmai.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'hotmial.com': 'hotmail.com',
        'hormail.com': 'hotmail.com',
        'hotmaill.com': 'hotmail.com',
        'hotmails.com': 'hotmail.com',
        'hotamil.com': 'hotmail.com',
        'hotmail.co': 'hotmail.com',
        'outlok.com': 'outlook.com',
        'outlook.co': 'outlook.com',
        'yahoo.co': 'yahoo.com',
        'yaho.co': 'yahoo.com'
    };

    const localPart = lowerEmail.split('@')[0];
    const domainParts = domain.split('.');
    const mainDomainPart = domainParts[0];

    if (commonTypos[domain]) {
      return NextResponse.json({ error: `E-mail inválido. Você quis dizer @${commonTypos[domain]}?` }, { status: 400 });
    }

    if (!/[a-z]/i.test(mainDomainPart)) {
      return NextResponse.json({ error: 'O domínio do e-mail não pode conter apenas números.' }, { status: 400 });
    }

    if (/^\d+$/.test(localPart) && localPart.length < 5) {
      return NextResponse.json({ error: 'A parte antes do @ não pode conter apenas números curtos.' }, { status: 400 });
    }

    const rawTel = telefone.replace(/\D/g, '');
    if (rawTel.length < 10) {
      return NextResponse.json({ error: 'Número de telefone/WhatsApp inválido.' }, { status: 400 });
    }

    if (!cidade.trim() || estado.length !== 2) {
      return NextResponse.json({ error: 'Cidade ou estado selecionado é inválido.' }, { status: 400 });
    }

    if (mensagem.trim().length < 10) {
      return NextResponse.json({ error: 'A mensagem de contato deve possuir ao menos 10 caracteres.' }, { status: 400 });
    }

    // Leitura do arquivo físico do logotipo para envio como anexo inline (CID)
    let logoBuffer: Buffer | null = null;
    try {
      const logoPath = path.join(process.cwd(), 'public/images/home/lajeadense-logo.png');
      logoBuffer = fs.readFileSync(logoPath);
    } catch (e) {
      console.error('Falha ao ler arquivo de imagem do logo para anexo inline:', e);
    }

    const emailPayload: any = {
      from: 'Lajeadense Contato <onboarding@resend.dev>',
      to: 'mainratones@gmail.com',
      subject: `[Contato Site] Novo contato de ${trimmedNome} (${cidade.trim()} - ${estado})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px; background-color: #0d0d0d; padding: 25px 20px; border-radius: 6px 6px 0 0;">
            <img src="${logoBuffer ? 'cid:lajeadense-logo' : 'https://lajeadense-site-project-w8vx.vercel.app/images/home/lajeadense-logo.png'}" alt="Lajeadense Vidros" width="180" height="45" style="border: 0; outline: none; display: inline-block; vertical-align: middle; max-width: 100%; height: auto;" />
          </div>
          <h2 style="color: #C8102E; margin-top: 0; border-bottom: 2px solid #C8102E; padding-bottom: 10px; text-align: center; font-size: 20px;">Novo Contato - Lajeadense Vidros</h2>
          
          <p>Você recebeu uma nova mensagem enviada através do formulário de contato do site.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Nome:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${trimmedNome}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">E-mail:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${trimmedEmail}">${trimmedEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${telefone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Localização:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${cidade.trim()} / ${estado}</td>
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
    };

    if (logoBuffer) {
      emailPayload.attachments = [
        {
          filename: 'lajeadense-logo.png',
          content: logoBuffer,
          content_type: 'image/png',
          contentId: 'lajeadense-logo'
        }
      ];
    }

    const { data, error } = await resend.emails.send(emailPayload);

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
