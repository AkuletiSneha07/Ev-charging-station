
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, query, where, Timestamp
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


const params = new URLSearchParams(window.location.search);
const bunkName = decodeURIComponent(params.get("bunk"));
const slotTime = decodeURIComponent(params.get("slot"));

document.getElementById("slotInfo").textContent = `Booking slot: ${bunkName} - ${slotTime}`;


function getBookingDate(timeString) {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const endTimeStr = timeString.split("-")[1]?.trim();
  if (!endTimeStr) return todayStr;

  const dateTimeStr = `${todayStr} ${endTimeStr}`;
  const parsed = new Date(Date.parse(dateTimeStr.replace(/(Am|Pm)/i, match =>
    match.toLowerCase() === "pm" ? " PM" : " AM"
  )));

  
  if (parsed < now) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  return todayStr;
}


async function isSlotBooked(bunk, slotTime, bookingDate) {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef,
    where("bunkName", "==", bunk),
    where("slotTime", "==", slotTime),
    where("bookingDate", "==", bookingDate)
  );
  const snapshot = await getDocs(q);
  return snapshot.size > 0;
}


document.getElementById("bookingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const message = document.getElementById("message");

  const bookingDate = getBookingDate(slotTime); // Decide if today or tomorrow

  const alreadyBooked = await isSlotBooked(bunkName, slotTime, bookingDate);

  if (alreadyBooked) {
    message.textContent = `❌ Slot already booked for ${bookingDate}.`;
    message.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "bookings"), {
      bunkName,
      slotTime,
      name,
      email,
      mobile,
      bookedAt: Timestamp.now(),
      bookingDate
    });

    message.textContent = `✅ Booking successful for ${bookingDate}!`;
    message.style.color = "green";
    document.getElementById("bookingForm").reset();
  } catch (error) {
    console.error(error);
    message.textContent = "❌ Booking failed. Try again.";
    message.style.color = "red";
  }
});

