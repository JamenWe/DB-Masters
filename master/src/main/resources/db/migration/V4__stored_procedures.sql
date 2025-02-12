-- Get the orders for a given customer
CREATE OR REPLACE FUNCTION get_customer_orders(customer_id_param INT)
RETURNS TABLE (
    order_id INT,
    order_date DATE,
    invoice_amount DECIMAL(10,2),
    recipes TEXT,
    ingredients TEXT
) AS $$
BEGIN
    RETURN QUERY
        SELECT
            o.order_id,
            o.order_date::DATE,
            o.invoice_amount,

            -- Subselects
            -- Collect all recipe names for this order
            (
                SELECT string_agg(r.recipe_name, ', ')
                FROM order_recipe or2
                         JOIN recipe r ON or2.recipe_id = r.recipe_id
                WHERE or2.order_id = o.order_id
            ) as recipes,

            -- Collect all ingredient names for this order
            (
                SELECT string_agg(i.ingredient_name, ', ')
                FROM order_ingredient oi
                         JOIN ingredient i ON oi.ingredient_id = i.ingredient_id
                WHERE oi.order_id = o.order_id
            ) as ingredients

        FROM "order" o
        WHERE o.customer_id = customer_id_param
        ORDER BY o.order_date DESC;
END;
$$ LANGUAGE plpgsql;



-- Get the average nutritional value of an order for a given customer
CREATE OR REPLACE FUNCTION get_customer_nutrition_averages(customer_id_param INT)
RETURNS TABLE (
    customer_id INT,
    order_id INT,
    avg_calories INT,
    avg_carbohydrates DECIMAL(10,2),
    avg_protein DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
        WITH order_nutrition AS (

            -- Calculate nutrition from ordered recipes
            SELECT
                o.customer_id as cust_id,
                o.order_id as ord_id,
                COALESCE(SUM(i.calories * CAST(ri.quantity AS INT) * CAST(or2.quantity AS INT)), 0) as recipe_calories,
                COALESCE(SUM(i.carbohydrates * CAST(ri.quantity AS INT) * CAST(or2.quantity AS INT)), 0) as recipe_carbs,
                COALESCE(SUM(i.protein * CAST(ri.quantity AS INT) * CAST(or2.quantity AS INT)), 0) as recipe_protein
            FROM "order" o
                     LEFT JOIN order_recipe or2 ON o.order_id = or2.order_id
                     LEFT JOIN recipe r ON or2.recipe_id = r.recipe_id
                     LEFT JOIN recipe_ingredient ri ON r.recipe_id = ri.recipe_id
                     LEFT JOIN ingredient i ON ri.ingredient_id = i.ingredient_id
            WHERE o.customer_id = customer_id_param
            GROUP BY o.customer_id, o.order_id

            UNION ALL

            -- Calculate nutrition from directly ordered ingredients
            SELECT
                o.customer_id as cust_id,
                o.order_id as ord_id,
                COALESCE(SUM(i.calories * CAST(oi.quantity AS INT)), 0) as ingredient_calories,
                COALESCE(SUM(i.carbohydrates * CAST(oi.quantity AS INT)), 0) as ingredient_carbs,
                COALESCE(SUM(i.protein * CAST(oi.quantity AS INT)), 0) as ingredient_protein
            FROM "order" o
                     LEFT JOIN order_ingredient oi ON o.order_id = oi.order_id
                     LEFT JOIN ingredient i ON oi.ingredient_id = i.ingredient_id
            WHERE o.customer_id = customer_id_param
            GROUP BY o.customer_id, o.order_id
        )
        SELECT
            customer_id_param,
            ord_id,
            ROUND(AVG(recipe_calories))::INT as avg_calories,
            ROUND(AVG(recipe_carbs), 2)::DECIMAL(10,2) as avg_carbohydrates,
            ROUND(AVG(recipe_protein), 2)::DECIMAL(10,2) as avg_protein
        FROM order_nutrition
        GROUP BY customer_id_param, ord_id
        ORDER BY ord_id DESC;
END;
$$ LANGUAGE plpgsql;



-- Get recipes for a given allergen restriction
CREATE OR REPLACE FUNCTION get_recipes_by_allergen(allergen_name VARCHAR)
RETURNS TABLE (
    recipe_id INTEGER,
    recipe_name VARCHAR(50),
    net_price NUMERIC,
    preparation_time INTEGER,
    instructions TEXT
) AS $$
BEGIN
    RETURN QUERY
        SELECT
            r.recipe_id,
            r.recipe_name,
            r.net_price,
            r.preparation_time,
            r.instructions
        FROM
            recipe r
                JOIN
            recipe_allergen_restriction rar ON r.recipe_id = rar.recipe_id
                JOIN
            allergen_restriction ar ON rar.allergen_restriction_id = ar.allergen_restriction_id
        WHERE
            LOWER(ar.name) = LOWER(allergen_name)
        ORDER BY
            r.recipe_name;
END;
$$ LANGUAGE plpgsql;