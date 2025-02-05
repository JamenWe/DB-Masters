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


-- Get all the recipes that include an ingredient ( parsing ingredient name )
SELECT
    recipe.recipe_name
FROM
    recipe_ingredient
    JOIN ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id
    JOIN recipe ON recipe_ingredient.recipe_id = recipe.recipe_id
WHERE
    ingredient.ingredient_name = 'Potato';


-- Get average nutritional values of all orders of one customer
SELECT
    AVG(ingredient.calories) AS avg_calories,
    AVG(ingredient.carbohydrates) AS avg_carbohydrates,
    AVG(ingredient.protein) AS avg_protein
FROM
    "order"
    JOIN order_recipe ON "order".order_id = order_recipe.order_id
    JOIN recipe_ingredient ON order_recipe.recipe_id = recipe_ingredient.recipe_id
    JOIN ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id
WHERE
    "order".customer_id = 9;


-- Get all the ingredients that are not found in a recipe yet
SELECT ingredient_name
FROM ingredient
WHERE ingredient_id NOT IN (
    SELECT ingredient_id
    FROM recipe_ingredient
);


-- Get all recipes that that do not exceed 2000 calories
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
    SUM(ingredient.calories) < 2000
ORDER BY
    recipe.recipe_id;


-- Get all recipes with less than 10 ingredients (we don't have recipes with less than 5 ingredients)
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
    COUNT(recipe_ingredient.ingredient_id) < 10
ORDER BY
    recipe.recipe_id;


--Get all recipes with less than 10 ingredients and a certain nutritional category (we don't have recipes with less than 5 ingredients)
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


-- 3 EXTRA QUERIES 


-- Get all recipes fitting to an allergic restriction
SELECT
    recipe.recipe_id,
    recipe.recipe_name
FROM
    recipe
JOIN
    recipe_allergen_restriction ON recipe.recipe_id = recipe_allergen_restriction.recipe_id
JOIN
    allergen_restriction ON recipe_allergen_restriction.allergen_restriction_id = allergen_restriction.allergen_restriction_id
WHERE
    allergen_restriction.name = 'Lactose';


-- Get all orders with recipes over 500 calories 
SELECT 
    order.order_id,
    order.order_date,
    recipe.recipe_name,
    SUM(ingredient.calories) AS total_calories
FROM 
    order
JOIN 
    order_recipe ON order.order_id = order_recipe.order_id
JOIN 
    recipe ON order_recipe.recipe_id = recipe.recipe_id
JOIN 
    recipe_ingredient ON recipe.recipe_id = recipe_ingredient.recipe_id
JOIN 
    ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id
GROUP BY 
    order.order_id, order.order_date, recipe.recipe_name
HAVING 
    SUM(ingredient.calories) > 500;


-- Get all recipes with ingredients coming from a certain supplier
SELECT
    DISTINCT recipe.recipe_id,
    recipe.recipe_name
FROM
    recipe
JOIN
    recipe_ingredient ON recipe.recipe_id = recipe_ingredient.recipe_id
JOIN
    ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id
JOIN
    supplier ON ingredient.supplier_id = supplier.supplier_id
WHERE
    supplier.supplier_name = 'Henning Dairy';


-- example inner join: Get all recipes with their ingredients
SELECT recipe.recipe_name, ingredient.ingredient_name
FROM recipe
INNER JOIN recipe_ingredient ON recipe.recipe_id = recipe_ingredient.recipe_id
INNER JOIN ingredient ON recipe_ingredient.ingredient_id = ingredient.ingredient_id;

-- example for right/left join: Get recipes 

