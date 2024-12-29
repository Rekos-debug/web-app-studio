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

const newMateriaInput = document.getElementById('new-materia');
const addMateriaButton = document.getElementById('add-materia-button');
const materieSelect = document.getElementById('materie-select');
const addSection = document.getElementById('add-section');
const newArgomentoInput = document.getElementById('new-argomento');
const confirmAddButton = document.getElementById('confirm-add');
const argomentiList = document.getElementById('argomenti-list');
const sorteggiaButton = document.getElementById('sorteggia-button');
const materiaResult = document.getElementById('materia-result');
const result = document.getElementById('result');

let materie = {};

// Carica materie dal database
function caricaMaterie() {
    const dbRef = ref(database);
    get(child(dbRef, "materie")).then(snapshot => {
        if (snapshot.exists()) {
            materie = snapshot.val();
            aggiornaMaterieSelect();
        }
    });
}

// Aggiorna il menu a tendina delle materie
function aggiornaMaterieSelect() {
    materieSelect.innerHTML = '<option value="">Seleziona una materia</option>';
    for (const materia in materie) {
        const option = document.createElement('option');
        option.value = materia;
        option.textContent = materia;
        materieSelect.appendChild(option);
    }
}

// Aggiungi una nuova materia
addMateriaButton.addEventListener('click', () => {
    const nuovaMateria = newMateriaInput.value.trim();
    if (nuovaMateria && !materie[nuovaMateria]) {
        materie[nuovaMateria] = [];
        set(ref(database, "materie"), materie).then(() => {
            newMateriaInput.value = '';
            aggiornaMaterieSelect();
        });
    }
});

// Mostra la lista degli argomenti di una materia selezionata
materieSelect.addEventListener('change', () => {
    const materiaSelezionata = materieSelect.value;
    if (materiaSelezionata) {
        aggiornaListaArgomenti(materie[materiaSelezionata]);
    } else {
        argomentiList.innerHTML = '';
    }
});

// Aggiorna la lista degli argomenti
function aggiornaListaArgomenti(argomenti) {
    argomentiList.innerHTML = '';
    argomenti.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;

        // Pulsante Rimuovi
        const rimuoviButton = document.createElement('button');
        rimuoviButton.textContent = 'Rimuovi';
        rimuoviButton.onclick = () => rimuoviArgomento(index);

        li.appendChild(rimuoviButton);
        argomentiList.appendChild(li);
    });

    scrollToBottom(argomentiList); // Scorri fino all'ultimo elemento
}

// Aggiungi nuovo argomento alla materia selezionata
confirmAddButton.addEventListener('click', () => {
    const materiaSelezionata = materieSelect.value;
    const nuovoArgomento = newArgomentoInput.value.trim();
    if (materiaSelezionata && nuovoArgomento) {
        materie[materiaSelezionata].push(nuovoArgomento);
        set(ref(database, "materie"), materie).then(() => {
            newArgomentoInput.value = '';
            aggiornaListaArgomenti(materie[materiaSelezionata]);
        });
    }
});

// Rimuovi argomento dalla materia selezionata
function rimuoviArgomento(index) {
    const materiaSelezionata = materieSelect.value;
    if (materiaSelezionata) {
        materie[materiaSelezionata].splice(index, 1);
        set(ref(database, "materie"), materie).then(() => {
            aggiornaListaArgomenti(materie[materiaSelezionata]);
        });
    }
}

// Scorri fino all'ultimo elemento della lista
function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

// Inizializzazione
caricaMaterie();
