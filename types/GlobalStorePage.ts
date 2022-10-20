import { Store } from "./Store";
import { FoodCategory } from "./FoodCategory";
import { Food } from "./Food";

export type GlobalStoreData = {
  storeData: Store & {
    food_categories: FoodCategory[];
    foods: Food[];
  };
  isInDevMode: boolean;
};
