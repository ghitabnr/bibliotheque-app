const mongoose = require('mongoose');
const User = require('./models/User');
const Livre = require('./models/Livre');
const Membre = require('./models/Membre');
require('dotenv').config();

const initData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connecté à MongoDB pour l\'initialisation');

    // Nettoyer les collections
    await User.deleteMany({});
    await Livre.deleteMany({});
    await Membre.deleteMany({});

    // Créer un utilisateur admin
    const admin = await User.create({
      nom: 'Administrateur',
      email: 'admin@bibliotheque.com',
      password: 'admin123',
      role: 'admin'
    });

    // Créer des livres
    const livres = await Livre.create([
      {
        isbn: '978-2-07-036822-8',
        titre: 'L\'Étranger',
        auteur: 'Albert Camus',
        editeur: 'Gallimard',
        anneePublication: 1942,
        genre: 'Roman',
        disponible: true,
        description: 'Un classique de la littérature française'
      },
      {
        isbn: '978-2-253-04081-2',
        titre: '1984',
        auteur: 'George Orwell',
        editeur: 'Folio',
        anneePublication: 1949,
        genre: 'Science-Fiction',
        disponible: true,
        description: 'Dystopie célèbre sur un régime totalitaire'
      },
      {
        isbn: '978-2-266-28656-8',
        titre: 'Le Seigneur des Anneaux',
        auteur: 'J.R.R. Tolkien',
        editeur: 'Pocket',
        anneePublication: 1954,
        genre: 'Fantasy',
        disponible: true,
        description: 'Épopée fantastique en Terre du Milieu'
      }
    ]);

    // Créer des membres avec save() pour déclencher le middleware
    const membre1 = new Membre({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@email.com',
      telephone: '01 23 45 67 89',
      adresse: {
        rue: '123 Avenue des Champs',
        ville: 'Paris',
        codePostal: '75008'
      }
    });
    await membre1.save();

    const membre2 = new Membre({
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'pierre.martin@email.com',
      telephone: '06 12 34 56 78',
      adresse: {
        rue: '456 Rue de la République',
        ville: 'Lyon',
        codePostal: '69001'
      }
    });
    await membre2.save();

    console.log(' Données d\'initialisation créées:');
    console.log(`   - 1 administrateur (admin@bibliotheque.com / admin123)`);
    console.log(`   - ${livres.length} livres`);
    console.log(`   - 2 membres avec numéros: ${membre1.numeroMembre}, ${membre2.numeroMembre}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

initData();