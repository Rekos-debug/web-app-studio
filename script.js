import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

const addButton = document.getElementById('add-button');
const addSection = document.getElementById('add-section');
const newMateriaInput = document.getElementById('new-materia');
const addMateriaButton = document.getElementById('add-materia-button');
const materieSelect = document.getElementById('materie-select');
const newArgomentoInput = document.getElementById('new-argomento');
const confirmAddButton = document.getElementById('confirm-add');
const argomentiList = document.getElementById('argomenti-list');
const sorteggiaButton = document.getElementById('sorteggia-button');
const materiaResult = document.getElementById('materia-result');
const result = document.getElementById('result');

let materie = {};

// Mostra/nasconde la sezione aggiungi
addButton.addEventListener('click', () => {
    addSection.classList.toggle('hidden');
});

function caricaMaterie() {
    const dbRef = ref(database);
    get(child(dbRef, "materie")).then(snapshot => {
        if (snapshot.exists()) {
            materie = snapshot.val();
            aggiornaMaterieSelect();
        }
    });
}

function aggiornaMaterieSelect() {
    materieSelect.innerHTML = '<option value="">Seleziona una materia</option>';
    for (const materia in materie) {
        const option = document.createElement('option');
        option.value = materia;
        option.textContent = materia;
        materieSelect.appendChild(option);
    }
}

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

materieSelect.addEventListener('change', () => {
    const materiaSelezionata = materieSelect.value;
    if (materiaSelezionata) {
        aggiornaListaArgomenti(materie[materiaSelezionata]);
    } else {
        argomentiList.innerHTML = '';
    }
});

function aggiornaListaArgomenti(argomenti) {
    argomentiList.innerHTML = '';
    argomenti.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;

        const rimuoviButton = document.createElement('button');
        rimuoviButton.textContent = 'Rimuovi';
        rimuoviButton.onclick = () => rimuoviArgomento(index);

        li.appendChild(rimuoviButton);
        argomentiList.appendChild(li);
    });

    // Forza lo scroll verso il basso
    scrollToBottom(argomentiList);
}

function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

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

function rimuoviArgomento(index) {
    const materiaSelezionata = materieSelect.value;
    if (materiaSelezionata) {
        materie[materiaSelezionata].splice(index, 1);
        set(ref(database, "materie"), materie).then(() => {
            aggiornaListaArgomenti(materie[materiaSelezionata]);
        });
    }
}

sorteggiaButton.addEventListener('click', () => {
    const tuttiArgomenti = [];
    for (const materia in materie) {
        materie[materia].forEach(argomento => {
            const match = argomento.match(/^(\d+)\s+(.*)$/);
            if (match) {
                const peso = parseInt(match[1], 10);
                const testo = match[2];
                for (let i = 0; i < peso; i++) {
                    tuttiArgomenti.push({ materia, testo });
                }
            }
        });
    }

    if (tuttiArgomenti.length === 0) {
        alert("Nessun argomento disponibile!");
        return;
    }

    const casuale = tuttiArgomenti[Math.floor(Math.random() * tuttiArgomenti.length)];
    materiaResult.textContent = `Materia: ${casuale.materia}`;
    result.textContent = `Argomento: ${casuale.testo}`;
    materiaResult.classList.remove('hidden');
    result.classList.remove('hidden');
});

caricaMaterie();
