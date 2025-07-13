function searchRecipes() {
    const ingredient = document.getElementById('ingredientInput').value.trim();
    const category = document.getElementById('categorySelect').value.trim();
    let url = 'http://localhost:3000/recipes';
  
    if (ingredient || category) {
      url += '?';
      const params = [];
      if (ingredient) params.push('ingredient=' + encodeURIComponent(ingredient));
      if (category) params.push('category=' + encodeURIComponent(category));
      url += params.join('&');
    }
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
  
        if (data.length === 0) {
          resultsDiv.innerHTML = '<p>Не беа пронајдени рецепти.</p>';
        } else {
          data.forEach(r => {
            const div = document.createElement('div');
            div.className = 'recipe';
            div.innerHTML = `
              <img src="${r.image || 'https://via.placeholder.com/280x160'}" alt="${r.name}">
              <div class="recipe-info">
                <strong>${r.name}</strong>
                <small><b>Категорија:</b> ${r.category}</small>
                <small><b>Калории:</b> ${r.calories}</small>
              </div>`;
            div.onclick = function() {
              showDetails(r);
            };
            resultsDiv.appendChild(div);
          });
        }
      })
      .catch(err => console.error('Fetch error:', err));
  }
  
  function showDetails(recipe) {
    console.log("showDetails called:", recipe);
    document.getElementById('modalTitle').innerText = recipe.name;
    document.getElementById('modalImage').src = recipe.image || 'https://via.placeholder.com/600x400';
    document.getElementById('modalCategory').innerText = recipe.category;
    document.getElementById('modalCalories').innerText = recipe.calories;
  
    const ingredientsList = document.getElementById('modalIngredients');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(i => {
      const li = document.createElement('li');
      li.innerText = i;
      ingredientsList.appendChild(li);
    });
  
    document.getElementById('modalPreparation').innerText = recipe.preparation || 'Preparation instructions not provided.';
    document.getElementById('modal').style.display = 'block';
  }
  
  function closeModal() {
    document.getElementById('modal').style.display = 'none';
  }
  