document.getElementById('save').addEventListener('click', () => {
    const original = document.getElementById('original').value;
    const replacement = document.getElementById('replacement').value;
  
    if (original && replacement) {
      chrome.storage.sync.get({ history: [] }, (data) => {
        const history = data.history;
        history.push({ original, replacement });
  
        chrome.storage.sync.set({ history }, () => {
          alert('Words saved!');
          displayHistory();
          refreshCurrentTab();
        });
      });
    } else {
      alert('Please enter both original and replacement words.');
    }
  });
  
  document.getElementById('add-pair').addEventListener('click', () => {
    const wordPairs = document.getElementById('word-pairs');
    const wordPair = document.createElement('div');
    wordPair.classList.add('word-pair');
    wordPair.innerHTML = `
      <label data-lang="original-label">Edytowane słowo:</label>
      <input type="text" class="multi-original">
      <label data-lang="replacement-label">Docelowe słowo:</label>
      <input type="text" class="multi-replacement">
    `;
    wordPairs.appendChild(wordPair);
  });
  
  document.getElementById('save-multiple').addEventListener('click', () => {
    const originals = document.querySelectorAll('.multi-original');
    const replacements = document.querySelectorAll('.multi-replacement');
    const history = [];
  
    for (let i = 0; i < originals.length; i++) {
      const original = originals[i].value;
      const replacement = replacements[i].value;
      if (original && replacement) {
        history.push({ original, replacement });
      }
    }
  
    if (history.length > 0) {
      chrome.storage.sync.get({ history: [] }, (data) => {
        const existingHistory = data.history;
        const newHistory = existingHistory.concat(history);
  
        chrome.storage.sync.set({ history: newHistory }, () => {
          alert('Words saved!');
          displayHistory();
          refreshCurrentTab();
        });
      });
    } else {
      alert('Please enter both original and replacement words.');
    }
  });
  
  document.querySelector('.settings-icon').addEventListener('click', () => {
    const singleWordDiv = document.querySelector('.single-word');
    const multiWordDiv = document.querySelector('.multi-word');
  
    if (multiWordDiv.style.display === 'none' || multiWordDiv.style.display === '') {
      multiWordDiv.style.display = 'block';
      singleWordDiv.style.display = 'none';
    } else {
      multiWordDiv.style.display = 'none';
      singleWordDiv.style.display = 'block';
      resetMultiWordFields();
    }
  
    document.querySelector('.container').scrollTop = 0; // Scroll to top when changing views
  });
  
  function resetMultiWordFields() {
    const wordPairs = document.getElementById('word-pairs');
    wordPairs.innerHTML = `
      <div class="word-pair">
        <label data-lang="original-label">Edytowane słowo:</label>
        <input type="text" class="multi-original">
        <label data-lang="replacement-label">Docelowe słowo:</label>
        <input type="text" class="multi-replacement">
      </div>
    `;
  }
  
  function displayHistory() {
    chrome.storage.sync.get('history', (data) => {
      const history = data.history || [];
      const historyTable = document.getElementById('history');
      historyTable.innerHTML = '';
  
      history.forEach((item, index) => {
        const row = document.createElement('tr');
        const originalCell = document.createElement('td');
        originalCell.textContent = item.original;
        const replacementCell = document.createElement('td');
        replacementCell.textContent = item.replacement;
        const actionCell = document.createElement('td');
        
        const editIcon = document.createElement('img');
        editIcon.src = 'edit-icon.png';
        editIcon.alt = 'Edit';
        editIcon.classList.add('action-icon');
        editIcon.addEventListener('click', () => editEntry(index, item.original, item.replacement));
        
        const deleteIcon = document.createElement('img');
        deleteIcon.src = 'delete-icon.png';
        deleteIcon.alt = 'Delete';
        deleteIcon.classList.add('action-icon');
        deleteIcon.addEventListener('click', () => deleteEntry(index));
        
        const actionIcons = document.createElement('div');
        actionIcons.classList.add('action-icons');
        actionIcons.appendChild(editIcon);
        actionIcons.appendChild(deleteIcon);
        
        actionCell.appendChild(actionIcons);
        
        row.appendChild(originalCell);
        row.appendChild(replacementCell);
        row.appendChild(actionCell);
        
        historyTable.appendChild(row);
      });
    });
  }
  
  function editEntry(index, original, replacement) {
    const newOriginal = prompt('Edytuj słowo:', original);
    const newReplacement = prompt('Wprowadź słowo docelowe:', replacement);
    
    if (newOriginal !== null && newReplacement !== null) {
      chrome.storage.sync.get({ history: [] }, (data) => {
        const history = data.history;
        history[index] = { original: newOriginal, replacement: newReplacement };
        
        chrome.storage.sync.set({ history }, () => {
          displayHistory();
          refreshCurrentTab();
        });
      });
    }
  }
  
  function deleteEntry(index) {
    chrome.storage.sync.get({ history: [] }, (data) => {
      const history = data.history;
      history.splice(index, 1);
      
      chrome.storage.sync.set({ history }, () => {
        displayHistory();
        refreshCurrentTab();
      });
    });
  }
  
  function refreshCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.reload(tabs[0].id);
    });
  }
  
  // Display history on popup load
  document.addEventListener('DOMContentLoaded', () => {
    displayHistory();
    setLanguage('pl'); // Set default language to Polish
  });
  
  function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-lang]');
    const translations = {
      pl: {
        title: 'Word Replacer',
        'original-label': 'Edytowane słowo:',
        'replacement-label': 'Docelowe słowo:',
        'save-button': 'Zapisz',
        'add-pair-button': 'Dodaj pole',
        'save-all-button': 'Zapisz wszystkie',
        'history-title': 'Aktywne zmienne:',
        'original-column': 'Oryginał',
        'replacement-column': 'Docelowe',
        'action-column': 'Akcja'
      },
      en: {
        title: 'Word Replacer',
        'original-label': 'Original Word:',
        'replacement-label': 'Replacement Word:',
        'save-button': 'Save',
        'add-pair-button': 'Add Pair',
        'save-all-button': 'Save All',
        'history-title': 'Active Variables:',
        'original-column': 'Original',
        'replacement-column': 'Replacement',
        'action-column': 'Action'
      },
      de: {
        title: 'Word Replacer',
        'original-label': 'Ursprüngliches Wort:',
        'replacement-label': 'Ersatzwort:',
        'save-button': 'Speichern',
        'add-pair-button': 'Paar hinzufügen',
        'save-all-button': 'Alle speichern',
        'history-title': 'Aktive Variablen:',
        'original-column': 'Original',
        'replacement-column': 'Ersatz',
        'action-column': 'Aktion'
      }
    };
  
    elements.forEach(el => {
      const key = el.getAttribute('data-lang');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }
  
  document.getElementById('language-select').addEventListener('change', (event) => {
    setLanguage(event.target.value);
  });
  