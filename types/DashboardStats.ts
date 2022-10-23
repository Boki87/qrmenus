export type DashboardStats = {
  stats?: {
    stores: { id: string; name: string; cover: string; views: number }[];
    foods: { id: string; name: string; image: string; views: number }[];
    store_views: {
      id: string;
      created_at: string;
      store_id: string;
      user_id: string;
      stores: { name: string };
    }[];
    foods_views: {
      id: string;
      created_at: string;
      food_id: string;
      user_id: string;
      foods: { name: string };
    }[];
    total_store_views: number;
    total_foods_views: number;
  };
};
