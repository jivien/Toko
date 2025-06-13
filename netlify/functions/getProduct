// Kode ini berjalan di server Netlify, BUKAN di browser pengunjung.

// Kita menggunakan 'firebase-admin' khusus untuk backend
const admin = require('firebase-admin');

// Kunci rahasia ini akan kita simpan dengan aman di Netlify, bukan di sini.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Inisialisasi Firebase Admin hanya sekali agar efisien
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Ini adalah fungsi utama yang akan dijalankan oleh Netlify
exports.handler = async function(event, context) {
  try {
    // 1. Mengambil data produk
    const productsRef = db.collection('products');
    const productsSnapshot = await productsRef.orderBy('createdAt', 'desc').get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2. Mengambil data tema
    const themeRef = db.collection('settings').doc('theme');
    const themeDoc = await themeRef.get();
    const theme = themeDoc.exists ? themeDoc.data() : {};

    // 3. Menggabungkan keduanya dalam satu respons
    const responseData = {
      products: products,
      theme: theme
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gagal mengambil data dari server.' })
    };
  }
};
