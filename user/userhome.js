
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";


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

let allBunks = [];


async function loadBunks() {
  const bunkTableBody = document.getElementById("bunkTableBody");
  bunkTableBody.innerHTML = "";
  allBunks = [];

  const querySnapshot = await getDocs(collection(db, "bunks"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    allBunks.push(data);
  });

  displayBunks(allBunks);
}




function displayBunks(bunks) {
  const bunkTableBody = document.getElementById("bunkTableBody");
  bunkTableBody.innerHTML = "";

  bunks.forEach((data) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${data.bunkName}</td>
      <td>${data.location}</td>
      <td>${data.mobile}</td>
      <td><a href="${data.mapLink}" target="_blank">View Map</a></td>
    `;

    const actionTd = document.createElement("td");
    const viewButton = document.createElement("button");
    viewButton.textContent = "View Slots";
    viewButton.addEventListener("click", () => {
      window.location.href = `view_slots.html?bunk=${encodeURIComponent(data.bunkName)}`;
    });

    actionTd.appendChild(viewButton);
    tr.appendChild(actionTd);
    bunkTableBody.appendChild(tr);
  });
}



window.filterBunks = function () {
  const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = allBunks.filter(bunk =>
    bunk.location && bunk.location.toLowerCase().includes(searchValue)
  );
  displayBunks(filtered);
};

window.viewSlots = function (bunkName) {
  window.location.href = `view_slots.html?bunk=${encodeURIComponent(bunkName)}`;
};




loadBunks();

