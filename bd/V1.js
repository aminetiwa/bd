const express = require('express');
const mysql = require('mysql2/promise'); 

const app = express();
app.use(express.json());

async function getConnection() {
    return await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "Avion",
    });
}

app.get('/categories', async (req, res) => {
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM categories');
    res.json(result);
});

app.get('/clients', async (req, res) => {
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM clients');
    res.json(result);
});

app.post('/commandes', async (req, res) => {
    const connection = await getConnection();
    const { client_id } = req.body;
    const sql = 'INSERT INTO commandes (client_id) VALUES (?)';
    await connection.query(sql, [client_id]);
    res.status(201).json({ message: 'Commande ajouter' });
});

app.get('/commandes', async (req, res) => {
    const connection = await getConnection();
    const [result] = await connection.query(`SELECT commandes.*, clients.nom FROM commandes 
                                             JOIN clients ON commandes.client_id = clients.id`);
    res.json(result);
});

app.get('/produits', async (req, res) => {
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM produits');
    res.json(result);
});

app.post('/produits', async (req, res) => {
    const connection = await getConnection();
    const { nom, reference, prix_unitaire, quantite_stock, categorie_id } = req.body;
    const sql = 'INSERT INTO produits (nom, reference, prix_unitaire, quantite_stock, categorie_id) VALUES (?, ?, ?, ?, ?)';
    await connection.query(sql, [nom, reference, prix_unitaire, quantite_stock, categorie_id]);
    res.status(201).json({ message: 'Produit ajouter' });
});

app.get('/fournisseurs', async (req, res) => {
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM fournisseurs');
    res.json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Serveur démarrer sur http://localhost:3000');
});
