const handleMap = new Map();

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

function insertHandleElement(handle) {
  const row = document.createElement('tr');
  
  const handleName = row.createElement('td');
  handleName.innerText = handle.name;
  
  const handleType = row.createElement('td');
  handleType.innerText = handle.kind
  
  const permission = row.createElement('td');
  
  
  const table = document.getElementById('handle-table');  
  table.appendChild(row);
};