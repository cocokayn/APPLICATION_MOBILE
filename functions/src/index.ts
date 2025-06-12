import * as functions from "firebase-functions";
import * as mysql from "mysql2/promise";
import cors from "cors";

// Config MySQL (host sans port séparé)
const dbConfig = {
  host: "127.0.0.1",       // IP ou hostname du serveur MySQL
  port: 3306,              // port MySQL (optionnel, par défaut 3306)
  user: "root",            // utilisateur MySQL
  password: "Caramel78300@",  // mot de passe MySQL
  database: "epfprojet",   // nom de la base de données
};

// Middleware CORS
const corsHandler = cors({ origin: true });

// Fonction GET : récupérer tous les utilisateurs
export const getUtilisateurs = functions.https.onRequest(async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM Utilisateur");
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur MySQL :", error);
    res.status(500).send("Erreur de base de données");
  }
});

// Fonction POST : créer un utilisateur (avec CORS)
export const createUtilisateur = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Méthode non autorisée");
    }

    const {
      nom,
      prenom,
      email,
      mdp,
      role = "intervenant",
      github = "",
      portfolio = "",
      date = new Date(),
    } = req.body;

    try {
      const connection = await mysql.createConnection(dbConfig);

      const query = `INSERT INTO Utilisateur (
        nom_utilisateur, prenom_utilisateur, email_utilisateur, mdp_utilisateur,
        role_utilisateur, github_utilisateur, portfolio_utilisateur, date_utilisateur
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      await connection.execute(query, [
        nom,
        prenom,
        email,
        mdp,
        role,
        github,
        portfolio,
        date,
      ]);

      await connection.end();

      res.status(201).send("Utilisateur ajouté");
    } catch (error) {
      console.error("Erreur MySQL :", error);
      res.status(500).send("Erreur serveur");
    }
  });
});
