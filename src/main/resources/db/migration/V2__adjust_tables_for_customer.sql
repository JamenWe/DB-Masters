CREATE TABLE IF NOT EXISTS recipe (
    recipe_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    recipe_name VARCHAR(50) NOT NULL,
    net_price DECIMAL(10,2) NOT NULL,
    preparation_time INTEGER,
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS recipe_ingredient (
    recipe_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    quantity VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient (ingredient_id)
);

CREATE TABLE IF NOT EXISTS order_recipe (
    order_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    quantity INTEGER,
    PRIMARY KEY (recipe_id, order_id),
    FOREIGN KEY (order_id) REFERENCES "order" (order_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id)
);

CREATE TABLE IF NOT EXISTS nutritional_category (
    nutritional_category_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_nutritional_category (
    recipe_id INTEGER NOT NULL,
    nutritional_category_id INTEGER NOT NULL,
    PRIMARY KEY (recipe_id, nutritional_category_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id),
    FOREIGN KEY (nutritional_category_id) REFERENCES nutritional_category (nutritional_category_id)
);

CREATE TABLE IF NOT EXISTS allergen_restriction (
    allergen_restriction_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_allergen_restriction (
    recipe_id INTEGER NOT NULL,
    allergen_restriction_id INTEGER NOT NULL,
    PRIMARY KEY (recipe_id, allergen_restriction_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id),
    FOREIGN KEY (allergen_restriction_id) REFERENCES allergen_restriction (allergen_restriction_id)
);