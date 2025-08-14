import json
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import math

class DemandPredictor:
    def __init__(self):
        self.seasonal_factors = {
            'monday': 0.8,
            'tuesday': 0.9,
            'wednesday': 1.0,
            'thursday': 1.1,
            'friday': 1.3,
            'saturday': 1.5,
            'sunday': 1.2
        }
        
        self.monthly_factors = {
            1: 0.9,   # Enero
            2: 0.95,  # Febrero
            3: 1.0,   # Marzo
            4: 1.1,   # Abril
            5: 1.15,  # Mayo
            6: 1.2,   # Junio
            7: 1.1,   # Julio
            8: 1.0,   # Agosto
            9: 1.05,  # Septiembre
            10: 1.1,  # Octubre
            11: 1.25, # Noviembre
            12: 1.4   # Diciembre
        }

    def linear_regression(self, x_data: List[float], y_data: List[float]) -> Tuple[float, float]:
        """Implementa regresión lineal simple"""
        n = len(x_data)
        if n == 0:
            return 0, 0
            
        sum_x = sum(x_data)
        sum_y = sum(y_data)
        sum_xy = sum(x * y for x, y in zip(x_data, y_data))
        sum_x2 = sum(x * x for x in x_data)
        
        # Calcular pendiente y intercepto
        slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x)
        intercept = (sum_y - slope * sum_x) / n
        
        return slope, intercept

    def moving_average(self, data: List[float], window: int = 7) -> List[float]:
        """Calcula media móvil"""
        if len(data) < window:
            return data
            
        result = []
        for i in range(len(data)):
            if i < window - 1:
                result.append(sum(data[:i+1]) / (i+1))
            else:
                result.append(sum(data[i-window+1:i+1]) / window)
        return result

    def exponential_smoothing(self, data: List[float], alpha: float = 0.3) -> List[float]:
        """Suavizado exponencial"""
        if not data:
            return []
            
        result = [data[0]]
        for i in range(1, len(data)):
            smoothed = alpha * data[i] + (1 - alpha) * result[i-1]
            result.append(smoothed)
        return result

    def predict_daily_demand(self, historical_sales: List[Dict], product_id: str, days_ahead: int = 7) -> List[Dict]:
        """Predice demanda diaria para un producto"""
        # Filtrar datos del producto
        product_sales = [sale for sale in historical_sales if sale.get('product_id') == product_id]
        
        if len(product_sales) < 7:
            # Si no hay suficientes datos, usar promedio simple
            avg_daily = sum(sale.get('quantity', 0) for sale in product_sales) / max(len(product_sales), 1)
            predictions = []
            
            for i in range(days_ahead):
                future_date = datetime.now() + timedelta(days=i+1)
                day_name = future_date.strftime('%A').lower()
                seasonal_factor = self.seasonal_factors.get(day_name, 1.0)
                monthly_factor = self.monthly_factors.get(future_date.month, 1.0)
                
                predicted_quantity = avg_daily * seasonal_factor * monthly_factor
                
                predictions.append({
                    'date': future_date.strftime('%Y-%m-%d'),
                    'predicted_quantity': round(predicted_quantity, 2),
                    'confidence': 0.6,  # Baja confianza con pocos datos
                    'factors': {
                        'seasonal': seasonal_factor,
                        'monthly': monthly_factor
                    }
                })
            
            return predictions

        # Preparar datos para análisis
        dates = [datetime.strptime(sale['date'], '%Y-%m-%d') for sale in product_sales]
        quantities = [sale['quantity'] for sale in product_sales]
        
        # Ordenar por fecha
        sorted_data = sorted(zip(dates, quantities))
        dates, quantities = zip(*sorted_data)
        
        # Convertir fechas a números para regresión
        base_date = min(dates)
        x_data = [(date - base_date).days for date in dates]
        
        # Aplicar suavizado exponencial
        smoothed_quantities = self.exponential_smoothing(quantities)
        
        # Calcular tendencia con regresión lineal
        slope, intercept = self.linear_regression(x_data, smoothed_quantities)
        
        # Generar predicciones
        predictions = []
        last_date = max(dates)
        
        for i in range(days_ahead):
            future_date = last_date + timedelta(days=i+1)
            days_from_base = (future_date - base_date).days
            
            # Predicción base usando tendencia
            base_prediction = slope * days_from_base + intercept
            
            # Aplicar factores estacionales
            day_name = future_date.strftime('%A').lower()
            seasonal_factor = self.seasonal_factors.get(day_name, 1.0)
            monthly_factor = self.monthly_factors.get(future_date.month, 1.0)
            
            final_prediction = max(0, base_prediction * seasonal_factor * monthly_factor)
            
            # Calcular confianza basada en cantidad de datos
            confidence = min(0.95, 0.5 + (len(product_sales) / 100))
            
            predictions.append({
                'date': future_date.strftime('%Y-%m-%d'),
                'predicted_quantity': round(final_prediction, 2),
                'confidence': round(confidence, 2),
                'factors': {
                    'trend': round(slope, 4),
                    'seasonal': seasonal_factor,
                    'monthly': monthly_factor
                }
            })
        
        return predictions

    def predict_inventory_needs(self, predictions: List[Dict], recipes: List[Dict]) -> Dict:
        """Predice necesidades de inventario basado en predicciones de demanda"""
        inventory_needs = {}
        
        for prediction in predictions:
            product_id = prediction.get('product_id')
            predicted_quantity = prediction.get('predicted_quantity', 0)
            
            # Buscar receta del producto
            recipe = next((r for r in recipes if r['product_id'] == product_id), None)
            if not recipe:
                continue
                
            # Calcular ingredientes necesarios
            for ingredient in recipe.get('ingredients', []):
                ingredient_id = ingredient['material_id']
                quantity_per_unit = ingredient['quantity']
                total_needed = predicted_quantity * quantity_per_unit
                
                if ingredient_id in inventory_needs:
                    inventory_needs[ingredient_id] += total_needed
                else:
                    inventory_needs[ingredient_id] = total_needed
        
        return inventory_needs

    def optimize_production_schedule(self, predictions: List[Dict], capacity: Dict) -> List[Dict]:
        """Optimiza horario de producción basado en predicciones"""
        schedule = []
        daily_capacity = capacity.get('daily_units', 100)
        
        for prediction in predictions:
            date = prediction['date']
            predicted_quantity = prediction['predicted_quantity']
            
            # Calcular días de producción necesarios
            production_days = math.ceil(predicted_quantity / daily_capacity)
            
            # Programar producción con buffer
            buffer_factor = 1.2  # 20% extra por seguridad
            adjusted_quantity = predicted_quantity * buffer_factor
            
            schedule.append({
                'date': date,
                'product_id': prediction.get('product_id'),
                'planned_quantity': round(adjusted_quantity, 2),
                'production_days_needed': production_days,
                'priority': 'high' if prediction['confidence'] > 0.8 else 'medium',
                'confidence': prediction['confidence']
            })
        
        return schedule

def main():
    """Función principal para testing"""
    predictor = DemandPredictor()
    
    # Datos de ejemplo
    historical_sales = [
        {'product_id': 'bread_001', 'date': '2024-01-01', 'quantity': 50},
        {'product_id': 'bread_001', 'date': '2024-01-02', 'quantity': 45},
        {'product_id': 'bread_001', 'date': '2024-01-03', 'quantity': 60},
        {'product_id': 'bread_001', 'date': '2024-01-04', 'quantity': 55},
        {'product_id': 'bread_001', 'date': '2024-01-05', 'quantity': 70},
        {'product_id': 'bread_001', 'date': '2024-01-06', 'quantity': 80},
        {'product_id': 'bread_001', 'date': '2024-01-07', 'quantity': 65},
    ]
    
    # Generar predicciones
    predictions = predictor.predict_daily_demand(historical_sales, 'bread_001', 7)
    
    print("Predicciones de Demanda:")
    for pred in predictions:
        print(f"Fecha: {pred['date']}, Cantidad: {pred['predicted_quantity']}, Confianza: {pred['confidence']}")
    
    return predictions

if __name__ == "__main__":
    main()
