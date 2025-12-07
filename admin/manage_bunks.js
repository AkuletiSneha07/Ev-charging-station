
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
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


async function loadBunks() {
  const bunkTable = document.getElementById("bunkTableBody");
  const messageDiv = document.getElementById("message");
  bunkTable.innerHTML = "";
  messageDiv.textContent = "";

  try {
    const snapshot = await getDocs(collection(db, "bunks"));
    if (snapshot.empty) {
      messageDiv.textContent = "⚠️ No bunk data found.";
      messageDiv.style.color = "orange";
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const tr = document.createElement("tr");

    
         tr.innerHTML = `
            <td>${data.bunkName}</td>
            <td>${data.location}</td>
            <td>${data.mobile}</td>
            <td><a href="${data.mapLink}" target="_blank">Map</a></td>
            <td><div class="action-buttons"><button onclick="editBunk('${docSnap.id}', '${data.bunkName}', '${data.location}', '${data.mobile}', '${data.mapLink}')">Edit</button><button onclick="deleteBunk('${docSnap.id}')">Delete</button></div></td>
`         ;

      bunkTable.appendChild(tr);
    });
  } catch (err) {
    messageDiv.textContent = "❌ Error: " + err.message;
    messageDiv.style.color = "red";
  }
}


window.deleteBunk = async function (id) {
  if (confirm("Are you sure you want to delete this bunk?")) {
    await deleteDoc(doc(db, "bunks", id));
    alert("✅ Bunk deleted.");
    loadBunks();
  }
};


window.editBunk = function (id, name, location, mobile, mapLink) {
  document.getElementById("editFormModal").style.display = "block";
  document.getElementById("editBunkId").value = id;
  document.getElementById("editBunkName").value = name;
  document.getElementById("editLocation").value = location;
  document.getElementById("editMobile").value = mobile;
  document.getElementById("editMapLink").value = mapLink;
};


window.cancelEdit = function () {
  document.getElementById("editFormModal").style.display = "none";
};


document.getElementById("editBunkForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const id = document.getElementById("editBunkId").value;
  const name = document.getElementById("editBunkName").value.trim();
  const location = document.getElementById("editLocation").value.trim();
  const mobile = document.getElementById("editMobile").value.trim();
  const mapLink = document.getElementById("editMapLink").value.trim();

  try {
    await updateDoc(doc(db, "bunks", id), {
      bunkName: name,
      location: location,
      mobile: mobile,
      mapLink: mapLink
    });

    alert("✅ Bunk updated.");
    document.getElementById("editFormModal").style.display = "none";
    loadBunks();
  } catch (err) {
    alert("❌ Failed to update: " + err.message);
  }
});


loadBunks();
