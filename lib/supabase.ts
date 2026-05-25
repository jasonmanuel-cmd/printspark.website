import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role for admin operations
export function getServerSupabase() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Database table types
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
  payment_intent_id?: string;
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

// Helper functions for database operations
export async function createOrder(orderData: Partial<DbOrder>) {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderByNumber(orderNumber: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string
) {
  const updateData: Partial<DbOrder> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (trackingNumber) {
    updateData.tracking_number = trackingNumber;
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCustomerOrders(email: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function uploadDesignFile(
  file: File,
  orderId: string
): Promise<string> {
  const fileName = `${orderId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("design-files")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("design-files")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function createDesignFileRecord(fileData: Partial<DbDesignFile>) {
  const { data, error } = await supabase
    .from("design_files")
    .insert([fileData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderDesignFiles(orderId: string) {
  const { data, error } = await supabase
    .from("design_files")
    .select("*")
    .eq("order_id", orderId);

  if (error) throw error;
  return data;
}

export async function createOrUpdateCustomer(customerData: Partial<DbCustomer>) {
  const { data: existing } = await supabase
    .from("customers")
    .select("*")
    .eq("email", customerData.email)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("customers")
      .update(customerData)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("customers")
    .insert([customerData])
    .select()
    .single();

  if (error) throw error;
  return data;
}
