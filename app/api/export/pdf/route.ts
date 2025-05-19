import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();
    const fontSize = 12;
    const lines = String(content).replace(/[\*#_`]/g, '').split('\n');
    let y = height - fontSize * 2;
    for (const line of lines) {
      page.drawText(line, { x: 50, y, size: fontSize, font });
      y -= fontSize + 4;
      if (y < 50) {
        y = height - fontSize * 2;
        page = pdfDoc.addPage();
      }
    }
    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="export.pdf"',
      },
    });
  } catch (error) {
    return new Response('Bad Request', { status: 400 });
  }
}
