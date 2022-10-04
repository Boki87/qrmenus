export type Food = {
  id: string;
  user_id: string;
  store_id: string;
  food_category_id: string;
  name: string;
  image?: string;
  desctiption?: string;
  comment?: string;
  price?: number;
  currency?: string;
  is_live?: boolean;
  is_featured?: boolean;
  size?: number;
  size_unit?: string;
  prep_time?: number;
  created_at?: string;
};
