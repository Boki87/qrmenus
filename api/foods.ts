import { supabase } from "./supabase-client";
import { FoodCategory } from "../types/FoodCategory";

const fetchCategoriesForStore = async (storeId: string, userId: string) => {
  const { data, error } = await supabase
    .from<FoodCategory>("food_categories")
    .select()
    .match({ store_id: storeId, user_id: userId })
    .order("order_index");

  if (error) {
    throw error;
  }

  return data;
};

export { fetchCategoriesForStore };
