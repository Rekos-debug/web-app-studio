import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCgER4IT8ypsTWBQAfpcOQtakrMUn4fzqo",
    authDomain: "database-argomenti-studio.firebaseapp.com",
    databaseURL: "https://database-argomenti-studio-default-rtdb.firebaseio.com",
    projectId: "database-argomenti-studio",
    storageBucket: "database-argomenti-studio.firebasestorage.app",
    messagingSenderId: "693225744695",
    appId: "1:693225744695:web:9aef511c10b20afad852b2"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Elementi della pagina
const welcomeMessage = document.getElementById('welcome-message');
const addButton = document.getElementById('add-button');
const addSection = document.getElementById('add-section');
const newArgomentoInput = document.getElementById('new-argomento');
const confirmAddButton = document.getElementById('confirm-add');
const sorteggiaButton = document.getElementById('sorteggia-button');
const result = document.getElementById('result');

// Animazione della scritta
window.onload = () => {
    welcomeMessage.classList.remove('hidden');
};

// Carica gli argomenti dal database
function caricaArgomenti() {
    const dbRef = ref(database);
    get(child(dbRef, "argomenti")).then((snapshot) => {
        if (snapshot.exists()) {
            localStorage.setItem('argomenti', JSON.stringify(snapshot.val()));
        }
    }).catch((error) => console.error("Errore nel caricamento:", error));
}
caricaArgomenti();

// Aggiungi nuovo argomento
addButton.addEventListener('click', () => {
    addSection.classList.toggle('hidden');
});

confirmAddButton.addEventListener('click', () => {
    const nuovoArgomento = newArgomentoInput.value.trim();
    if (nuovoArgomento) {
        const argomenti = JSON.parse(localStorage.getItem('argomenti') || '[]');
        argomenti.push(nuovoArgomento);
        set(ref(database, "argomenti"), argomenti).then(() => {
            localStorage.setItem('argomenti', JSON.stringify(argomenti));
            newArgomentoInput.value = '';
            addSection.classList.add('hidden');
        });
    }
});

// Sorteggia un argomento
sorteggiaButton.addEventListener('click', () => {
    const argomenti = JSON.parse(localStorage.getItem('argomenti') || '[]');
    if (argomenti.length === 0) {
        alert("Nessun argomento disponibile!");
        return;
    }
    const casuale = argomenti[Math.floor(Math.random() * argomenti.length)];
    result.textContent = `Argomento: ${casuale}`;
    result.classList.remove('hidden');
});
