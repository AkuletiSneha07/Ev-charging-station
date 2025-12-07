
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCfQUMdJwQfdI8ZaZBlQl4HwLWWxeYGvMQ",
  authDomain: "ev-rechargebunk.firebaseapp.com",
  projectId: "ev-rechargebunk",
  storageBucket: "ev-rechargebunk.appspot.com",
  messagingSenderId: "764152704644",
  appId: "1:764152704644:web:65bb52ba0aeb0632089cd1"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function showMessage(message, type = "success") {
  let msg = document.getElementById("responseMessage");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "responseMessage";
    document.querySelector(".form-container").prepend(msg);
  }

  msg.textContent = message;
  msg.style.color = type === "error" ? "red" : "green";
  msg.style.fontWeight = "bold";
  msg.style.marginBottom = "10px";
}


document.getElementById("createBunkForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const bunkName = document.getElementById("bunkName").value.trim();
  const location = document.getElementById("location").value.trim();
  const googleMapLink = document.getElementById("googleMapLink").value.trim();
  const mobile = document.getElementById("mobile").value.trim();

  try {
    await addDoc(collection(db, "bunks"), {
      bunkName,
      location,
      googleMapLink,
      mobile
    });
    showMessage("✅ Bunk created successfully!");
    document.getElementById("createBunkForm").reset();
  } catch (error) {
    showMessage("❌ Error creating bunk: " + error.message, "error");
  }
});
