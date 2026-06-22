const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Rappel automatique le 15 de chaque mois
exports.scheduledPaymentReminder = functions.pubsub
  .schedule('0 9 15 * *')
  .timeZone('Indian/Antananarivo')
  .onRun(async (context) => {
    const db = admin.firestore();
    const moisNoms = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
    const now = new Date();
    const currentMonthLabel = moisNoms[now.getMonth()] + ' ' + now.getFullYear();

    const clientsSnapshot = await db.collection('clients').get();
    const paymentsSnapshot = await db.collection('paiements')
      .where('mois', '==', currentMonthLabel)
      .get();

    const paidClientIds = new Set();
    paymentsSnapshot.forEach(doc => paidClientIds.add(doc.data().clientId));

    const notifications = [];
    clientsSnapshot.forEach((doc) => {
      const client = doc.data();
      if (!paidClientIds.has(doc.id) && client.fcmToken) {
        notifications.push(admin.messaging().send({
          notification: {
            title: 'Rappel de paiement ElecPay',
            body: 'Bonjour ' + client.nom + ', nous sommes le 15. Votre paiement est en attente.',
          },
          token: client.fcmToken,
        }));
      }
    });

    return Promise.all(notifications);
  });

// Rappel manuel déclenché depuis le dashboard admin

  try {
    const db = admin.firestore();
    const selMois = data.mois;

    if (!selMois) {
      throw new functions.https.HttpsError('invalid-argument', 'Le mois est requis.');
    }

    const clientsSnapshot = await db.collection('clients').get();
    const paymentsSnapshot = await db.collection('paiements')
      .where('mois', '==', selMois)
      .get();

    const paidClientIds = new Set();
    paymentsSnapshot.forEach(doc => paidClientIds.add(doc.data().clientId));

    let successCount = 0;
    const errors = [];
    const promises = [];

    clientsSnapshot.forEach(doc => {
      const client = doc.data();
      if (!paidClientIds.has(doc.id) && client.fcmToken) {
        const p = admin.messaging().send({
          notification: {
            title: 'Rappel de paiement ElecPay',
            body: `Bonjour ${client.nom}, votre paiement pour ${selMois} est en attente.`,
          },
          token: client.fcmToken,
        })
          .then(() => { successCount++; })
          .catch(err => {
            console.error('Failed to send reminder to', client.nom, err);
            errors.push({ clientId: doc.id, error: err.message || err.code });
          });
        promises.push(p);
      }
    });

    await Promise.all(promises);
    return { success: true, sent: successCount, failures: errors };
  } catch (err) {
    console.error('sendManualReminders internal error:', err);
    throw new functions.https.HttpsError('internal', err.message || 'Erreur interne');
  };
