const PDFDocument = require('pdfkit');

const generateInvoicePDF = (invoice) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Header
            doc.fontSize(25).font('Helvetica-Bold').text('AuraLink Facturación', 50, 50);
            doc.fontSize(10).font('Helvetica').text('Nro. de Factura: ' + invoice.id.toString().padStart(6, '0'), 50, 80);
            doc.text('Fecha: ' + invoice.date.toLocaleDateString(), 50, 95);
            doc.text('Estado: ' + (invoice.status === 'paid' ? 'Pagada' : 'Pendiente').toUpperCase(), 50, 110);
            
            // Client section
            doc.fontSize(14).font('Helvetica-Bold').text('Datos del Cliente', 50, 150);
            const client = invoice.client;
            doc.fontSize(10).font('Helvetica');
            doc.text(`Nombre: ${client.name}`, 50, 170);
            doc.text(`Email: ${client.email}`, 50, 185);
            doc.text(`CUIT: ${client.cuit}`, 50, 200);
            doc.text(`Dirección: ${client.address}`, 50, 215);

            // Lines for table
            doc.moveTo(50, 250).lineTo(550, 250).stroke();
            doc.font('Helvetica-Bold').text('Descripción', 50, 260);
            doc.text('Cant', 300, 260, { width: 50, align: 'right' });
            doc.text('Precio', 380, 260, { width: 70, align: 'right' });
            doc.text('Subtotal', 480, 260, { width: 70, align: 'right' });
            doc.moveTo(50, 280).lineTo(550, 280).stroke();

            // Items
            let y = 290;
            doc.font('Helvetica');
            invoice.items.forEach(item => {
                doc.text(item.description, 50, y, { width: 240 });
                doc.text(item.quantity.toString(), 300, y, { width: 50, align: 'right' });
                doc.text(`$${item.price.toFixed(2)}`, 380, y, { width: 70, align: 'right' });
                doc.text(`$${item.subtotal.toFixed(2)}`, 480, y, { width: 70, align: 'right' });
                y += 20;
                
                // Add new page if necessary
                if (y > 700) {
                    doc.addPage();
                    y = 50;
                }
            });

            // Total section
            doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
            doc.fontSize(14).font('Helvetica-Bold').text(`TOTAL: $${invoice.total.toFixed(2)}`, 380, y + 25, { width: 170, align: 'right' });

            // Footer
            doc.fontSize(10).font('Helvetica').text('Gracias por su preferencia', 50, 700, { align: 'center', width: 500 });
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateInvoicePDF };
