-- Get ingredients of a recipe ( parsing recipe_name )
SELECT
    ingredient.ingredient_name
FROM
    recipe
    JOIN recipe_ingredient ON recipe.recipe_id = recipe_ingredient.recipe_id
    JOIN ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id
WHERE
    recipe.recipe_name = 'Salmon Lasagna';

-- Get recipes of a nutritional category ( parsing name of the cat )
SELECT
    recipe.recipe_name
FROM
    nutritional_category
    JOIN recipe_nutritional_category ON nutritional_category.nutritional_category_id = recipe_nutritional_category.nutritional_category_id
    JOIN recipe ON recipe_nutritional_category.recipe_id = recipe.recipe_id
WHERE
    nutritional_category.name = 'Vegetarian';

-- Get all the recipes that include a ingredient ( parsing ingredient name )
SELECT
    recipe.recipe_name
FROM
    recipe_ingredient
    JOIN ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id
    JOIN recipe ON recipe_ingredient.recipe_id = recipe.recipe_id
WHERE
    ingredient.ingredient_name = 'Potato';

-- Get the avrage nutritional values of the recipes of a order
SELECT
    AVG(ingredient.calories) AS avg_calories,
    AVG(ingredient.carbohydrates) AS avg_carbohydrates,
    AVG(ingredient.protein) AS avg_protein
FROM
    order_recipe
    JOIN recipe_ingredient ON order_recipe.recipe_id = recipe_ingredient.recipe_id
    JOIN ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id
WHERE
    order_recipe.order_id = 41;

-- Get all the ingredients that are not found in a recipe yet
SELECT
    ingredient.ingredient_id,
    ingredient.ingredient_name
FROM
    ingredient
    LEFT JOIN recipe_ingredient ON ingredient.ingredient_id = recipe_ingredient.ingredient_id
WHERE
    recipe_ingredient.recipe_id IS NULL;

-- Get all recipes that have over 1000 calories
SELECT
    recipe.recipe_id,
    recipe.recipe_name,
    SUM(ingredient.calories) AS total_calories
FROM
    recipe
    JOIN recipe_ingredient ON recipe.recipe_id = recipe_ingredient.recipe_id
    JOIN ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id
GROUP BY
    recipe.recipe_id,
    recipe.recipe_name
HAVING
    SUM(ingredient.calories) > 1000
ORDER BY
    recipe.recipe_id;

-- Get all recipes with less than 5 ingredients
SELECT
    recipe.recipe_id,
    recipe.recipe_name,
    COUNT(recipe_ingredient.ingredient_id) AS ingredient_count
FROM
    recipe
    JOIN recipe_ingredient ON recipe.recipe_id = recipe_ingredient.recipe_id
GROUP BY
    recipe.recipe_id,
    recipe.recipe_name
HAVING
    COUNT(recipe_ingredient.ingredient_id) < 5
ORDER BY
    recipe.recipe_id;

--Get all recipes with less than 10 ingredients and a certain nutritional category (we have to get it with less then 5)
SELECT
    recipe.recipe_id,
    recipe.recipe_name,
    COUNT(recipe_ingredient.ingredient_id) AS ingredient_count
FROM
    recipe
    JOIN recipe_ingredient ON recipe.recipe_id = recipe_ingredient.recipe_id
    JOIN recipe_nutritional_category ON recipe.recipe_id = recipe_nutritional_category.recipe_id
    JOIN nutritional_category ON recipe_nutritional_category.nutritional_category_id = nutritional_category.nutritional_category_id
WHERE
    nutritional_category.name = 'Lactose-Free'
GROUP BY
    recipe.recipe_id,
    recipe.recipe_name
HAVING
    COUNT(recipe_ingredient.ingredient_id) < 10
ORDER BY
    recipe.recipe_id;
