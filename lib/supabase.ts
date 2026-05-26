import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceKey);
}

export function getSupabase() {
  return getSupabaseClient();
}

export function getServerSupabase() {
  return getServerSupabaseClient();
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
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderByNumber(orderNumber: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrder(
  orderId: string,
  updateData: Partial<DbOrder> & Record<string, any>
) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select()
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

  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("design_files")
    .insert([fileData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderDesignFiles(orderId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("design_files")
    .select("*")
    .eq("order_id", orderId);

  if (error) throw error;
  return data;
}

export async function createOrUpdateCustomer(customerData: Partial<DbCustomer>) {
  const supabase = getSupabase();
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
