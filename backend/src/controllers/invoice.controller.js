const { PrismaClient } = require('@prisma/client');
const pdfService = require('../services/pdf.service');
const prisma = new PrismaClient();

const getAll = async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: { client: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener facturas' });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await prisma.invoice.findUnique({
            where: { id: parseInt(id) },
            include: {
                client: true,
                items: true
            }
        });

        if (!invoice) return res.status(404).json({ message: 'Factura no encontrada' });
        
        res.json(invoice);
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

        const invoice = await prisma.invoice.create({
            data: {
                clientId: parseInt(clientId),
                total,
                items: {
                    create: processedItems
                }
            },
            include: {
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
        const invoice = await prisma.invoice.update({
            where: { id: parseInt(id) },
            data: { status: 'paid' }
        });
        res.json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar estado de factura' });
    }
};

const downloadPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await prisma.invoice.findUnique({
            where: { id: parseInt(id) },
            include: {
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
