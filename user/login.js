
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";


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


function showMessage(msg, type = "error") {
  const msgDiv = document.getElementById("message");
  msgDiv.textContent = msg;
  msgDiv.style.color = type === "error" ? "red" : "green";
  msgDiv.style.fontWeight = "bold";
}


document.getElementById("userLoginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("✅ Login successful!", "success");
      setTimeout(() => {
        window.location.href = "../user/home.html"; 
      }, 1500);
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        showMessage("❌ User not found.");
      } else if (error.code === "auth/wrong-password") {
        showMessage("❌ Incorrect password.");
      } else {
        showMessage("❌ " + error.message);
      }
    });
});
