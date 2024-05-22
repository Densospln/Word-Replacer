chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ original: '', replacement: '' }, () => {
    console.log('Initial setup completed.');
  });
});
