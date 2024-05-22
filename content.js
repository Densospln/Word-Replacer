function replaceTextInNode(node, original, replacement) {
    const regex = new RegExp(original, 'gi');
    node.textContent = node.textContent.replace(regex, replacement);
  }
  
  function replaceText(original, replacement) {
    if (!original || !replacement) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
      replaceTextInNode(node, original, replacement);
    }
  }
  
  function replaceAllWords() {
    chrome.storage.sync.get('history', (data) => {
      const history = data.history || [];
      history.forEach(pair => {
        replaceText(pair.original, pair.replacement);
      });
    });
  }
  
  replaceAllWords();
  