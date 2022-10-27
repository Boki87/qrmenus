import { supabase } from "./supabase-client";

interface ResProps {
  stores: any[];
  foods: any[];
  total_store_views: number;
  total_foods_views: number;
  store_views: any[];
  foods_views: any[];
}

const fetchStatsForUser = async (userId: string) => {
  const res: ResProps = {
    stores: [],
    foods: [],
    store_views: [],
    foods_views: [],
    total_store_views: 0,
    total_foods_views: 0,
  };
  //get number of stores
  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("id, name, cover")
    .match({ user_id: userId });

  if (storesError) {
    throw storesError;
  }
  res.stores = stores;

  //get number of foods
  const { data: foods, error: foodsError } = await supabase
    .from("foods")
    .select("id, name, image")
    .match({ user_id: userId });

  if (foodsError) {
    throw foodsError;
  }
  res.foods = foods;

  //get total number of views for all stores
  const { data: storeViews, error: storeViewsError } = await supabase
    .from("store_stats")
    .select("*, stores(name)")
    .match({ user_id: userId });

  if (storeViewsError) {
    throw storeViewsError;
  }

  res.total_store_views = storeViews.length;
  res.store_views = storeViews;

  res.stores = res.stores.map((store) => {
    let count = 0;
    storeViews.forEach((view) => {
      if (view.store_id === store.id) {
        count += 1;
      }
    });
    store.views = count;
    return store;
  });

  res.stores.sort((a, b) => {
    return b.views - a.views;
  });

  //get total number of views for all foods
  const { data: foodsViews, error: foodsViewsError } = await supabase
    .from("food_stats")
    .select("*, foods(name)")
    .match({ user_id: userId });

  if (foodsViewsError) {
    throw foodsViewsError;
  }

  res.total_foods_views = foodsViews.length;
  res.foods_views = foodsViews;

  res.foods = res.foods.map((food) => {
    let count = 0;
    foodsViews.forEach((f) => {
      if (f.food_id === food.id) {
        count += 1;
      }
    });
    food.views = count;
    return food;
  });

  res.foods.sort((a, b) => {
    return b.views - a.views;
  });

  return res;
};

export { fetchStatsForUser };
