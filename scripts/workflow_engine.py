import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

class WorkflowEngine:
    def __init__(self):
        self.rules = []
        self.execution_history = []
        
    def add_rule(self, rule: Dict[str, Any]) -> str:
        """Agregar nueva regla de automatización"""
        rule_id = f"rule_{int(time.time())}"
        rule['id'] = rule_id
        rule['created_at'] = datetime.now().isoformat()
        rule['execution_count'] = 0
        self.rules.append(rule)
        return rule_id
    
    def evaluate_trigger(self, rule: Dict[str, Any], event_data: Dict[str, Any]) -> bool:
        """Evaluar si un trigger debe ejecutarse"""
        trigger = rule.get('trigger', {})
        trigger_type = trigger.get('type')
        conditions = trigger.get('conditions', {})
        
        # Verificar tipo de trigger
        if trigger_type != event_data.get('event_type'):
            return False
            
        # Evaluar condiciones específicas
        for condition_key, expected_value in conditions.items():
            actual_value = self._get_nested_value(event_data, condition_key)
            
            if not self._evaluate_condition(condition_key, actual_value, expected_value):
                return False
                
        return True
    
    def _evaluate_condition(self, key: str, actual: Any, expected: Any) -> bool:
        """Evaluar una condición específica"""
        if key.endswith('_min'):
            return actual >= expected
        elif key.endswith('_max'):
            return actual <= expected
        elif key == 'threshold':
            return actual < expected  # Para stock bajo
        elif isinstance(expected, str):
            return str(actual).lower() == expected.lower()
        elif isinstance(expected, (int, float)):
            return actual == expected
        else:
            return actual == expected
    
    def _get_nested_value(self, data: Dict[str, Any], path: str) -> Any:
        """Obtener valor anidado usando notación de punto"""
        keys = path.split('.')
        current = data
        
        for key in keys:
            if isinstance(current, dict) and key in current:
                current = current[key]
            else:
                return None
                
        return current
    
    def execute_actions(self, actions: List[Dict[str, Any]], context_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Ejecutar lista de acciones"""
        results = []
        
        for action in actions:
            try:
                result = self._execute_single_action(action, context_data)
                results.append({
                    'action_type': action.get('type'),
                    'success': result.get('success', False),
                    'message': result.get('message', ''),
                    'timestamp': datetime.now().isoformat()
                })
            except Exception as e:
                results.append({
                    'action_type': action.get('type'),
                    'success': False,
                    'message': str(e),
                    'timestamp': datetime.now().isoformat()
                })
                
        return results
    
    def _execute_single_action(self, action: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Ejecutar una acción individual"""
        action_type = action.get('type')
        parameters = action.get('parameters', {})
        
        if action_type == 'send_notification':
            return self._send_notification(parameters, context)
        elif action_type == 'reorder_inventory':
            return self._reorder_inventory(parameters, context)
        elif action_type == 'update_status':
            return self._update_status(parameters, context)
        elif action_type == 'send_whatsapp':
            return self._send_whatsapp(parameters, context)
        elif action_type == 'create_task':
            return self._create_task(parameters, context)
        else:
            return {'success': False, 'message': f'Unknown action type: {action_type}'}
    
    def _send_notification(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Simular envío de notificación"""
        title = self._replace_variables(params.get('title', ''), context)
        message = self._replace_variables(params.get('message', ''), context)
        
        print(f"📧 NOTIFICATION: {title} - {message}")
        return {'success': True, 'message': 'Notification sent'}
    
    def _reorder_inventory(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Simular reorden de inventario"""
        material_id = params.get('material_id')
        quantity = params.get('quantity')
        supplier_id = params.get('supplier_id')
        
        print(f"📦 REORDER: {quantity} units of {material_id} from {supplier_id}")
        return {'success': True, 'message': f'Reorder created for {material_id}'}
    
    def _update_status(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Simular actualización de estado"""
        new_status = params.get('new_status')
        entity_id = context.get('entity_id', 'unknown')
        
        print(f"🔄 STATUS UPDATE: {entity_id} -> {new_status}")
        return {'success': True, 'message': f'Status updated to {new_status}'}
    
    def _send_whatsapp(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Simular envío de WhatsApp"""
        phone = self._replace_variables(params.get('customer_phone', ''), context)
        template = self._replace_variables(params.get('template', ''), context)
        
        print(f"📱 WHATSAPP: {phone} - {template}")
        return {'success': True, 'message': 'WhatsApp sent'}
    
    def _create_task(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Simular creación de tarea"""
        task_title = self._replace_variables(params.get('title', ''), context)
        task_description = self._replace_variables(params.get('description', ''), context)
        
        print(f"✅ TASK CREATED: {task_title} - {task_description}")
        return {'success': True, 'message': 'Task created'}
    
    def _replace_variables(self, template: str, context: Dict[str, Any]) -> str:
        """Reemplazar variables en plantillas"""
        import re
        
        def replace_match(match):
            var_path = match.group(1)
            value = self._get_nested_value(context, var_path)
            return str(value) if value is not None else match.group(0)
        
        return re.sub(r'\{\{([^}]+)\}\}', replace_match, template)
    
    def process_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Procesar un evento y ejecutar reglas aplicables"""
        executed_rules = []
        
        for rule in self.rules:
            if not rule.get('enabled', True):
                continue
                
            if self.evaluate_trigger(rule, event_data):
                print(f"🎯 Executing rule: {rule.get('name', rule.get('id'))}")
                
                # Ejecutar acciones
                action_results = self.execute_actions(rule.get('actions', []), event_data)
                
                # Actualizar contador
                rule['execution_count'] = rule.get('execution_count', 0) + 1
                rule['last_executed'] = datetime.now().isoformat()
                
                executed_rules.append({
                    'rule_id': rule.get('id'),
                    'rule_name': rule.get('name'),
                    'action_results': action_results,
                    'success': all(result.get('success', False) for result in action_results)
                })
                
                # Guardar en historial
                self.execution_history.append({
                    'rule_id': rule.get('id'),
                    'event_data': event_data,
                    'action_results': action_results,
                    'timestamp': datetime.now().isoformat()
                })
        
        return {
            'success': True,
            'executed_rules': executed_rules,
            'total_executed': len(executed_rules)
        }

def main():
    """Función de prueba"""
    engine = WorkflowEngine()
    
    # Agregar regla de ejemplo
    rule = {
        'name': 'Reorden Automático de Harina',
        'description': 'Reordena harina cuando el stock esté bajo',
        'trigger': {
            'type': 'inventory_low',
            'conditions': {
                'material_id': 'flour_001',
                'current_stock': 5,
                'threshold': 10
            }
        },
        'actions': [
            {
                'type': 'send_notification',
                'parameters': {
                    'title': 'Stock Bajo - {{material_name}}',
                    'message': 'Stock actual: {{current_stock}}kg, se necesita reorden'
                }
            },
            {
                'type': 'reorder_inventory',
                'parameters': {
                    'material_id': 'flour_001',
                    'quantity': 50,
                    'supplier_id': 'supplier_001'
                }
            }
        ],
        'enabled': True
    }
    
    engine.add_rule(rule)
    
    # Simular evento
    event = {
        'event_type': 'inventory_low',
        'material_id': 'flour_001',
        'material_name': 'Harina de Trigo',
        'current_stock': 5,
        'timestamp': datetime.now().isoformat()
    }
    
    result = engine.process_event(event)
    print(f"\n📊 Execution Result: {json.dumps(result, indent=2)}")

if __name__ == "__main__":
    main()
