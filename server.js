const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/calculatorDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
const calculationmodel = new mongoose.Schema({
    expression: String,
    result: String,
    createdAt: { type: Date, default: Date.now }
});
const Calculation = mongoose.model('Calculation', calculationmodel);
app.post('/api/calculate', async (req, res) => {
    const { expression, result } = req.body;
    const newCalculation = new Calculation({ expression, result });
    await newCalculation.save();
    res.status(201).json(newCalculation);
});
app.get('/api/history', async (req, res) => {
    const history = await Calculation.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
});
app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
