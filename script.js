const handleMap = new Map();

async function openFilePicker() {
  const fileHandles = await window.showOpenFilePicker({});
  showHeader();
  addRow(fileHandles[0]);
};

async function saveFilePicker() {
  const fileHandle = await window.showSaveFilePicker();
  showHeader();
  addRow(fileHandle);
};

async function directoryPicker(mode) {
  const options = {};
  if (mode == 'read' || mode == 'readwrite') {
    options.mode = mode;
  }
  const dirHandle = await window.showDirectoryPicker(options);
  showHeader();
  addRow(dirHandle);
};

async function loadFromIndexedDB() {
  var entries;
  try {
    entries = await this.entries();
    console.log("Loaded handles from Indexed DB");
  } catch (e) {
    console.log("Error loading from Indexed DB: " + e.message);
    return;
  }
  
  showHeader();
  for (var i = 0; i < entries.length; i++) {
    addRow(entries[i][1], true);
  }
};

function showHeader() {
  const header = document.getElementById('handle-table-header');
  header.classList.remove('hidden');
}

function addRow(handle, fromIndexedDB = false) {  
  const handleKey = generateHandleKey(handle);
  if (document.getElementById(handleKey)) {
    // A row for this handle already exists.
    return;
  }
  
  const row = document.createElement('tr');
  row.id = handleKey;
  
  const handleName = document.createElement('td');
  handleName.innerText = handle.name;
  row.append(handleName);
  
  const handleType = document.createElement('td');
  handleType.innerText = handle.kind;
  row.append(handleType);
  
  const readPermission = document.createElement('td');
  addButton(readPermission, 'Query', handleKey,
            handlePermissionButtonClick.bind(null, 'read', true));
  addButton(readPermission, 'Request', handleKey, 
            handlePermissionButtonClick.bind(null, 'read', false));
  const readPermissionState = document.createElement('span');
  readPermissionState.classList.add('read-state');
  readPermissionState.innerText = '-----';
  readPermission.append(readPermissionState);
  row.append(readPermission);
  
  const readWritePermission = document.createElement('td');
  addButton(readWritePermission, 'Query', handleKey, 
            handlePermissionButtonClick.bind(null, 'readwrite', true));
  addButton(readWritePermission, 'Request', handleKey, 
            handlePermissionButtonClick.bind(null, 'readwrite', false));
  const readWritePermissionState = document.createElement('span');
  readWritePermissionState.classList.add('readwrite-state');
  readWritePermissionState.innerText = '-----';
  readWritePermission.append(readWritePermissionState);
  row.append(readWritePermission);
  
  const indexedDB = document.createElement('td');
  const saveButton = addButton(indexedDB, 'Save', handleKey, handleSaveToIndexedDB);
  const removeButton = addButton(indexedDB, 'Remove', handleKey, handleRemoveFromIndexedDB);
  if (fromIndexedDB) {
    
  }
  const indexedDBState = document.createElement('span');
  indexedDBState.classList.add('idb-state');
  indexedDBState.innerText = '-----';
  indexedDB.append(indexedDBState);
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
  return buttonElem;
};

function generateHandleKey(handle) {
  // Return unique ID.
  return handle.name;
};

async function handlePermissionButtonClick(accessType, queryOnly, event) {
  if (!event.target) {
    return;
  }
  
  const handleKey = event.target.getAttribute('handleKey');
  const handle = handleMap.get(handleKey);
  if (!handle) {
    console.log('Failed to find a handle');
    return;
  }
  
  const result = await (queryOnly ?
                        handle.queryPermission({mode: accessType}) :
                        handle.requestPermission({mode: accessType}));
  console.log((queryOnly ? 'queryPermission()' : 'requestPermission()')
              + ' returned "' + result + '"');
  
  // Update the permission state label.
  const rowElem = document.getElementById(handleKey);
  const stateElems = rowElem.getElementsByClassName(
    accessType == 'read' ? 'read-state' : 'readwrite-state');
  stateElems[0].innerText = result;
};

async function handleSaveToIndexedDB(event) {
  if (!event.target) {
    return;
  }
  
  const handleKey = event.target.getAttribute('handleKey');
  const handle = handleMap.get(handleKey);
  if (!handle) {
    console.log('Failed to find a handle');
    return;
  }
  
  // Save to Indexed DB.
  try {
    await set(handleKey, handle);
    console.log('Saved handle "' + handle.name + '" to Indexed DB');
  } catch (e) {
    console.log('Error saving handle "' + handle.name + '" to Indexed DB: ' + e.message);
  }
  
  const rowElem = document.getElementById(handleKey);
  const stateElems = rowElem.getElementsByClassName('idb-state');
  stateElems[0].innerText = "saved";
};

async function handleRemoveFromIndexedDB(event) {
  if (!event.target) {
    return;
  }
  
  const handleKey = event.target.getAttribute('handleKey');
  const handle = handleMap.get(handleKey);
  if (!handle) {
    console.log('Failed to find a handle');
    return;
  }
  
  // Remove from Indexed DB.
  try {
    await del(handleKey);
    console.log('Removed handle "' + handle.name + '" from Indexed DB');
  } catch (e) {
    console.log('Error removing handle "' + handle.name + '" from Indexed DB: ' + e.message);
  }
  
  const rowElem = document.getElementById(handleKey);
  const stateElems = rowElem.getElementsByClassName('idb-state');
  stateElems[0].innerText = "removed";
};

/**
 * Indexed DB
 * From https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js
 */
function promisifyRequest(request) {
    return new Promise((resolve, reject) => {
        // @ts-ignore - file size hacks
        request.oncomplete = request.onsuccess = () => resolve(request.result);
        // @ts-ignore - file size hacks
        request.onabort = request.onerror = () => reject(request.error);
    });
}
function createStore(dbName, storeName) {
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    const dbp = promisifyRequest(request);
    return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
    if (!defaultGetStoreFunc) {
        defaultGetStoreFunc = createStore('keyval-store', 'keyval');
    }
    return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function get(key, customStore = defaultGetStore()) {
    return customStore('readonly', (store) => promisifyRequest(store.get(key)));
}
/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function set(key, value, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.put(value, key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Set multiple values at once. This is faster than calling set() multiple times.
 * It's also atomic – if one of the pairs can't be added, none will be added.
 *
 * @param entries Array of entries, where each entry is an array of `[key, value]`.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function setMany(entries, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        entries.forEach((entry) => store.put(entry[1], entry[0]));
        return promisifyRequest(store.transaction);
    });
}
/**
 * Get multiple values by their keys
 *
 * @param keys
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function getMany(keys, customStore = defaultGetStore()) {
    return customStore('readonly', (store) => Promise.all(keys.map((key) => promisifyRequest(store.get(key)))));
}
/**
 * Update a value. This lets you see the old value and update it as an atomic operation.
 *
 * @param key
 * @param updater A callback that takes the old value and returns a new value.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function update(key, updater, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => 
    // Need to create the promise manually.
    // If I try to chain promises, the transaction closes in browsers
    // that use a promise polyfill (IE10/11).
    new Promise((resolve, reject) => {
        store.get(key).onsuccess = function () {
            try {
                store.put(updater(this.result), key);
                resolve(promisifyRequest(store.transaction));
            }
            catch (err) {
                reject(err);
            }
        };
    }));
}
/**
 * Delete a particular key from the store.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function del(key, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.delete(key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Clear all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function clear(customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.clear();
        return promisifyRequest(store.transaction);
    });
}
function eachCursor(customStore, callback) {
    return customStore('readonly', (store) => {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        store.openCursor().onsuccess = function () {
            if (!this.result)
                return;
            callback(this.result);
            this.result.continue();
        };
        return promisifyRequest(store.transaction);
    });
}
/**
 * Get all keys in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function keys(customStore = defaultGetStore()) {
    const items = [];
    return eachCursor(customStore, (cursor) => items.push(cursor.key)).then(() => items);
}
/**
 * Get all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function values(customStore = defaultGetStore()) {
    const items = [];
    return eachCursor(customStore, (cursor) => items.push(cursor.value)).then(() => items);
}
/**
 * Get all entries in the store. Each entry is an array of `[key, value]`.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function entries(customStore = defaultGetStore()) {
    const items = [];
    return eachCursor(customStore, (cursor) => items.push([cursor.key, cursor.value])).then(() => items);
}