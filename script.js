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
const paginationContainer = document.getElementById('pagination');
const sorteggiaButton = document.getElementById('sorteggia-button');
const materiaResult = document.getElementById('materia-result');
const result = document.getElementById('result');

let materie = {};
let currentPage = 1;
const itemsPerPage = 5; // Numero massimo di elementi per pagina

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
    currentPage = 1; // Resetta alla prima pagina
    if (materiaSelezionata) {
        aggiornaListaArgomenti(materie[materiaSelezionata]);
    } else {
        argomentiList.innerHTML = '';
        paginationContainer.innerHTML = '';
    }
});

function aggiornaListaArgomenti(argomenti) {
    argomentiList.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedArgomenti = argomenti.slice(startIndex, endIndex);

    paginatedArgomenti.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;

        const rimuoviButton = document.createElement('button');
        rimuoviButton.textContent = 'Rimuovi';
        rimuoviButton.onclick = () => rimuoviArgomento(startIndex + index);

        li.appendChild(rimuoviButton);
        argomentiList.appendChild(li);
    });

    aggiornaPaginazione(argomenti.length);
}

function aggiornaPaginazione(totalItems) {
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages > 1) {
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Precedente';
            prevButton.onclick = () => {
                currentPage--;
                aggiornaListaArgomenti(materie[materieSelect.value]);
            };
            paginationContainer.appendChild(prevButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Successivo';
            nextButton.onclick = () => {
                currentPage++;
                aggiornaListaArgomenti(materie[materieSelect.value]);
            };
            paginationContainer.appendChild(nextButton);
        }
    }
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
