const API_KEY = "38d90d1932ea4180bdaadcc0dcf6a190";
const url = "https://newsapi.org/v2/everything?q=";



window.addEventListener('load', () => {
  const savedCategory = localStorage.getItem('lastCategory');
  const initialCategory = savedCategory ? savedCategory : 'India';
  fetchNews(initialCategory);
});

async function fetchNews(query) {
  try {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    addData(data.articles);
    localStorage.setItem('lastCategory', query);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

function addData(articles) {
  const cardContainer = document.getElementById("card-container");
  const cardTemplate = document.getElementById("card-template");
  cardContainer.innerHTML = "";
  articles.forEach((article) => {
    if (!article.urlToImage) 
     return;
    const cardClone = cardTemplate.content.cloneNode(true);
    addDataInCard(article, cardClone);
    cardContainer.appendChild(cardClone);
  });
}

function addDataInCard(article, cardClone) {
  const newsImg = cardClone.querySelector("#card-img");
  const newsTitle = cardClone.querySelector(".card-title");
  const newsSource = cardClone.querySelector(".card-source");
  const newsDes = cardClone.querySelector(".news-des");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDes.innerHTML = article.description;
  const date = new Date(article.publishedAt).toLocaleString("en-us", { timeZone: "Asia/kolkata" });
  newsSource.innerHTML = `${article.source.name} ${date}`;
  cardClone.firstElementChild.addEventListener('click', () => {
    window.open(article.url, "_blank");
  });
}

let currentSelectedNavItem = null;

function onClickNews(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  currentSelectedNavItem?.classList.remove('active');
  currentSelectedNavItem = navItem;
  currentSelectedNavItem.classList.add('active');
}

const searchButton = document.getElementById('search-btn');
const searchText = document.getElementById('search-txt');

searchButton.addEventListener('click', () => {
  performSearch();
});

searchText.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const query = searchText.value.trim();
  if (query) {
    fetchNews(query);
    currentSelectedNavItem?.classList.remove('active');
    currentSelectedNavItem = null;
  }
}
