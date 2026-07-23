const express = require("express");
const QRCode = require("qrcode");
const { db, auth } = require("../config/firebaseAdmin");

const router = express.Router();

/**
 * POST /api/users/register
 * Body: { idToken, name, phone }
 * Verifies the Firebase ID token issued after OTP verification, then
 * creates/updates the user's profile document in Firestore.
 */
router.post("/register", async (req, res) => {
  try {
    const { idToken, name, phone } = req.body;
    if (!idToken || !name) {
      return res.status(400).json({ error: "idToken and name are required" });
    }

    const decoded = await auth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const verifiedPhone = decoded.phone_number || phone;

    const userDoc = {
      uid,
      name,
      phone: verifiedPhone,
      updatedAt: new Date().toISOString(),
    };

    const ref = db.collection("users").doc(uid);
    const existing = await ref.get();
    if (!existing.exists) {
      userDoc.createdAt = userDoc.updatedAt;
    }

    await ref.set(userDoc, { merge: true });

    return res.status(200).json(userDoc);
  } catch (error) {
    console.error("register error:", error);
    return res.status(401).json({ error: "Invalid token or registration failed" });
  }
});

/**
 * GET /api/users/:uid
 * Returns a user's public profile (name + phone) by their Firebase uid.
 */
router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(doc.data());
  } catch (error) {
    console.error("get user error:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

/**
 * GET /api/users/:uid/qrcode
 * Returns a PNG image of the QR code encoding "tel:<phone>" for this user.
 * Useful for sharing the QR outside the app (e.g. printing, embedding on a web profile).
 */
router.get("/:uid/qrcode", async (req, res) => {
  try {
    const { uid } = req.params;
    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    const { phone } = doc.data();
    const qrBuffer = await QRCode.toBuffer(`tel:${phone}`, {
      type: "png",
      width: 512,
      margin: 2,
    });
    res.set("Content-Type", "image/png");
    return res.send(qrBuffer);
  } catch (error) {
    console.error("qrcode error:", error);
    return res.status(500).json({ error: "Failed to generate QR code" });
  }
});

module.exports = router;
