// Script d'initialisation pour MongoDB dans Docker
db = db.getSiblingDB('bibliotheque');

// Créer les collections
db.createCollection('users');
db.createCollection('livres');
db.createCollection('membres');
db.createCollection('emprunts');

// Données d'initialisation
db.users.insertOne({
  nom: 'Administrateur',
  email: 'admin@bibliotheque.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdCvWfDP3e0gLgK', // admin123
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
});

db.livres.insertMany([
  {
    isbn: '978-2-07-036822-8',
    titre: 'L\'Étranger',
    auteur: 'Albert Camus',
    editeur: 'Gallimard',
    anneePublication: 1942,
    genre: 'Roman',
    disponible: true,
    description: 'Un classique de la littérature française',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    isbn: '978-2-253-04081-2',
    titre: '1984',
    auteur: 'George Orwell',
    editeur: 'Folio',
    anneePublication: 1949,
    genre: 'Science-Fiction',
    disponible: true,
    description: 'Dystopie célèbre sur un régime totalitaire',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    isbn: '978-2-266-28656-8',
    titre: 'Le Seigneur des Anneaux',
    auteur: 'J.R.R. Tolkien',
    editeur: 'Pocket',
    anneePublication: 1954,
    genre: 'Fantasy',
    disponible: true,
    description: 'Épopée fantastique en Terre du Milieu',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print(' Base de données initialisée avec succès');