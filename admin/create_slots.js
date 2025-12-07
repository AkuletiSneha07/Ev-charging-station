import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore, collection, addDoc
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


const slotCountInput = document.getElementById("slotCount");
const slotsContainer = document.getElementById("slotsContainer");
const form = document.getElementById("slotForm");
const message = document.getElementById("message");


slotCountInput.addEventListener("input", () => {
  const count = parseInt(slotCountInput.value);
  slotsContainer.innerHTML = "";

  if (count > 0) {
    for (let i = 1; i <= count; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Slot ${i} Timing (e.g., 10:00 AM - 11:00 AM)`;
      input.required = true;
      input.name = `slot${i}`;
      input.classList.add("slot-input");
      slotsContainer.appendChild(input);
      slotsContainer.appendChild(document.createElement("br"));
    }
  }
});


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bunkName = document.getElementById("bunkName").value.trim();
  const slotInputs = document.querySelectorAll(".slot-input");

  const slots = [];
  slotInputs.forEach((input) => {
    if (input.value.trim() !== "") {
      slots.push(input.value.trim());
    }
  });

  if (slots.length === 0) {
    message.textContent = "❌ Please enter valid slot timings.";
    message.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "slots"), {
      bunkName: bunkName,
      slotTimings: slots,
      createdAt: new Date()
    });
    message.textContent = "✅ Slots created successfully!";
    message.style.color = "green";
    form.reset();
    slotsContainer.innerHTML = "";
  } catch (error) {
    message.textContent = "❌ Error: " + error.message;
    message.style.color = "red";
  }
});
