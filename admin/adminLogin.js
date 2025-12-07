import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCfQUMdJwQfdI8ZaZBlQl4HwLWWxeYGvMQ",
  authDomain: "ev-rechargebunk.firebaseapp.com",
  projectId: "ev-rechargebunk",
  storageBucket: "ev-rechargebunk.appspot.com",
  messagingSenderId: "764152704644",
  appId: "1:764152704644:web:65bb52ba0aeb0632089cd1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


function showMessage(msg, type = "error") {
  const msgDiv = document.getElementById("message");
  msgDiv.textContent = msg;
  msgDiv.style.color = type === "success" ? "green" : "red";
  msgDiv.style.fontWeight = "bold";
}


document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  
  if (!email.endsWith("@admin.com")) {
    showMessage("❌ Only @admin emails are allowed.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const uid = userCredential.user.uid;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "admin") {
          showMessage("✅ Login successful", "success");
          setTimeout(() => {
            window.location.href = "adminHome.html";
          }, 1500);
        } else {
          showMessage("❌ Not authorized. Not an admin.");
        }
      } else {
        showMessage("❌ Admin details not found in database.");
      }
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        showMessage("❌ User not found.");
      } else if (error.code === "auth/wrong-password") {
        showMessage("❌ Wrong password.");
      } else {
        showMessage("❌ " + error.message);
      }
    });
});
