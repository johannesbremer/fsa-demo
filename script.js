const handleMap = new Map();

async function openFilePicker() {
  const fileHandles = await window.showOpenFilePicker({});
  showHeader();
  addRow(fileHandles[0]);
};

async function saveFilePicker() {
  const fileHandles = await window.showSaveFilePicker();
  showHeader();
  addRow(fileHandles[0]);
};

async function directoryPicker() {
  const dirHandle = await window.showDirectoryPicker();
  showHeader();
  addRow(dirHandle);
};

async function loadFromIndexedDB() {
  showHeader();
  // TODO
};

function showHeader() {
  const header = document.getElementById('handle-table-header');
  header.classList.remove('hidden');
}

function addRow(handle) {
  const row = document.createElement('tr');
  
  const handleName = document.createElement('td');
  handleName.innerText = handle.name;
  row.append(handleName);
  
  const handleType = document.createElement('td');
  handleType.innerText = handle.kind;
  row.append(handleType);
  
  const readPermission = document.createElement('td');
  addButton(readPermission, 'Query', handleQueryPermissionClick.bind(null, 'read'));
  addButton(readPermission, 'Request', handleRequestPermissionClick.bind(null, 'read'));
  const readPermissionState = document.createElement('span');
  readPermissionState.innerText = 'Status Unknown';
  readPermission.append(readPermissionState);
  row.append(readPermission);
  
  const readWritePermission = document.createElement('td');
  addButton(readWritePermission, 'Query', handleQueryPermissionClick.bind(null, 'readwrite'));
  addButton(readWritePermission, 'Request', handleRequestPermissionClick.bind(null, 'readwrite'));
  const readWritePermissionState = document.createElement('span');
  readWritePermissionState.innerText = 'Status Unknown';
  readWritePermission.append(readWritePermissionState);
  row.append(readWritePermission);
  
  const indexedDB = document.createElement('td');
  addButton(indexedDB, 'Save', handleSaveToIndexedDB);
  addButton(indexedDB, 'Remove', handleRemoveFromIndexedDB);
  row.append(indexedDB);
  
  const table = document.getElementById('handle-table'); 
  table.appendChild(row);
};

function addButton(parentElem, name, onClickHandler) {
  const buttonElem = document.createElement('button');
  buttonElem.innerText = name;
  buttonElem.addEventListener('click', onClickHandler);
  parentElem.append(buttonElem);
};

function updatePermissionState() {
  
}

function handleQueryPermissionClick(accessType) {
  
};

function handleRequestPermissionClick(accessType) {
  
};

function handleSaveToIndexedDB() {
  
};

function handleRemoveFromIndexedDB() {
  
};