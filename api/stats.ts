import { supabase } from "./supabase-client";

interface ResProps {
  stores: any[];
  foods: any[];
  store_views: number;
  foods_views: number;
}

const fetchStatsForUser = async (userId: string) => {
  const res: ResProps = {
    stores: [],
    foods: [],
    store_views: 0,
    foods_views: 0,
  };
  //get number of stores
  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("name")
    .match({ user_id: userId });

  if (storesError) {
    throw storesError;
  }
  res.stores = stores;

  //get number of foods
  const { data: foods, error: foodsError } = await supabase
    .from("foods")
    .select("name")
    .match({ user_id: userId });

  if (foodsError) {
    throw foodsError;
  }
  res.foods = foods;

  //get total number of views for all stores
  const { data: storeViews, error: storeViewsError } = await supabase
    .from("store_stats")
    .select("*")
    .match({ user_id: userId });

  if (storeViewsError) {
    throw storeViewsError;
  }

  res.store_views = storeViews.length;

  //get total number of views for all foods
  const { data: foodsViews, error: foodsViewsError } = await supabase
    .from("food_stats")
    .select("*")
    .match({ user_id: userId });

  if (foodsViewsError) {
    throw foodsViewsError;
  }

  res.foods_views = foodsViews.length;

  return res
};

export { fetchStatsForUser };
