import { supabase } from "./supabase-client";
import { Store } from "../types/Store";

async function fetchStoresForUser(userId: string) {
  const { data, error } = await supabase
    .from<Store>("stores")
    .select()
    .match({ user_id: userId })
    .order("created_at");

  if (error) {
    throw error;
  }
  return data;
}

async function fetchStoreData(id: string | string[]) {
  const { data, error } = await supabase
    .from("stores")
    .select(`*, food_categories(*), foods(*)`)
    .match({ id })
    .single();

  if (error) throw error;

  return data;
}

export { fetchStoresForUser, fetchStoreData };
