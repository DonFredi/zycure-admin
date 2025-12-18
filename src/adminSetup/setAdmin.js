// src/adminSetup/setAdmin.js
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

// Load service account JSON
const serviceAccountPath = path.join(process.cwd(), "src/adminSetup/serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = getAuth();

// Replace with the UID of the user you want to make admin
const uid = "ekAWZLcbXVewOMijnRaTQoloxT82";

async function setAdmin() {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log("Admin role added to:", uid);
  } catch (error) {
    console.error("Error:", error);
  }
}

setAdmin();
