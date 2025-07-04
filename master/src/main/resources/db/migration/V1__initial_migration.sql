-- Create TABLE customer
CREATE TABLE IF NOT EXISTS customer (
    customer_id       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    last_name         VARCHAR(50) NOT NULL,
    first_name        VARCHAR(50) NOT NULL,
    date_of_birth     DATE,
    street            VARCHAR(50),
    house_number      VARCHAR(6),
    zip_code          VARCHAR(5),
    city              VARCHAR(50),
    phone             VARCHAR(25),
    email             VARCHAR(50)
);

-- Create TABLE supplier
CREATE TABLE IF NOT EXISTS supplier (
    supplier_id       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    supplier_name     VARCHAR(50) NOT NULL,
    street            VARCHAR(50),
    house_number      VARCHAR(6),
    zip_code          VARCHAR(5),
    city              VARCHAR(50),
    phone             VARCHAR(25),
    email             VARCHAR(50)
);

-- Create TABLE ingredient
CREATE TABLE IF NOT EXISTS ingredient (
    ingredient_id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ingredient_name   VARCHAR(50) NOT NULL,
    unit              VARCHAR(25),
    net_price         DECIMAL(10,2),
    stock             INTEGER,
    supplier_id       INTEGER,
    calories          INTEGER,
    carbohydrates     DECIMAL(10,2),
    protein           DECIMAL(10,2),
    FOREIGN KEY (supplier_id) REFERENCES supplier (supplier_id)
);

-- Create TABLE "order"
CREATE TABLE IF NOT EXISTS "order" (
    order_id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id       INTEGER NOT NULL,
    order_date        DATE NOT NULL,
    invoice_amount    DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
);

-- Create TABLE order_ingredient
CREATE TABLE IF NOT EXISTS order_ingredient (
    order_id          INTEGER NOT NULL,
    ingredient_id     INTEGER NOT NULL,
    quantity          INTEGER NOT NULL,
    PRIMARY KEY (order_id, ingredient_id),
    FOREIGN KEY (order_id) REFERENCES "order" (order_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient (ingredient_id)
);