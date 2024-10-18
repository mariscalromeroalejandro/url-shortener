const submitBtn = document.getElementById("submitBtn");
const longUrlInput = document.getElementById("longUrl");
const urlsTableBody = document.getElementById("urls");
const tableHeaders = document.getElementById("tableHeaders");
const generateUrl = document.getElementById("generateNewUrl");
const cleardbButton = document.getElementById("cleardb");
const shortUrlInput = document.getElementById("shortUrl");
const createRandomly = document.getElementById("buttonRandom");
const tinyUrlInput = document.getElementById("inputShortUrl")
const redirectButton = document.getElementById("redirectBtn");

function initializeUrlInput() {
  longUrlInput.value =
    "http://alio2-cr1-hv-mvs00.cern.ch:8082/?page=objectView&objectId=65bcf64b44b09a47a0fda3f4&layoutId=65bcf64b5796d0b2c0b234e5";
  shortUrlInput.value = "";
}

async function fetchUrls() {
  const urls = await fetchData("/api/urls");
  clearTable();
  if (urls.length > 0) {
    const headers = getTableHeaders(urls);
    populateHeaders(headers);
    populateRows(urls, headers);
  }
}

async function fetchData(apiEndpoint) {
  const response = await fetch(apiEndpoint);
  return response.json();
}


function clearTable() {
  urlsTableBody.innerHTML = "";
  tableHeaders.innerHTML = "";
}

function getTableHeaders(urls) {
  return Object.keys(urls[0]);
}

function populateHeaders(headers) {
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header.charAt(0).toUpperCase() + header.slice(1);
    tableHeaders.appendChild(th);
  });
}

function populateRows(urls, headers) {
  urls.forEach((url) => {
    const row = document.createElement("tr");
    headers.forEach((field) => {
      const cell = document.createElement("td");
      cell.textContent = url[field];
      row.appendChild(cell);
    });
    urlsTableBody.appendChild(row);
  });
}

function clearFilters() {
  const divFilters = document.getElementById("filters");
  const inputs = divFilters.querySelectorAll("input");
  inputs.forEach((input) => {
    input.value = "";
  });
}

cleardbButton.addEventListener("click", async () => {
  deleteAll();
  fetchUrls();
});

async function deleteAll() {
  await fetch("/api/urls", {
    method: "DELETE",
  });
}

generateUrl.addEventListener("click", async () => {
  ids = ["RunType", "RunNumber", "PeriodName", "PassName"];
  initializeUrlInput();
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element.value !== "") {
      longUrlInput.value += `&${id}=${element.value}`;
    }
  });
});

// Event listener for the button
submitBtn.addEventListener("click", async () => {
  const longUrl = longUrlInput.value;
  if (longUrl) {
    const response = await fetch("/api/urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl }),
    });
    const data = await response.json()
    if (isNew(response)) {
      fetchUrls();
      initializeUrlInput();
      clearFilters();
    }
    console.log('response', data)
    shortUrlInput.value = data.shortUrl;
  }
});

function isFound(response) {
  return response.status === 200
}

function isNew(response) {
  return response.status = 201
}

function isError(response) {
  return response.status = 500;
}

createRandomly.addEventListener("click", async function generateRandomUrl() {
  for (let i = 0; i < 100; i++) {
    let urlAleatoria = "https://www.example.com/";
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let j = 0; j < 10; j++) {
      urlAleatoria += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }
    const layoutId = Math.floor(Math.random() * 10000); // Número aleatorio entre 0 y 9999
    urlAleatoria += `?layoutId=${layoutId}`; // Añadir el parámetro layoutId
    await fetch("/api/urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl: urlAleatoria }),
    });
  }
    fetchUrls()
});

redirectButton.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/url", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortUrl: tinyUrlInput.value }),
    });

    if (response.ok) {
      const longUrl = await response.text(); 
      console.log('longurl', longUrl);
      window.open(longUrl, '_blank');
      tinyUrlInput.classList.remove('error');
    } else {
      tinyUrlInput.classList.add("error");
      console.error('Error en la respuesta:', response.statusText);
    }
  } catch (error) {
    tinyUrlInput.classList.add("error");
    console.error('Error en la solicitud:', error); 
  }
});


// Fetch URLs on page load
initializeUrlInput();
fetchUrls(false);
