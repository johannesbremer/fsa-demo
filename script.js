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
  const queryReadPermissionButton = document.createElement('button');
  queryReadPermissionButton.innerText = 'Query';
  const requestReadPermissionButton = document.createElement('button');
  requestReadPermissionButton.innerText = 'Request';
  const readPermissionState = document.createElement('span');
  readPermissionState.innerText = '-';
  readPermission.append(queryReadPermissionButton);
  readPermission.append(requestReadPermissionButton);
  readPermission.append(readPermissionState);
  row.append(readPermission);
  
  const readWritePermission = document.createElement('td');
  addButton(readWritePermission, 'Query', handleQueryPermissionClick);
  
  const queryReadWritePermissionButton = document.createElement('button');
  queryReadWritePermissionButton.innerText = 'Query';
  const requestReadWritePermissionButton = document.createElement('button');
  requestReadWritePermissionButton.innerText = 'Request';
  const readWritePermissionState = document.createElement('span');
  readWritePermissionState.innerText = '   -   ';
  readWritePermission.append(queryReadWritePermissionButton);
  readWritePermission.append(requestReadWritePermissionButton);
  readWritePermission.append(readWritePermissionState);
  row.append(readWritePermission);
  
  const indexedDB = document.createElement('td');
  const saveButton = document.createElement('button');
  saveButton.innerText = 'Save';
  const removeButton = document.createElement('button');
  removeButton.innerText = 'Remove';
  indexedDB.append(saveButton);
  indexedDB.append(removeButton);
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

function handleQueryPermissionClick(accessType) {
  
};

function handleRequestPermissionClick(accessType) {
  
};