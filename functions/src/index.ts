/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import * as mysql from "mysql2/promise";
import cors from 'cors';



// ⚠️ Remplace ces valeurs par celles de ta base locale ou distante
const dbConfig = {
  host: "127.0.0.1:3306",       // ou IP de ton serveur MySQL
  user: "root",            // ou autre utilisateur MySQL
  password: "Caramel78300@",            // mot de passe MySQL
  database: "epfprojet",   // le nom de ta base MySQL
};

export const getUtilisateurs = functions.https.onRequest(async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute("SELECT * FROM Utilisateur");

    res.status(200).json(rows);
    await connection.end();
  } catch (error) {
    console.error("Erreur MySQL :", error);
    res.status(500).send("Erreur de base de données");
  }
});

const corsHandler = cors({ origin: true });

export const createUtilisateur = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Méthode non autorisée');
    }

    const {
      nom, prenom, email, mdp, role = 'intervenant',
      github = '', portfolio = '', date = new Date()
    } = req.body;

    try {
      const connection = await mysql.createConnection(dbConfig);
      const query = `INSERT INTO Utilisateur (
        nom_utilisateur, prenom_utilisateur, email_utilisateur, mdp_utilisateur,
        role_utilisateur, github_utilisateur, portfolio_utilisateur, date_utilisateur
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      await connection.execute(query, [
        nom, prenom, email, mdp, role, github, portfolio, date
      ]);

      await connection.end();
      res.status(201).send('Utilisateur ajouté');
    } catch (error) {
      console.error('Erreur MySQL :', error);
      res.status(500).send('Erreur serveur');
    }
  });
});
