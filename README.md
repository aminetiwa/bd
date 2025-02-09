# 📌 API Gestion de Stock (Base de Données `Avion`)

## 📖 **Description**
Cette API permet de gérer un stock de produits, les commandes clients et les fournisseurs en s'appuyant sur la base de données `Avion`. Elle offre des fonctionnalités avancées comme la gestion automatique du stock, la recherche multicritères.

## 🚀 **Installation et Lancement**
### 1️⃣ Prérequis
- Node.js installé
- MySQL installé et configuré
- express
- mysql2/promise
- dotenv

### 2️⃣ Installation
```bash
npm install express
npm install mysql2
npm install promise
npm install dotenv
```

### 3️⃣ Lancer l’API
```bash
node V1.js
node V2.js
```

L’API tournera sur `http://localhost:3000`

---

## 📌 **Liste des Endpoints**

### 🛍 **Produits**
#### ✅ Lister tous les produits
- **Méthode:** `GET`
- **URL:** `http://localhost:3000/produits`
- **Réponse:**
  ```json
  [
      { "id": 1, "nom": "PC Portable HP", "prix_unitaire": 799.99, "quantite_stock": 10, "categorie_id": 1 }
  ]
  ```

#### ✅ Ajouter un produit
- **Méthode:** `POST`
- **URL:** `http://localhost:3000/produits`
- **Body:**
  ```json
  {
      "nom": "Souris Logitech", "reference": "LOGI678", "prix_unitaire": 29.99, "quantite_stock": 50, "categorie_id": 2
  }
  ```
- **Réponse:**
  ```json
  { "message": "Produit ajouté" }
  ```

---

### 📦 **Commandes**
#### ✅ Lister les commandes par période
- **Méthode:** `GET`
- **URL:** `http://localhost:3000/commandes?start=2025-01-01&end=2025-12-31`
- **Réponse:**
  ```json
  [
      { "id": 1, "client_id": 1, "date_commande": "2025-01-30 15:48:04" }
  ]
  ```

#### ✅ Créer une commande
- **Méthode:** `POST`
- **URL:** `http://localhost:3000/commandes`
- **Body:**
  ```json
  {
      "client_id": 1,
      "produits": [
          { "produit_id": 1, "quantite": 1, "prix_unitaire": 799.99 }
      ]
  }
  ```
- **Réponse:**
  ```json
  { "message": "Commande enregistrée" }
  ```

---

### 👤 **Clients**
#### ✅ Lister les commandes d’un client
- **Méthode:** `GET`
- **URL:** `http://localhost:3000/clients/1/commandes`
- **Réponse:**
  ```json
  [
      { "id": 1, "client_id": 1, "date_commande": "2025-01-30 15:48:04" }
  ]
  ```

### 🚨 **Gestion du stock**
#### ✅ Vérifier les produits en stock faible
- **Méthode:** `GET`
- **URL:** `http://localhost:3000/produits/stock-faible?seuil=10`
- **Réponse:**
  ```json
  [
      { "id": 4, "nom": "Processeur Intel i7", "quantite_stock": 5 }
  ]
  ```
🚀 **API prête à l’emploi pour la gestion du stock et des commandes !**

