import { useState, useEffect, createContext, useContext } from "react";
import { Box, LightMode, GlobalStyle } from "@chakra-ui/react";
import { GlobalStoreData } from "../../types/GlobalStorePage";
import StoreHero from "./StoreHero";
import StoreCategories from "./MenuCategories";
import StoreFeaturedFood from "./StoreFeaturedFood";
import { Food } from "../../types/Food";
import StoreCategoryFoods from "./StoreCategoryFoods";
import StoreFoodDrawer from "./StoreFoodDrawer";
import StoreOrderList from "./StoreOrderList";
import OrderListDrawer from "./OrderListDrawer";
import { supabase } from "../../api/supabase-client";

type OrderListType = { name: string; price: number; amount: number };

interface OrderListContext {
  orderList: OrderListType[] | [];
  addToOrder: (food: Food, amount: number) => void;
  removeFromOrder: (id: string) => void;
  isDrawerOpen: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
  currency?: string;
  changeOrder: (name: string, stepper: -1 | 1) => void;
}

const OrderListContext = createContext<OrderListContext>({
  orderList: [],
  addToOrder: () => {},
  removeFromOrder: () => {},
  isDrawerOpen: false,
  closeDrawer: () => {},
  openDrawer: () => {},
  currency: "",
  changeOrder: () => {},
});
export const useOrderListContext = () => useContext(OrderListContext);

const GlobalStorePage = ({
  storeData,
  isInDevMode = false,
}: GlobalStoreData) => {
  const [activeCategory, setActiveCategory] = useState(-1);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [featuredFood, setFeaturedFood] = useState<Food[] | []>([]);
  const [filteredFood, setFilteredFood] = useState<Food[] | []>([]);
  const [isFoodDrawerOpen, setIsFoodDrawerOpen] = useState(false);
  const [foodDrawerData, setFoodDrawerData] = useState<Food | null>(null);

  const [orderList, setOrderList] = useState<OrderListType[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function addToOrder(food: Food, amount = 1) {
    let newOrderList = [...orderList];
    let track = orderList.map((item) => item.name);
    if (!track.includes(food.name)) {
      newOrderList.push({
        name: food.name,
        price: food.price,
        amount: amount,
      });
    } else {
      newOrderList = orderList.map((item) => {
        if (item.name === food.name) {
          item.amount += amount;
        }
        return item;
      });
    }
    setOrderList(newOrderList);
  }

  function removeFromOrder(name: string) {
    let newOrderList = orderList.filter((item) => {
      if (item.name !== name) {
        return item;
      }
    });
    setOrderList(newOrderList);
  }

  function chageOrderItemAmount(name: string, stepper: 1 | -1) {
    if (stepper === -1) {
      let targetItem = orderList.filter((item) => item.name === name)[0];
      if (targetItem.amount > 1) {
        let newOrderList = orderList.map((orderItem) => {
          if (orderItem.name === name) {
            orderItem.amount -= 1;
          }
          return orderItem;
        });
        setOrderList(newOrderList);
      } else {
        let newOrderList = orderList.filter(
          (orderItem) => orderItem.name !== name
        );
        setOrderList(newOrderList);
      }
    }

    if (stepper === 1) {
      let newOrderList = orderList.map((orderItem) => {
        if (orderItem.name === name) {
          orderItem.amount += 1;
        }
        return orderItem;
      });
      setOrderList(newOrderList);
    }
  }

  function openDrawer() {
    setIsDrawerOpen(true);
  }
  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  function onViewFoodHanlder(data: Food) {
    setFoodDrawerData(data);
    setIsFoodDrawerOpen(true);
  }

  useEffect(() => {
    if (storeData.food_categories[0]?.name) {
      setActiveCategory(storeData.food_categories[0].id);
      setActiveCategoryName(storeData.food_categories[0].name);
    }
  }, []);

  useEffect(() => {
    const filterFeatured = storeData.foods.filter((food) => food.is_featured);
    setFeaturedFood(filterFeatured);

    const filterFood = storeData.foods.filter(
      (food) => food.food_category_id === activeCategory
    );
    setFilteredFood(filterFood);

    if (activeCategory !== -1) {
      setActiveCategoryName(
        storeData.food_categories.filter((f) => f.id === activeCategory)[0].name
      );
    }
  }, [storeData.foods, activeCategory]);

  useEffect(() => {
    //add page view to stats
    async function addView() {
      if (!storeData?.id) return;
      if (isInDevMode) return;
      await supabase.from("store_stats").insert([
        {
          store_id: storeData.id,
          user_id: storeData.user_id,
        },
      ]);
    }
    addView();
  }, []);

  return (
    <LightMode>
      <GlobalStyle />
      <OrderListContext.Provider
        value={{
          orderList,
          addToOrder,
          removeFromOrder,
          isDrawerOpen,
          closeDrawer,
          openDrawer,
          currency: storeData?.currency,
          changeOrder: chageOrderItemAmount,
        }}
      >
        <Box
          w="full"
          maxW="xl"
          minW="300px"
          minH="full"
          mx="auto"
          overflowX="auto"
          borderRadius="xl"
          bg="white"
          pb="150px"
          color="gray.800"
        >
          <StoreHero
            id={storeData.id}
            cover={storeData.cover}
            name={storeData.name}
            description={storeData.description}
            announcement={storeData.announcement}
            phone={storeData.phone}
            email={storeData.email}
            address={storeData.address}
            working_hours={storeData.working_hours}
          />
          <StoreCategories
            onSetActive={(val) => {
              setActiveCategory(val);
            }}
            categories={storeData.food_categories}
            activeCategory={activeCategory}
          />
          {featuredFood.length > 0 && (
            <StoreFeaturedFood
              featuredFood={featuredFood}
              onViewFood={onViewFoodHanlder}
            />
          )}
          <StoreCategoryFoods
            foods={filteredFood}
            activeCategoryName={activeCategoryName}
            onViewFood={onViewFoodHanlder}
          />
        </Box>
        {foodDrawerData && (
          <StoreFoodDrawer
            isOpen={isFoodDrawerOpen}
            foodData={foodDrawerData}
            isInDevMode={isInDevMode}
            onClose={() => {
              setIsFoodDrawerOpen(false);
              setFoodDrawerData(null);
            }}
          />
        )}

        <StoreOrderList />

        <OrderListDrawer />
      </OrderListContext.Provider>
    </LightMode>
  );
};

export default GlobalStorePage;
