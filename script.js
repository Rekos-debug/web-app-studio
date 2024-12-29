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
const tooltip = document.getElementById('tooltip');
const newArgomentoInput = document.getElementById('new-argomento');
const newPesoInput = document.getElementById('new-peso');
const confirmAddButton = document.getElementById('confirm-add');
const argomentiList = document.getElementById('argomenti-list');
const sorteggiaButton = document.getElementById('sorteggia-button');
const result = document.getElementById('result');

// Mostra la scritta di benvenuto con animazione
window.addEventListener('load', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.classList.remove('hidden');
});

// Mostra/nasconde la sezione di aggiunta
addButton.addEventListener('click', () => {
    addSection.classList.toggle('hidden');
});

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
    argomenti.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'argomento-item';
        li.textContent = item.testo;

        // Input per il peso
        const pesoInput = document.createElement('input');
        pesoInput.type = 'number';
        pesoInput.value = item.peso;
        pesoInput.addEventListener('change', () => aggiornaPeso(index, pesoInput.value));

        // Pulsante Rimuovi
        const rimuoviButton = document.createElement('button');
        rimuoviButton.textContent = 'Rimuovi';
        rimuoviButton.onclick = () => rimuoviArgomento(index);

        li.appendChild(pesoInput);
        li.appendChild(rimuoviButton);
        argomentiList.appendChild(li);
    });
}

// Aggiungi nuovo argomento
confirmAddButton.addEventListener('click', () => {
    const nuovoArgomento = newArgomentoInput.value.trim();
    const peso = parseInt(newPesoInput.value.trim()) || 1; // Default peso: 1
    if (nuovoArgomento) {
        const dbRef = ref(database, "argomenti");
        get(dbRef).then((snapshot) => {
            const argomenti = snapshot.exists() ? snapshot.val() : [];
            argomenti.push({ testo: nuovoArgomento, peso });
            set(dbRef, argomenti).then(() => {
                aggiornaListaArgomenti(argomenti);
                newArgomentoInput.value = '';
                newPesoInput.value = '';
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

// Aggiorna il peso
function aggiornaPeso(index, peso) {
    const dbRef = ref(database, "argomenti");
    get(dbRef).then((snapshot) => {
        const argomenti = snapshot.val();
        argomenti[index].peso = parseInt(peso) || 1; // Default peso: 1
        set(dbRef, argomenti);
    });
}

// Sorteggia un argomento ponderato
sorteggiaButton.addEventListener('click', () => {
    const dbRef = ref(database, "argomenti");
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const argomenti = snapshot.val();
            const ponderato = [];
            argomenti.forEach((item) => {
                for (let i = 0; i < item.peso; i++) {
                    ponderato.push(item.testo);
                }
            });
            const casuale = ponderato[Math.floor(Math.random() * ponderato.length)];
            result.textContent = `Argomento: ${casuale}`;
            result.classList.remove('hidden');
        } else {
            alert("Nessun argomento disponibile!");
        }
    });
});

// Inizializzazione
caricaArgomenti();
