export type FoodCategory = {
  id: number;
  user_id?: string;
  store_id?: string;
  name: string;
  comment?: string;
  order_index?: number;
  is_live?: boolean;
  created_at?: string;
};
