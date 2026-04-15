const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await prisma.client.findUnique({
            where: { id: parseInt(id) }
        });

        if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });
        
        res.json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener cliente' });
    }
};

const create = async (req, res) => {
    try {
        const { name, email, phone, address, cuit } = req.body;
        const client = await prisma.client.create({
            data: { name, email, phone, address, cuit }
        });
        res.status(201).json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, cuit } = req.body;
        
        const client = await prisma.client.update({
            where: { id: parseInt(id) },
            data: { name, email, phone, address, cuit }
        });
        
        res.json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.client.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar cliente' });
    }
};

module.exports = { getAll, getById, create, update, remove };
