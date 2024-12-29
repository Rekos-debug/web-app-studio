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
const addButton = document.getElementById('add-button');
const addSection = document.getElementById('add-section');
const newArgomentoInput = document.getElementById('new-argomento');
const confirmAddButton = document.getElementById('confirm-add');
const argomentiList = document.getElementById('argomenti-list');
const sorteggiaButton = document.getElementById('sorteggia-button');
const result = document.getElementById('result');

// Carica argomenti dal database
function caricaArgomenti() {
    const dbRef = ref(database);
    get(child(dbRef, "argomenti")).then((snapshot) => {
        if (snapshot.exists()) {
            aggiornaListaArgomenti(snapshot.val());
        }
    });
}

// Aggiorna la lista degli argomenti
function aggiornaListaArgomenti(argomenti) {
    argomentiList.innerHTML = '';
    argomenti.forEach((argomento, index) => {
        const li = document.createElement('li');
        li.textContent = argomento;

        const rimuoviButton = document.createElement('button');
        rimuoviButton.textContent = 'Rimuovi';
        rimuoviButton.onclick = () => rimuoviArgomento(index);

        li.appendChild(rimuoviButton);
        argomentiList.appendChild(li);
    });
}

// Aggiungi nuovo argomento
confirmAddButton.addEventListener('click', () => {
    const nuovoArgomento = newArgomentoInput.value.trim();
    if (nuovoArgomento) {
        const dbRef = ref(database, "argomenti");
        get(dbRef).then((snapshot) => {
            const argomenti = snapshot.exists() ? snapshot.val() : [];
            argomenti.push(nuovoArgomento);
            set(dbRef, argomenti).then(() => {
                aggiornaListaArgomenti(argomenti);
                newArgomentoInput.value = '';
            });
        });
    }
});

// Rimuovi argomento
function rimuoviArgomento(index) {
    const dbRef = ref(database, "argomenti");
    get(dbRef).then((snapshot) => {
        const argomenti = snapshot.val();
        argomenti.splice(index, 1);
        set(dbRef, argomenti).then(() => aggiornaListaArgomenti(argomenti));
    });
}

// Sorteggia un argomento
sorteggiaButton.addEventListener('click', () => {
    const dbRef = ref(database, "argomenti");
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const argomenti = snapshot.val();
            const casuale = argomenti[Math.floor(Math.random() * argomenti.length)];
            result.textContent = `Argomento: ${casuale}`;
            result.classList.remove('hidden');
        } else {
            alert("Nessun argomento disponibile!");
        }
    });
});

// Inizializzazione
caricaArgomenti();
