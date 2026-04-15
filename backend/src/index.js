const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));

app.get('/ping', (req, res) => {
    res.json({ pong: true, message: 'Backend successfully running!' });
});

app.get('/', (req, res) => {
    res.send('AuraLink Facturación API');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} at 0.0.0.0`);
});
