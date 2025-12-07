
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";


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
  msgDiv.style.marginTop = "10px";
}


document.getElementById("userRegisterForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  
  if (email.endsWith("@admin.com") && role !== "admin") {
    showMessage("❌ Email ending with @admin.com must register as Admin only.");
    return;
  }

  if (!email.endsWith("@admin.com") && role === "admin") {
    showMessage("❌ Only  admin emails can register as Admin.");
    return;
  }

  
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role
      });

      showMessage("✅ Registered Successfully! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "../index.html?status=registered";
      }, 2000);
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        showMessage("⚠️ This email is already registered.");
      } else {
        showMessage("❌ Error: " + error.message);
      }
    });
});
