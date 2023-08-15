var admin = require("firebase-admin");

var serviceAccount = require("../config/pizza-delivery-app-4c8bb-firebase-adminsdk-j4p4o-471c62599d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
