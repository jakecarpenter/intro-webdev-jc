// stuff related to the contact form
//add event leistener to the form submit.

function registerEvents() {
    const form = document.querySelectorAll('#contact-form')[0];

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            alert("Thank you for your message, we'll be in touch.")
            form.submit();
        } else {
            alert('Please fill out all  the fields')
        }
    })

}
registerEvents()

//basic form validation
function validateForm() {
    const form = document.querySelectorAll('#contact-form')[0];
    const inputs = form.querySelectorAll('input');
    const textareas = form.querySelectorAll('textarea')

    let isValid = true;
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const value = input.value.trim();
        if (value === '') {
            console.log(`Field ${input.name} is empty`);
            input.classList.add('error');
            isValid = false;
        }
    }
    for (let i = 0; i < textareas.length; i++) {
        const textarea = textareas[i];
        const value = textarea.value.trim();
        if (value === '') {
            console.log(`Field ${textarea.name} is empty`);
            textarea.classList.add('error');
            isValid = false;
        }
    }
    return isValid;
}

// keep track of the tab they;re on, load content based on that
// when the tab is clicked, update the 
const tabs = [
    { "id": 0, "name": "Home", "tabElementId": "home-tab" },
    { "id": 1, "name": "About", "tabElementId": "about-tab" },
    { "id": 2, "name": "Products", "tabElementId": "products-tab" },
    { "id": 3, "name": "Contact", "tabElementId": "contact-tab" }
]

let contentContainer = document.getElementsByTagName("main")[0];
let tabLinks = document.querySelectorAll("nav ul li a")

async function selectTab(tabId) {
    // load content
    await loadTabContent(tabId)

    // set class for tab active
    tabLinks.forEach((tabLink, index) => {
        tabLink.classList.remove("active");
        if (index == tabId) {
            tabLink.classList.add("active")
        }
    })

    //save tab to local storage
    saveTab(tabId);
}

async function loadTabContent(tabId) {
    try {
        if (tabs[tabId]) {
            contentContainer.innerHTML = document.querySelector(`#${tabs[tabId].tabElementId}`).innerHTML
            registerEvents();
        }
        else {
            throw new Error("Failed to load tab content", error);
        }
        return true
    } catch (error) {
        console.log("Error loading tab content", error)
        return false
    }
}

function saveTab(tabId) {
    localStorage.setItem('northstar-tab', tabId);
}

function loadSavedTab() {
    const savedTab = localStorage.getItem('northstar-tab');

    // if we've never been here before there wont be an active tab. set one.
    if (savedTab !== null) {
        selectTab(savedTab)
    } else {
        selectTab(0)
    }
}

loadSavedTab()

//product page stuff (favorite and rating)

//intercept the click, update the list of favorites. update button
function handleFavoriteClick(event) {
    let productId = event.dataset.productId;
    markFavorite(productId, setFavorite(productId))
}

//set the label and class of the button
function markFavorite(id, isFavorite) {
    let favoriteButtons = document.querySelectorAll(".product-image button");
    let favoriteButton = null;

    favoriteButtons.forEach(button => {
        if (button.dataset.productId == id) {
            favoriteButton = button
            if (isFavorite) {
                favoriteButton.classList.add('favorite')
                favoriteButton.innerHTML = "★"
            } else {
                favoriteButton.classList.remove('favorite')
                favoriteButton.innerHTML = "Mark as favorite"
            }
        }
    })
}

//update the favorite tracking array and save it to local storage
function setFavorite(id) {
    let favorites = getFavorites();
    let isFavorite = false;
    //if the favorite is already there, remove it. otherwise add it
    if (favorites.includes(id)) {
        let index = favorites.indexOf(id)
        favorites.splice(index, 1)
    } else {
        favorites.push(id)
        isFavorite = true;
    }

    //save our update
    localStorage.setItem('northstar-favorites', JSON.stringify(favorites))
    //let us know if the clicked item was a favorite
    return isFavorite
}

//fetch the current favorites from storage.
function getFavorites() {
    let favorites = localStorage.getItem('northstar-favorites') || '[]';
    return JSON.parse(favorites);
}

//get the favorites when we load the page.
function loadFavorites() {
    let favorites = getFavorites();
    favorites.forEach(id => {
        markFavorite(id, true)
    })
}
loadFavorites()