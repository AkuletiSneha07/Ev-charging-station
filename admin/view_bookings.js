
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore, collection, getDocs
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


async function loadBookings() {
  const tableBody = document.getElementById("bookingTableBody");
  tableBody.innerHTML = "";

  const snapshot = await getDocs(collection(db, "bookings"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    const bookedAt = data.bookedAt?.toDate?.().toLocaleString() || "N/A";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.name}</td>
      <td>${data.email}</td>
      <td>${data.mobile}</td>
      <td>${data.bunkName}</td>
      <td>${data.slotTime}</td>
      <td>${bookedAt}</td>
    `;
    tableBody.appendChild(row);
  });
}

loadBookings();
