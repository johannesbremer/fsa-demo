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
  saveButton.innerText = 'Save to IndexedDB';
  const removeButton = document.createElement('button');
  removeButton.innerText = 'Remove';
  indexedDB.append(saveButton);
  indexedDB.append(removeButton);
  row.append(indexedDB);
  
  const table = document.getElementById('handle-table'); 
  table.appendChild(row);
};