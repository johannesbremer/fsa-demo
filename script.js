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
  
  const permission = document.createElement('td');
  permission.innerText = '-';
  row.append(permission);
  
  const actionButtons = document.createElement('td');
  const queryReadPermissionButton = document.createElement('button');
  queryReadPermissionButton.innerText = "Query Read Access";
  const queryReadWritePermissionButton = document.createElement('button');
  queryReadWritePermissionButton.innerText = "Query ReadWrite Access";
  const requestReadPermissionButton = document.createElement('button');
  requestReadPermissionButton.innerText = "Request Read Access";
  const requestReadWritePermissionButton = document.createElement('button');
  requestReadWritePermissionButton.innerText = "Request ReadWrite Access";
  
  actionButtons.append(queryReadPermissionButton);
  actionButtons.append(queryReadWritePermissionButton);
  actionButtons.append(requestReadPermissionButton);
  actionButtons.append(requestReadWritePermissionButton);
  row.append(actionButtons);
  
  const table = document.getElementById('handle-table');  
  table.appendChild(row);
};