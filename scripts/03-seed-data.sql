-- Sample data for the bakery system (v2 - Cleaned)

-- Insert categories (ONCE ONLY)
INSERT INTO categories (name, description, image_url) VALUES
('Panes', 'Variedad de panes artesanales frescos', '/images/categories/bread.jpg'),
('Pasteles', 'Pasteles y tortas para toda ocasión', '/images/categories/cakes.jpg'),
('Galletas', 'Galletas caseras y cookies', '/images/categories/cookies.jpg'),
('Bollería', 'Croissants, muffins y bollería dulce', '/images/categories/pastries.jpg'),
('Postres', 'Postres individuales y familiares', '/images/categories/desserts.jpg');

-- Insert raw materials
INSERT INTO raw_materials (name, unit, cost_per_unit, current_stock, minimum_stock, supplier, category) VALUES
('Harina de trigo', 'kg', 1.50, 100.0, 20.0, 'Molinos del Sur', 'harinas'),
('Azúcar blanca', 'kg', 2.00, 50.0, 10.0, 'Azucarera Nacional', 'endulzantes'),
('Mantequilla', 'kg', 8.50, 25.0, 5.0, 'Lácteos Premium', 'lacteos'),
('Huevos', 'unidad', 0.25, 200.0, 50.0, 'Granja San José', 'otros'),
('Levadura fresca', 'kg', 12.00, 5.0, 1.0, 'Levaduras Industriales', 'otros'),
('Sal', 'kg', 0.80, 10.0, 2.0, 'Sal Marina', 'especias'),
('Leche entera', 'L', 1.20, 30.0, 10.0, 'Lácteos Premium', 'lacteos'),
('Chocolate negro', 'kg', 15.00, 10.0, 2.0, 'Chocolates Finos', 'otros'),
('Vainilla', 'ml', 0.50, 500.0, 100.0, 'Esencias Naturales', 'especias'),
('Canela molida', 'kg', 25.00, 2.0, 0.5, 'Especias del Mundo', 'especias');

-- Insert sample products
INSERT INTO products (name, description, category_id, base_price, cost_price, is_featured) VALUES
('Pan Integral', 'Pan integral con semillas, rico en fibra', 1, 3.50, 1.20, true),
('Croissant de Mantequilla', 'Croissant francés tradicional', 4, 2.80, 1.00, true),
('Tarta de Chocolate', 'Tarta de chocolate con ganache', 2, 25.00, 8.50, true),
('Galletas de Avena', 'Galletas caseras con avena y pasas', 3, 1.50, 0.60, false),
('Muffin de Arándanos', 'Muffin esponjoso con arándanos frescos', 4, 3.20, 1.10, true);

-- Insert product variants
INSERT INTO product_variants (product_id, name, price_modifier) VALUES
(1, 'Pequeño (400g)', 0.00),
(1, 'Grande (800g)', 2.50),
(3, '6 porciones', 0.00),
(3, '8 porciones', 8.00);

-- Insert admin users
-- **IMPORTANTE**: Reemplaza el hash del admin con el que generaste para "admin123".
-- El segundo hash es para "baker123".
INSERT INTO admin_users (email, password_hash, first_name, last_name, role) VALUES
('admin@panaderia.com', '$2b$10$YoTFdbXZHe6QsJlgP3TkQ.cIrKYmOvLNJ7Qtr/pypK0h6i3NifHGO', 'Admin', 'Principal', 'admin'),
('baker@panaderia.com', '$2b$10$Rd.Zn7BvfuR3rxSjNHQC4ewqnxKe5bOLyyigh2N3lpqntWQ4MGoDO', 'Panadero', 'Uno', 'baker');