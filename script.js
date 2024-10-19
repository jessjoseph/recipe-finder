const APP_ID = '38e1748b'; // Replace with your actual App ID
const APP_KEY = 'f8488a57e079138723e0ece7297c4a00'; // Make sure there are no extra spaces



async function fetchRecipes(query, ingredients = '', diet = '') {
    // Combine the ingredients with the query if provided
    if (ingredients) {
        query += ` ${ingredients}`; // Combine query with ingredients
    }

    // Supported diet values
    const supportedDiets = ['balanced', 'high-protein', 'low-fat', 'low-carb', 'vegan', 'vegetarian', 'paleo', 'gluten-free'];

    // Start constructing the API endpoint
    let endpoint = `https://api.edamam.com/search?q=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    // Add diet filter if valid
    if (diet && supportedDiets.includes(diet)) {
        endpoint += `&diet=${encodeURIComponent(diet)}`;
    }

    console.log('Query:', query);
    console.log('Diet:', diet);
    console.log('Endpoint:', endpoint); // Log the constructed endpoint

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
            displayResults(data.hits);
        } else {
            document.getElementById('recipe-container').innerHTML = '<p>No recipes found. Try modifying the search criteria.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('recipe-container').innerHTML = '<p>Error fetching data. Please try again.</p>';
    }
}

function displayResults(recipes) {
    const resultsContainer = document.getElementById('recipe-container'); // Ensure this matches your HTML
    resultsContainer.innerHTML = ''; // Clear previous results

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';

        // Safely access recipe properties
        const title = recipe.recipe.label || 'No Title';
        const imageUrl = recipe.recipe.image || 'default-image.jpg'; // Fallback for image
        const calories = recipe.recipe.calories ? Math.round(recipe.recipe.calories) : 'N/A'; // Fallback for calories
        const recipeUrl = recipe.recipe.url || '#'; // Fallback for recipe link

        recipeCard.innerHTML = `
            <h2>${title}</h2>
            <img src="${imageUrl}" alt="${title}">
            <p>Calories: ${calories}</p>
            <a href="${recipeUrl}" target="_blank">View Recipe</a>
        `;

        resultsContainer.appendChild(recipeCard);
    });
}


// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', function() {
    const query = document.getElementById('search-query').value;
    const ingredients = document.getElementById('ingredient-input').value; // Get ingredients input
    const diet = document.getElementById('diet-filter').value; // Get selected diet
    
    if (query) {
        fetchRecipes(query, ingredients, diet); // Pass ingredients and diet to fetchRecipes
    } else {
        alert('Please enter a recipe name or ingredient.');
    }
});

// Handle dynamic updating of grocery list as user types
const groceryInput = document.getElementById('grocery-input');
const groceryList = document.getElementById('grocery-list');

    groceryInput.addEventListener('input', function() {
        const items = groceryInput.value.split('\n').filter(item => item.trim() !== '');
        groceryList.innerHTML = '';

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.trim();
            groceryList.appendChild(listItem);
    });
      });

      