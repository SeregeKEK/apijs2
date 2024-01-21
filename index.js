// Работал вместе с Макимом Савчуком

let perPage = 20;
let page = Math.floor(Math.random() * 7) + 1;
let currentIndex = Math.floor(Math.random() * perPage);
const pageMainEl = document.querySelector('.page-main');
const historyEl = document.querySelector('.history');

fetch(`https://api.unsplash.com/photos?page=${page}&per_page=${perPage}&client_id=CN98aR0892XOI2g6-s9k_nXxWz9q8l46IQxRtHGo6Ao`)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Ошибка! Статус: ${response.status}.`);
        }
        return response.json();
    })
    .then((data) => {
        const localKey = "likesCount";
        const currentImage = data[currentIndex];

        processData(currentImage);
        addImgElement(currentImage);
        likeButton(localKey, currentImage);
        likeButtonRise(localKey);
        saveToHistory(currentImage);
    })
    .catch((error) => {
        alert(error.message);
    });


function processData(data) {
    console.log(data);
}

function addImgElement(currentImage) {
    pageMainEl.insertAdjacentHTML('beforeend',
        `<div class="image" id="${currentImage.id}">
            <img src="${currentImage.urls.regular}" alt="${currentImage.alt_description}">
            <h3 class="image__autor">Автор: <span class="image__autor-name">${currentImage.user.name}</span></h3>
            <div class="image__btn"></div>
        </div>`)
}

function likeButton(localKey, currentImage) {
    const currentData = [{ id: currentImage.id, likes: currentImage.likes, like: false }];
    const setCurrentData = JSON.stringify(currentData);
    let allLikes = localStorage.getItem(localKey);
    if (!allLikes) {
        localStorage.setItem(localKey, setCurrentData);
    }
    const getData = JSON.parse(localStorage.getItem(localKey));
    let getCurrentData = getData.filter((element) => element.id === currentImage.id);
    if (getCurrentData.length === 0) {
        getData.push(...currentData);
        localStorage.setItem(localKey, JSON.stringify(getData));
        getCurrentData = getData.filter((element) => element.id === currentImage.id);
    }
    const imageBtnEl = document.querySelector('.image__btn');
    const dataHtml = getCurrentData.map((element) => getLikesHtml(element)).join("");
    imageBtnEl.innerHTML = dataHtml;
}

function getLikesHtml(element) {
    return `<button class="like-btn">Понравилось</button><p class="like-count">${element.likes}</p>`;
};

function likeButtonRise(localKey) {
    const likeButtonEl = document.querySelector('.like-btn');
    const likeCountEl = document.querySelector('.like-count');

    const getData = JSON.parse(localStorage.getItem(localKey));
    const closestImageElId = likeButtonEl.closest('.image').getAttribute('id');
    let getCurrentData = getData.filter((element) => element.id === closestImageElId);
    let getCurrentDataIndex = getData.findIndex(obj => obj.id === closestImageElId);
    if (getCurrentData[0].like) {
        likeButtonEl.disabled = true;
    }
    likeButtonEl.addEventListener('click', (e) => {
        e.target.disabled = true;
        getCurrentData.map(element => {
            element.like = true;
            element.likes = parseInt(element.likes, 10) + 1;
        });
        getData.splice(getCurrentDataIndex, 1);
        getData.push(...getCurrentData);
        localStorage.setItem(localKey, JSON.stringify(getData));
        likeCountEl.textContent = parseInt(likeCountEl.textContent) + 1;
    })
}

function saveToHistory(currentImage) {
    const localKey = "history";
    const currentData = [{ id: currentImage.id, url: currentImage.urls.small, autor: currentImage.user.name }];
    const setCurrentData = JSON.stringify(currentData);
    let allHistory = localStorage.getItem(localKey);
    if (!allHistory) {
        localStorage.setItem(localKey, setCurrentData);
    }

    const getData = JSON.parse(localStorage.getItem(localKey));
    let getCurrentData = getData.filter((element) => element.id === currentImage.id);
    console.log(getCurrentData);
    if (getCurrentData.length === 0) {
        getData.push(...currentData);
        localStorage.setItem(localKey, JSON.stringify(getData));
        // getCurrentData = getData.filter((element) => element.id === currentImage.id);
    }
    const historyElHtml = getData.map((element) => getHistoryHtml(element)).join("");
    historyEl.innerHTML = historyElHtml;
}

function getHistoryHtml(element) {
    return `<div class="history-image" id="${element.id}">
                <img src="${element.url}">
                <h3 class="history-image__autor">Автор: <span class="history-image__autor-name">${element.autor}</span></h3>
            </div>`;
};
