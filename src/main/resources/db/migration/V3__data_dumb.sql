INSERT INTO customer (last_name, first_name, date_of_birth, street, house_number, zip_code, city, phone, email) VALUES
('Wellensteyn', 'Kira', '1990-05-05', 'Eppendorfer Landstrasse', '104', '20249', 'Hamburg', '040/443322', 'k.wellensteyn@yahoo.de'),
('Foede', 'Dorothea', '2000-03-24', 'Ohmstrasse', '23', '22765', 'Hamburg', '040/543822', 'd.foede@web.de'),
('Leberer', 'Sigrid', '1989-09-21', 'Bilser Berg', '6', '20459', 'Hamburg', '0175/1234588', 'sigrid@leberer.de'),
('Soerensen', 'Hanna', '1974-04-03', 'Alter Teichweg', '95', '22049', 'Hamburg', '040/634578', 'h.soerensen@yahoo.de'),
('Schnitter', 'Marten', '1964-04-17', 'Stuebels', '10', '22835', 'Barsbuettel', '0176/447587', 'schni_mart@gmail.com'),
('Maurer', 'Belinda', '1978-09-09', 'Grotelertwiete', '4a', '21075', 'Hamburg', '040/332189', 'belinda1978@yahoo.de'),
('Gessert', 'Armin', '1978-01-29', 'Kuestersweg', '3', '21079', 'Hamburg', '040/67890', 'armin@gessert.de'),
('Haessig', 'Jean-Marc', '1982-08-30', 'Neugrabener Bahnhofstrasse', '30', '21149', 'Hamburg', '0178-67013390', 'jm@haessig.de'),
('Urocki', 'Eric', '1999-12-04', 'Elbchaussee', '228', '22605', 'Hamburg', '0152-96701390', 'urocki@outlook.de');

INSERT INTO supplier (supplier_name, street, house_number, zip_code, city, phone, email) VALUES
('Bio Farm Mueller', 'Dorfstrasse', '74', '24354', 'Weseby', '04354-9080', 'mueller@biohof.de'),
('Old Country Fruit Farm', 'Westerjork 74', '76', '21635', 'Jork', '04162-4523', 'info@biohof-altesland.de'),
('Henning Dairy', 'Dairy Road Customer', '13', '19217', 'Dechow', '038873-8976', 'info@molkerei-henning.de');

-- Insert data into ingredient table
INSERT INTO ingredient (ingredient_name, unit, net_price, stock, supplier_id, calories, carbohydrates, protein) VALUES
('Zucchini', 'Piece', 0.89, 100, 1, 19, 2, 1.6),
('Onion', 'Piece', 0.15, 50, 1, 28, 4.9, 1.20),
('Tomato', 'Piece', 0.45, 50, 1, 18, 2.6, 1),
('Shallot', 'Piece', 0.20, 500, 1, 25, 3.3, 1.5),
('Carrot', 'Piece', 0.30, 500, 1, 41, 10, 0.9),
('Potato', 'Piece', 0.15, 1500, 1, 71, 14.6, 2),
('Arugula', 'Bunch', 0.90, 10, 1, 27, 2.1, 2.6),
('Leek', 'Piece', 1.2, 35, 1, 29, 3.3, 2.1),
('Garlic', 'Piece', 0.25, 250, 1, 141, 28.4, 6.1),
('Basil', 'Bunch', 1.3, 10, 1, 41, 5.1, 3.1),
('Sweet Potato', 'Piece', 2.0, 200, 1, 86, 20, 1.6),
('Chive', 'Bunch', 0.9, 10, 1, 28, 1, 3),
('Apple', 'Piece', 1.2, 750, 2, 54, 14.4, 0.3),
('Whole Milk 3.5%', 'Liter', 1.5, 50, 3, 65, 4.7, 3.4),
('Mozzarella', 'Pack', 3.5, 20, 3, 241, 1, 18.1),
('Butter', 'Piece', 3.0, 50, 3, 741, 0.6, 0.7),
('Egg', 'Piece', 0.4, 300, 2, 137, 1.5, 11.9),
('Vienna Sausages', 'Pair', 1.8, 40, 1, 331, 1.2, 9.9),
('Tofu Sausages', 'Piece', 1.8, 20, 3, 252, 7, 17),
('Couscous', 'Pack', 1.9, 15, 2, 351, 67, 12),
('Vegetable Broth', 'Cube', 0.2, 4000, 1, 1, 0.5, 0.5),
('Chickpeas', 'Can', 1.0, 400, 3, 150, 21.2, 9);

-- Insert data into orders table
INSERT INTO "order" (customer_id, order_date, invoice_amount) VALUES
(1, '2020-07-01', 6.21),
(2, '2020-07-08', 32.96),
(3, '2020-08-01', 24.08),
(4, '2020-08-02', 19.90),
(5, '2020-08-02', 6.47),
(6, '2020-08-10', 6.96),
(7, '2020-08-10', 2.41),
(8, '2020-08-10', 13.80),
(9, '2020-08-10', 8.67),
(7, '2020-08-15', 17.98),
(5, '2020-08-12', 8.67),
(3, '2020-08-13', 20.87);


INSERT INTO order_ingredient (order_id, ingredient_id, quantity) VALUES
(1, 1, 5),
(1, 2, 3),
(1, 6, 2),
(1, 4, 3),
(2, 19, 10),
(2, 5, 5),
(2, 3, 4),
(2, 20, 5),
(3, 22, 15),
(3, 14, 5),
(4, 19, 7),
(4, 16, 2),
(5, 2, 4),
(5, 4, 5),
(5, 1, 5),
(7, 9, 9),
(6, 10, 5),
(8, 12, 5),
(8, 8, 7),
(9, 7, 4),
(9, 12, 5),
(10, 11, 7),
(10, 17, 7),
(11, 18, 2),
(11, 12, 5),
(12, 10, 15);