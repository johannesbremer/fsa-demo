

async function openFilePicker() {
  const fileHandles = await window.showOpenFilePicker({});
  insertHandleElement(fileHandles[0]);
};

async function saveFilePicker() {
  const fileHandles = await window.showSaveFilePicker();
  insertHandleElement(fileHandles[0]);
};

async function directoryPicker() {
  const dirHandle = await window.showDirectoryPicker();
  insertHandleElement(dirHandle);
};

function insertHandleElement() {
  const containerElem = document.getElementById('handle-container');
  
};