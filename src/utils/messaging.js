import { messaging } from "../config/firebase";
import { getToken, onMessage } from "firebase/messaging";

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BGRog7wUoUPgDEyGqnkQVgg9f6XDAaqG-AvTK5alui1z5gDfbNfM0C9DLRAfTwQ7Tx2ynXyf_JLRpKdaSR9yzjQ",
    });
    if (currentToken) {
      console.log("Token FCM récupéré :", currentToken);
      return currentToken;
    } else {
      console.log("Aucun token d'enregistrement disponible. Demandez la permission de générer un token.");
    }
  } catch (err) {
    console.log("Une erreur s'est produite lors de la récupération du token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message reçu en premier plan :", payload);
      resolve(payload);
    });
  });
