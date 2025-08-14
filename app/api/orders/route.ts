import { type NextRequest, NextResponse } from 'next/server';
import getPool from '@/lib/db/postgres';

// GET: Obtiene la lista de todos los pedidos con filtros
export async function GET(request: NextRequest) {
  // ... (tu código GET existente, no necesita cambios)
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search');
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  try {
    const pool = getPool();
    let query = `
      SELECT 
        o.id, o.order_number, o.status, o.total, o.delivery_date, 
        o.created_at, o.order_type, c.first_name, c.last_name, c.phone
      FROM orders AS o
      LEFT JOIN customers AS c ON o.customer_id = c.id
    `;
    
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (searchTerm) {
      conditions.push(`(o.order_number ILIKE $${paramIndex} OR c.first_name ILIKE $${paramIndex} OR c.last_name ILIKE $${paramIndex})`);
      queryParams.push(`%${searchTerm}%`);
      paramIndex++;
    }
    if (status && status !== 'all') {
      conditions.push(`o.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }
    if (type && type !== 'all') {
      conditions.push(`o.order_type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }
    if (dateFrom) {
        conditions.push(`o.created_at >= $${paramIndex}`);
        queryParams.push(dateFrom);
        paramIndex++;
    }
    if (dateTo) {
        conditions.push(`o.created_at <= $${paramIndex}`);
        queryParams.push(dateTo);
        paramIndex++;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY o.created_at DESC;';

    const { rows } = await pool.query(query, queryParams);
    return NextResponse.json({ orders: rows });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: String(error) }, { status: 500 });
  }
}

// POST: Crea un nuevo pedido
export async function POST(request: Request) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { customer, items, deliveryDate, notes, paymentMethod } = body;

    if (!customer || !items || items.length === 0) {
        return NextResponse.json({ message: "Datos de cliente y al menos un producto son requeridos." }, { status: 400 });
    }

    let subtotal = 0;
    let totalCost = 0;

    const productIds = items.map((item: any) => parseInt(item.productId));
    if (productIds.length === 0) {
        throw new Error("No se pueden crear pedidos sin productos.");
    }
    
    const costRes = await client.query('SELECT id, cost_price FROM products WHERE id = ANY($1::int[])', [productIds]);
    const costMap = new Map(costRes.rows.map(row => [row.id, parseFloat(row.cost_price || 0)]));

    for (const item of items) {
      subtotal += parseFloat(item.totalPrice);
      const itemCost = costMap.get(parseInt(item.productId)) || parseFloat(item.unitPrice) * 0.4;
      totalCost += itemCost * item.quantity;
      item.unit_cost = itemCost;
      item.total_cost = itemCost * item.quantity;
    }
    
    const discount = 0;
    const tax = 0;
    const total = subtotal - discount + tax;
    const profit = total - totalCost;

    await client.query('BEGIN');

    let customerId;
    const customerRes = await client.query('SELECT id FROM customers WHERE phone = $1 OR (email = $2 AND email IS NOT NULL AND email != \'\') LIMIT 1', [customer.phone, customer.email]);
    
    if (customerRes.rows.length > 0) {
      customerId = customerRes.rows[0].id;
    } else {
      const [firstName, ...lastNameParts] = customer.name.split(' ');
      const newCustomerRes = await client.query(
        'INSERT INTO customers (first_name, last_name, email, phone, address, is_wholesale) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [firstName, lastNameParts.join(' '), customer.email, customer.phone, customer.address, customer.type === 'wholesale']
      );
      customerId = newCustomerRes.rows[0].id;
    }

    const orderNumber = `ORD-${Date.now()}`;
    const orderQuery = `
      INSERT INTO orders (
        customer_id, order_number, status, subtotal, discount, tax, total, total_cost, profit, 
        delivery_date, notes, payment_method, order_type, payment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id;
    `;
    
    // *** LA CORRECCIÓN ESTÁ AQUÍ ***
    // Ahora el array tiene 14 valores, igual que las columnas.
    const orderValues = [
      customerId,       // 1
      orderNumber,      // 2
      'pending',        // 3 (status)
      subtotal,         // 4
      discount,         // 5
      tax,              // 6
      total,            // 7
      totalCost,        // 8
      profit,           // 9
      deliveryDate || null, // 10
      notes,            // 11
      paymentMethod,    // 12
      customer.type,    // 13
      'pending'         // 14 (payment_status)
    ];
    const orderResult = await client.query(orderQuery, orderValues);
    const newOrderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, unit_cost, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [newOrderId, item.productId, item.quantity, item.unitPrice, item.totalPrice, item.unit_cost, item.total_cost]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({ message: "Pedido creado con éxito", orderId: newOrderId }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear el pedido:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}