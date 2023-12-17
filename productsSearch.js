const searchInputEl = document.getElementById("searchInput");
const searchResultsEl = document.getElementById("searchResults");
const resultContEl = document.getElementById("resultContainer");
const spinnerEl = document.getElementById("spinner");

const productsContainer = document.getElementById('productsContainer');
const cardViewBtn = document.getElementById('cardViewBtn');
const listViewBtn = document.getElementById('listViewBtn');


function createCardView(product) {
    console.log(product);
    const {
        product_image,
        product_title,
        product_badge
    } = product;
    resultContEl.textContent = "";
    const card = document.createElement('div');
    card.classList.add('product_card');

    let imageEle = document.createElement("img");
    imageEle.src = product_image;
    imageEle.alt = product_title;
    imageEle.classList.add("Product_image");

    let productTitleEle = document.createElement("p");
    productTitleEle.textContent = product_title;
    productTitleEle.classList.add("product_title");

    let productBadgeEle = document.createElement("p");
    productBadgeEle.textContent = product_badge;
    productBadgeEle.classList.add("product_badge");

    card.appendChild(productBadgeEle);
    card.appendChild(imageEle);
    card.appendChild(productTitleEle);

    productsContainer.appendChild(card);
}

function createListView(product) {
    displayProducts();

}

async function fetchAndDisplayData(viewType) {
    try {
        spinnerEl.classList.remove('d-none');
        const url = `https://products-api-2ttf.onrender.com/api/products`;
        const options = {
            method: 'GET'
        };

        const response = await fetch(url, options);
        const jsonData = await response.json();
        const {
            data
        } = jsonData;

        // Clear the container before appending new content
        productsContainer.innerHTML = '';

        if (viewType === 'card') {
            data.forEach((product) => createCardView(product));
        } else if (viewType === 'list') {
            data.forEach((product) => createListView(product));
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle errors here
    } finally {
        spinnerEl.classList.add('d-none');
    }
}

cardViewBtn.addEventListener('click', () => {
    fetchAndDisplayData('card');
});

listViewBtn.addEventListener('click', () => {
    fetchAndDisplayData('list');
});

function createAndAppendSearchResult(result) {

    const {
        product_image,
        product_title,
        product_badge,
        product_variants
    } = result;

    const cardEl = document.createElement("div");
    cardEl.classList.add("result-card");

    const leftContent = document.createElement("div");
    leftContent.classList.add("left-content");

    const rightContent = document.createElement("div");
    rightContent.classList.add("right-content");

    const badgeEle = document.createElement("p");
    badgeEle.textContent = product_badge;
    badgeEle.classList.add("product_badge");
    leftContent.appendChild(badgeEle);

    const imageEl = document.createElement("img");
    imageEl.src = product_image;
    imageEl.alt = product_title;
    imageEl.classList.add("Product_image");
    leftContent.appendChild(imageEl);

    const titleEl = document.createElement("p");
    titleEl.textContent = product_title;
    titleEl.classList.add("product_title");
    rightContent.appendChild(titleEl);

    const variantsList = document.createElement("ul");
    variantsList.classList.add("variants-list");

    product_variants.forEach(variant => {
        const variantItem = document.createElement("li");
        variantItem.textContent = Object.values(variant)[0];
        variantsList.appendChild(variantItem);
    });

    rightContent.appendChild(variantsList);

    cardEl.appendChild(leftContent);
    cardEl.appendChild(rightContent);

    resultContEl.appendChild(cardEl);

}


function displayResults(searchResults) {
    spinnerEl.classList.add("d-none");
    resultContEl.textContent = "";

    if (searchResults.length === 0) {
        const noResultsEl = document.createElement("p");
        noResultsEl.textContent = "No results found";
        resultContEl.appendChild(noResultsEl);
    } else {
        searchResults.forEach(createAndAppendSearchResult);
    }
}


async function searchProducts(event) {
    if (event.key === "Enter") {
        spinnerEl.classList.remove("d-none");
        //searchResultsEl.textContent = "";

        const searchInput = searchInputEl.value.trim();
        if (searchInput !== "") {
            const url = `https://products-api-2ttf.onrender.com/api/products?search=${searchInput}`;
            const options = {
                method: "GET",
            };

            try {
                const response = await fetch(url, options);
                const jsonData = await response.json();
                //console.log(jsonData)
                const {
                    data
                } = jsonData;
                displayResults(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handles or displays error appropriately
            }
        }
    }
}

async function displayProducts() {
    const url = "https://products-api-2ttf.onrender.com/api/products";
    const options = {
        method: "GET",
    };

    try {
        const response = await fetch(url, options);
        const jsonData = await response.json();
        const {
            data
        } = jsonData;
        displayResults(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handles or displays error appropriately
    }
}

searchInputEl.addEventListener("keydown", searchProducts);
displayProducts();