const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));

app.get('/', (req, res) => {
    res.send('AuraLink Facturación API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
