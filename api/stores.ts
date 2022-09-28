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
  console.log(data);
  return data;
}

export { fetchStoresForUser };
