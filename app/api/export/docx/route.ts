import { Document, Packer, Paragraph } from 'docx';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    const doc = new Document({
      sections: [
        {
          children: String(content)
            .split('\n')
            .map((line) => new Paragraph(line.replace(/[\*#_`]/g, ''))),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new Response(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="export.docx"',
      },
    });
  } catch (error) {
    return new Response('Bad Request', { status: 400 });
  }
}
