"""
Bakery Cost Calculator
Calculates recipe costs and profit margins
"""

def calculate_recipe_cost(ingredients):
    """
    Calculate total cost of a recipe based on ingredients
    
    Args:
        ingredients: List of dicts with 'quantity', 'unit_cost', 'unit'
    
    Returns:
        dict: Total cost and cost breakdown
    """
    total_cost = 0
    breakdown = []
    
    for ingredient in ingredients:
        ingredient_cost = ingredient['quantity'] * ingredient['unit_cost']
        total_cost += ingredient_cost
        
        breakdown.append({
            'name': ingredient.get('name', 'Unknown'),
            'quantity': ingredient['quantity'],
            'unit': ingredient.get('unit', 'units'),
            'unit_cost': ingredient['unit_cost'],
            'total_cost': round(ingredient_cost, 4)
        })
    
    return {
        'total_cost': round(total_cost, 2),
        'breakdown': breakdown
    }

def calculate_profit_margin(selling_price, cost_price):
    """
    Calculate profit margin percentage
    
    Args:
        selling_price: Final selling price
        cost_price: Total cost to produce
    
    Returns:
        dict: Profit amount and margin percentage
    """
    profit = selling_price - cost_price
    margin_percentage = (profit / selling_price) * 100 if selling_price > 0 else 0
    
    return {
        'profit': round(profit, 2),
        'margin_percentage': round(margin_percentage, 2),
        'cost_price': cost_price,
        'selling_price': selling_price
    }

def suggest_selling_price(cost_price, target_margin=40):
    """
    Suggest selling price based on target margin
    
    Args:
        cost_price: Cost to produce the item
        target_margin: Desired profit margin percentage (default 40%)
    
    Returns:
        float: Suggested selling price
    """
    suggested_price = cost_price / (1 - target_margin / 100)
    return round(suggested_price, 2)

def calculate_batch_requirements(orders, recipes):
    """
    Calculate raw material requirements for a batch of orders
    
    Args:
        orders: List of order items with product_id and quantity
        recipes: Dict mapping product_id to recipe ingredients
    
    Returns:
        dict: Total raw material requirements
    """
    requirements = {}
    
    for order in orders:
        product_id = order['product_id']
        quantity = order['quantity']
        
        if product_id in recipes:
            recipe = recipes[product_id]
            for ingredient in recipe['ingredients']:
                material_id = ingredient['raw_material_id']
                needed_quantity = ingredient['quantity'] * quantity
                
                if material_id in requirements:
                    requirements[material_id] += needed_quantity
                else:
                    requirements[material_id] = needed_quantity
    
    return requirements

# Example usage
if __name__ == "__main__":
    # Example recipe calculation
    bread_ingredients = [
        {'name': 'Harina', 'quantity': 1.0, 'unit_cost': 1.50, 'unit': 'kg'},
        {'name': 'Levadura', 'quantity': 0.02, 'unit_cost': 12.00, 'unit': 'kg'},
        {'name': 'Sal', 'quantity': 0.02, 'unit_cost': 0.80, 'unit': 'kg'},
        {'name': 'Agua', 'quantity': 0.6, 'unit_cost': 0.001, 'unit': 'L'}
    ]
    
    cost_result = calculate_recipe_cost(bread_ingredients)
    print("Recipe Cost Calculation:")
    print(f"Total Cost: ${cost_result['total_cost']}")
    
    # Calculate profit margin
    selling_price = 3.50
    profit_result = calculate_profit_margin(selling_price, cost_result['total_cost'])
    print(f"\nProfit Analysis:")
    print(f"Selling Price: ${profit_result['selling_price']}")
    print(f"Cost: ${profit_result['cost_price']}")
    print(f"Profit: ${profit_result['profit']}")
    print(f"Margin: {profit_result['margin_percentage']}%")
    
    # Suggest optimal price
    suggested = suggest_selling_price(cost_result['total_cost'], 45)
    print(f"\nSuggested price for 45% margin: ${suggested}")
