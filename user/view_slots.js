
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
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
document.getElementById("bunkTitle").textContent = `Available Slots for ${bunkName}`;


function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}


async function isSlotBooked(bunk, slotTime) {
  const today = getTodayDate();
  const bookingsRef = collection(db, "bookings");

  const q = query(
    bookingsRef,
    where("bunkName", "==", bunk),
    where("slotTime", "==", slotTime),
    where("bookingDate", "==", today)
  );

  const snapshot = await getDocs(q);
  return snapshot.size > 0;
}


function isSlotExpired(slotTime) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const endTimeStr = slotTime.split("-")[1]?.trim();
  if (!endTimeStr) return false;

  const timeWithSpace = endTimeStr.replace(/(Am|Pm)/i, (match) =>
    match.toLowerCase() === "pm" ? " PM" : " AM"
  );

  const parsedEndTime = new Date(`${today} ${timeWithSpace}`);

  return parsedEndTime.getTime() < now.getTime();
}


async function loadSlots() {
  const slotList = document.getElementById("slotList");
  slotList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "slots"));
  for (const doc of querySnapshot.docs) {
    const data = doc.data();

    if (data.bunkName === bunkName) {
      for (const timing of data.slotTimings) {
        const li = document.createElement("li");
        const expired = isSlotExpired(timing);
        const booked = await isSlotBooked(bunkName, timing);

        if (booked && !expired) {
          li.innerHTML = `${timing} <span style="color: red;">(Booked)</span>`;
        } else {
          li.innerHTML = `${timing} <button onclick="bookSlot('${bunkName}', '${timing}')">Book</button>`;
        }

        slotList.appendChild(li);
      }
    }
  }
}


window.bookSlot = function (bunk, time) {
  window.location.href = `booking.html?bunk=${encodeURIComponent(bunk)}&slot=${encodeURIComponent(time)}`;
};


loadSlots();
