async function openFilePicker() {

  const fileHandles = await window.showOpenFilePicker();
  insertHandleElement(fileHandles[0]);
}

function insertHandleElement() {
  
}