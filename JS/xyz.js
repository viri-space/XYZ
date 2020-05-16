console.log("XYZ.js has loaded for " + siteName);

let d = new Date();
document.getElementById("year").innerHTML = d.getFullYear();

// Set Page Title
function setTitle() {
  let title = siteName + ' | ' + pageName;
  document.title = title
}

// Page loader
function loadPage(url, output) {
  fetch(url)
  .then(response => response.text())
  .then(text => {document.getElementById(output).innerHTML = text})
  .catch((err) => {document.getElementById(output).innerHTML = "Can’t access " + url + " response. Blocked by browser?"});
}

//SearchParams Test
const params = new URLSearchParams(window.location.search);

//Iterate the search parameters.
for (const param of params) {
  console.log(param);
}
