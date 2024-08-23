const APP_ID = '4cc8f243';
const APP_KEY = 'a6974c04314353062d2f59b51402cf59';
const apiUrl = `https://api.edamam.com/search?app_id=${APP_ID}&app_key=${APP_KEY}&q=`;

function defaultFn() {
    const defaultFood = 'chicken';
    searchFn(defaultFood);
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const userIn = document.getElementById('searchInput').value.trim();
    if (userIn !== '') {
        searchFn(userIn);
    } else {
        alert('Please enter a recipe name.');
    }
});

document.addEventListener('click', (event) => {
    if (event.target.className === 'show-recipe-btn') {
        const rId = event.target.getAttribute('data-id');
        modalFn(rId);
    }
    if (event.target.id === 'closeBtn') {
        closeModalFn();
    }
});

defaultFn();

function searchFn(query) {
    const url = `${apiUrl}${query}`;
    fetch(url)
        .then(res => res.json())
        .then(tmp => {
            if (tmp.hits.length > 0) {
                showRecpsFn(tmp.hits);
            } else {
                noRecFn();
            }
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

function showRecpsFn(recipes) {
    const rCont = document.getElementById('recipeContainer');
    rCont.innerHTML = '';
    recipes.forEach(recipeData => {
        const recipe = recipeData.recipe;
        const c = document.createElement('div');
        c.classList.add('animate__animated', 'animate__fadeIn', 'recipe-card');
        c.innerHTML = `
            <h3>${recipe.label}</h3>
            <img src="${recipe.image}" alt="${recipe.label}">
            <p>Source: ${recipe.source}</p>
            <button class="show-recipe-btn" data-id="${recipe.uri}">Show Recipe</button>
        `;
        rCont.appendChild(c);
    });
}

function noRecFn() {
    const rCont = document.getElementById('recipeContainer');
    rCont.innerHTML = '<p>No Recipe found</p>';
}

function modalFn(recipeUri) {
    const mData = document.getElementById('modalContent');
    mData.innerHTML = '';
    const encodedUri = encodeURIComponent(recipeUri);
    fetch(`https://api.edamam.com/search?r=${encodedUri}&app_id=${APP_ID}&app_key=${APP_KEY}`)
        .then(response => response.json())
        .then(data => {
            const recipe = data[0];
            mData.innerHTML = `
                <h2>${recipe.label}</h2>
                <img src="${recipe.image}" alt="${recipe.label}">
                <h3>Ingredients:</h3>
                <ul>${recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
                <h3>Instructions:</h3>
                <p>${recipe.instructions || "Follow the source link for instructions."}</p>
                <p><a href="${recipe.url}" target="_blank">View Full Recipe</a></p>
            `;
            document.getElementById('recipeModal').style.display = 'block';
        })
        .catch(error => console.error('Error fetching recipe details:', error));
}

function closeModalFn() {
    document.getElementById('recipeModal').style.display = 'none';
}
