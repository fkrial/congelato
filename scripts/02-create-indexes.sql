-- Performance indexes for the bakery system

-- Products indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);

-- Orders indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Order items indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Recipe indexes
CREATE INDEX idx_recipes_product ON recipes(product_id);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_material ON recipe_ingredients(raw_material_id);

-- Raw materials indexes
CREATE INDEX idx_raw_materials_active ON raw_materials(is_active);
CREATE INDEX idx_raw_materials_stock ON raw_materials(current_stock);

-- Production planning indexes
CREATE INDEX idx_production_plans_date ON production_plans(date);
CREATE INDEX idx_production_plan_items_plan ON production_plan_items(plan_id);
CREATE INDEX idx_production_plan_items_product ON production_plan_items(product_id);

-- Inventory movements indexes
CREATE INDEX idx_inventory_movements_material ON inventory_movements(raw_material_id);
CREATE INDEX idx_inventory_movements_date ON inventory_movements(created_at);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(movement_type);

-- Customers indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_wholesale ON customers(is_wholesale);
