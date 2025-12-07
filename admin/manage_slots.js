
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, deleteDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCfQUMdJwQfdI8ZaZBlQl4HwLWWxeYGvMQ",
  authDomain: "ev-rechargebunk.firebaseapp.com",
  projectId: "ev-rechargebunk",
  storageBucket: "ev-rechargebunk.appspot.com",
  messagingSenderId: "764152704644",
  appId: "1:764152704644:web:65bb52ba0aeb0632089cd1",
  measurementId: "G-PQ8Y60BXYF"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function loadSlots() {
  const tableBody = document.getElementById("slotTableBody");
  tableBody.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "slots"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${data.bunkName}</td>
      <td>${data.slotTimings.length}</td>
      <td>${data.slotTimings.join(", ")}</td>
      <td class="actions">
        <button onclick='editSlot("${docSnap.id}", ${JSON.stringify(data).replace(/"/g, '&quot;')})'>Edit</button>
        <button onclick="deleteSlot('${docSnap.id}')">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}


window.deleteSlot = async function (id) {
  if (confirm("Are you sure you want to delete this slot?")) {
    await deleteDoc(doc(db, "slots", id));
    loadSlots();
  }
};


window.editSlot = function (id, data) {
  document.getElementById("editForm").style.display = "block";
  document.getElementById("editSlotId").value = id;
  document.getElementById("editBunkName").value = data.bunkName;
  document.getElementById("editSlotTimings").value = data.slotTimings.join(", ");
};


window.cancelEdit = function () {
  document.getElementById("editForm").style.display = "none";
};


document.getElementById("editSlotForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("editSlotId").value;
  const bunkName = document.getElementById("editBunkName").value.trim();
  const slotTimings = document.getElementById("editSlotTimings").value.split(",").map(t => t.trim());

  await updateDoc(doc(db, "slots", id), {
    bunkName,
    slotTimings
  });

  document.getElementById("editForm").style.display = "none";
  loadSlots();
});


loadSlots();
