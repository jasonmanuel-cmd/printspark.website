import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL");
  return neon(url);
}

export interface DbOrder {
  id: string;
  order_number: string;
  status: string;
  items: unknown;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_address: unknown;
  shipping_method: string;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
  customer_email: string;
  customer_phone: string;
  payment_id?: string;
  payment_status?: string;
  square_order_id?: string;
  payment_error?: string;
  fulfillment_partner?: string;
  fulfillment_order_id?: string;
  fulfillment_status?: string;
  notes?: string;
}

export interface DbDesignFile {
  id: string;
  order_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  status: string;
  notes?: string;
}

export interface DbCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  company?: string;
  created_at: string;
}

export async function createOrder(orderData: Partial<DbOrder>) {
  const sql = getDb();
  const keys = Object.keys(orderData);
  const values = Object.values(orderData);
  const cols = keys.join(", ");
  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
  const result = await sql.query(
    `INSERT INTO orders (${cols}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return result[0] as DbOrder;
}

export async function getOrderByNumber(orderNumber: string) {
  const sql = getDb();
  const result = await sql.query(
    "SELECT * FROM orders WHERE order_number = $1",
    [orderNumber]
  );
  return result.length > 0 ? (result[0] as DbOrder) : null;
}

export async function updateOrder(
  orderId: string,
  updateData: Partial<DbOrder> & Record<string, any>
) {
  const sql = getDb();
  const keys = Object.keys(updateData);
  const values = Object.values(updateData);
  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const params = [...values, orderId];
  const result = await sql.query(
    `UPDATE orders SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    params
  );
  return result[0] as DbOrder;
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string
) {
  const sql = getDb();
  if (trackingNumber) {
    const result = await sql.query(
      "UPDATE orders SET status = $1, tracking_number = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [status, trackingNumber, orderId]
    );
    return result[0] as DbOrder;
  }
  const result = await sql.query(
    "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [status, orderId]
  );
  return result[0] as DbOrder;
}

export async function getCustomerOrders(email: string) {
  const sql = getDb();
  const result = await sql.query(
    "SELECT * FROM orders WHERE customer_email = $1 ORDER BY created_at DESC",
    [email]
  );
  return result as DbOrder[];
}

export async function createDesignFileRecord(fileData: Partial<DbDesignFile>) {
  const sql = getDb();
  const keys = Object.keys(fileData);
  const values = Object.values(fileData);
  const cols = keys.join(", ");
  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
  const result = await sql.query(
    `INSERT INTO design_files (${cols}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return result[0] as DbDesignFile;
}

export async function getOrderDesignFiles(orderId: string) {
  const sql = getDb();
  const result = await sql.query(
    "SELECT * FROM design_files WHERE order_id = $1",
    [orderId]
  );
  return result as DbDesignFile[];
}

export async function createOrUpdateCustomer(customerData: Partial<DbCustomer>) {
  const sql = getDb();
  const existing = await sql.query(
    "SELECT * FROM customers WHERE email = $1",
    [customerData.email]
  );

  if (existing.length > 0) {
    const keys = Object.keys(customerData).filter(
      (k) => k !== "id" && k !== "created_at"
    );
    const values = keys.map((k) => (customerData as any)[k]);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const result = await sql.query(
      `UPDATE customers SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, existing[0].id]
    );
    return result[0] as DbCustomer;
  }

  const keys = Object.keys(customerData).filter((k) => k !== "id");
  const values = keys.map((k) => (customerData as any)[k]);
  const cols = keys.join(", ");
  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
  const result = await sql.query(
    `INSERT INTO customers (${cols}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return result[0] as DbCustomer;
}
