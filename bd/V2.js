const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Avion',
};

async function getConnection() {
    return await mysql.createConnection(dbConfig);
}


async function checkStock(produit_id, quantite) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT quantite_stock FROM produits WHERE id = ?', [produit_id]);
    await connection.end();
    return rows.length > 0 && rows[0].quantite_stock >= quantite;
}


async function updateStock(produit_id, quantite) {
    const connection = await getConnection();
    await connection.query('UPDATE produits SET quantite_stock = quantite_stock - ? WHERE id = ?', [quantite, produit_id]);
    await connection.end();
}


app.get('/produits', async (req, res) => {
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM produits');
    await connection.end();
    res.json(result);
});

app.post('/produits', async (req, res) => {
    const connection = await getConnection();
    const { nom, reference, prix_unitaire, quantite_stock, categorie_id } = req.body;
    await connection.query('INSERT INTO produits (nom, reference, prix_unitaire, quantite_stock, categorie_id) VALUES (?, ?, ?, ?, ?)', 
        [nom, reference, prix_unitaire, quantite_stock, categorie_id]);
    await connection.end();
    res.status(201).json({ message: 'Produit ajouter ' });
});


app.post('/commandes', async (req, res) => {
    const { client_id, produits } = req.body;
    
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const [commandeResult] = await connection.query('INSERT INTO commandes (client_id, date_commande) VALUES (?, NOW())', [client_id]);
        const commande_id = commandeResult.insertId;

        for (const produit of produits) {
            if (!await checkStock(produit.produit_id, produit.quantite)) {
                throw new Error(`Stock insuffisant pour le produit ID: ${produit.produit_id}`);
            }
            
            await connection.query('INSERT INTO lignes_commande (commande_id, produit_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
                [commande_id, produit.produit_id, produit.quantite, produit.prix_unitaire]);

            await updateStock(produit.produit_id, produit.quantite);
        }

        await connection.commit();
        res.status(201).json({ message: 'Commande enregistrer' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Erreur ajout de la commande', error: error.message });
    } finally {
        await connection.end();
    }
});


app.get('/clients/:id/commandes', async (req, res) => {
    const connection = await getConnection();
    const [result] = await connection.query(`SELECT commandes.*, clients.nom FROM commandes 
                                             JOIN clients ON commandes.client_id = clients.id
                                             WHERE clients.id = ?`, [req.params.id]);
    await connection.end();
    res.json(result);
});


app.get('/produits/:id/commandes', async (req, res) => {
    const connection = await getConnection();
    const [result] = await connection.query(`SELECT lignes_commande.*, commandes.date_commande FROM lignes_commande 
                                             JOIN commandes ON lignes_commande.commande_id = commandes.id
                                             WHERE lignes_commande.produit_id = ?`, [req.params.id]);
    await connection.end();
    res.json(result);
});


app.get('/commandes', async (req, res) => {
    const { start, end } = req.query;
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM commandes WHERE date_commande BETWEEN ? AND ?', [start, end]);
    await connection.end();
    res.json(result);
});


app.get('/produits/stock-faible', async (req, res) => {
    const seuil = req.query.seuil || 10;
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM produits WHERE quantite_stock < ?', [seuil]);
    await connection.end();
    res.json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarrer sur http://localhost:${PORT}`);
});
