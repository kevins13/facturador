const db = require('../db');
const { invoices, invoiceItems } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const pdfService = require('../services/pdf.service');

const getAll = async (req, res) => {
    try {
        const result = await db.query.invoices.findMany({
            with: { client: true },
            orderBy: [desc(invoices.createdAt)]
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener facturas' });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query.invoices.findFirst({
            where: eq(invoices.id, parseInt(id)),
            with: {
                client: true,
                items: true
            }
        });

        if (!result) return res.status(404).json({ message: 'Factura no encontrada' });
        
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener factura' });
    }
};

const create = async (req, res) => {
    try {
        const { clientId, items } = req.body;
        
        let total = 0;
        const processedItems = items.map(item => {
            const subtotal = item.quantity * item.price;
            total += subtotal;
            return {
                description: item.description,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price),
                subtotal
            };
        });

        // Inserción Transaccional usando Drizzle
        const invoiceData = await db.transaction(async (tx) => {
            const newInvoiceRes = await tx.insert(invoices).values({
                clientId: parseInt(clientId),
                total
            }).returning();
            
            const newInvoiceId = newInvoiceRes[0].id;
            
            const itemsToInsert = processedItems.map(item => ({
                ...item,
                invoiceId: newInvoiceId
            }));

            await tx.insert(invoiceItems).values(itemsToInsert);
            
            return newInvoiceId;
        });

        // Obtener comprobante totalmente creado usando relational query
        const invoice = await db.query.invoices.findFirst({
            where: eq(invoices.id, invoiceData),
            with: {
                client: true,
                items: true
            }
        });

        res.status(201).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear factura' });
    }
};

const markAsPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.update(invoices)
            .set({ status: 'paid' })
            .where(eq(invoices.id, parseInt(id)))
            .returning();
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar estado de factura' });
    }
};

const downloadPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await db.query.invoices.findFirst({
            where: eq(invoices.id, parseInt(id)),
            with: {
                client: true,
                items: true
            }
        });

        if (!invoice) return res.status(404).json({ message: 'Factura no encontrada' });

        const pdfBuffer = await pdfService.generateInvoicePDF(invoice);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factura-${invoice.id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar el PDF' });
    }
};

module.exports = { getAll, getById, create, markAsPaid, downloadPDF };
