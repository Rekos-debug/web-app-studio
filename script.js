document.getElementById('bottone-sorteggia').addEventListener('click', () => {
    const argomenti = document.getElementById('input-argomenti').value.split('\n').filter(a => a.trim() !== '');
    if (argomenti.length === 0) {
        alert('Inserisci almeno un argomento!');
        return;
    }
    const casuale = argomenti[Math.floor(Math.random() * argomenti.length)];
    document.getElementById('risultato').innerText = `Argomento sorteggiato: ${casuale}`;
});
