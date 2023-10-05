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
  const handleKey = generateHandleKey(handle);
  
  const row = document.createElement('tr');
  row.id = handleKey;
  
  const handleName = document.createElement('td');
  handleName.innerText = handle.name;
  row.append(handleName);
  
  const handleType = document.createElement('td');
  handleType.innerText = handle.kind;
  row.append(handleType);
  
  const readPermission = document.createElement('td');
  addButton(readPermission, 'Query', handleKey, handleQueryPermissionClick.bind(null, 'read'));
  addButton(readPermission, 'Request', handleKey, handleRequestPermissionClick.bind(null, 'read'));
  const readPermissionState = document.createElement('span');
  readPermissionState.classList.add('read-state');
  readPermissionState.innerText = '-----';
  readPermission.append(readPermissionState);
  row.append(readPermission);
  
  const readWritePermission = document.createElement('td');
  addButton(readWritePermission, 'Query', handleKey, handleQueryPermissionClick.bind(null, 'readwrite'));
  addButton(readWritePermission, 'Request', handleKey, handleRequestPermissionClick.bind(null, 'readwrite'));
  const readWritePermissionState = document.createElement('span');
  readWritePermissionState.classList.add('readwrite-state');
  readWritePermissionState.innerText = '-----';
  readWritePermission.append(readWritePermissionState);
  row.append(readWritePermission);
  
  const indexedDB = document.createElement('td');
  addButton(indexedDB, 'Save', handleSaveToIndexedDB);
  addButton(indexedDB, 'Remove', handleRemoveFromIndexedDB);
  row.append(indexedDB);
  
  const table = document.getElementById('handle-table'); 
  table.appendChild(row);
  
  // Update model.
  handleMap.set(row.id, handle);
};

function addButton(parentElem, name, handleKey, onClickHandler) {
  const buttonElem = document.createElement('button');
  buttonElem.innerText = name;
  buttonElem.setAttribute('handleKey', handleKey);
  buttonElem.addEventListener('click', onClickHandler);
  parentElem.append(buttonElem);
};

function generateHandleKey(handle) {
  // TODO(dslee): generate unique name
  return handle.name;
};

async function handleQueryPermissionClick(accessType, event) {
  if (!event.target) {
    return;
  }
  
  const handleKey = event.target.getAttribute('handleKey');
  const handle = handleMap.get(handleKey);
  if (!handle) {
    console.log('Failed to find a handle');
    return;
  }
  
  const result = await handle.queryPermission({mode: accessType});
  console.log('queryPermission() returned "' + result + '"');
  
  // Update the permission state label.
  const rowElem = document.getElementById(handleKey);
  const stateElem = rowElem.getElementsByClassName('read-state');
  stateElem.innerText = result;
};

async function handleRequestPermissionClick(accessType, event) {
  if (!event.target) {
    return;
  }
  const handleKey = event.target.getAttribute('handleKey');
  const handle = handleMap.get(handleKey);
  if (!handle) {
    console.log('Failed to find a handle');
    return;
  }
  
  const result = await handle.requestPermission({mode: accessType});
  console.log('requestPermission() returned "' + result + '"');
  
  // Update the permission state label.
  const rowElem = document.getElementById(handleKey);
  const stateElem = rowElem.getElementsByClassName('readwrite-state');
  stateElem.innerText = result;
};

function handleSaveToIndexedDB(event) {
  
};

function handleRemoveFromIndexedDB(event) {
  
};