import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { GlobalStoreData } from "../../types/GlobalStorePage";
import StoreHero from "./StoreHero";
import StoreCategories from "./StoreCategories";
import StoreFeaturedFood from "./StoreFeaturedFood";
import { Food } from "../../types/Food";
import StoreCategoryFoods from "./StoreCategoryFoods";
import StoreFoodDrawer from "./StoreFoodDrawer";

const GlobalStorePage = ({ storeData }: GlobalStoreData) => {
  const [activeCategory, setActiveCategory] = useState(-1);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [featuredFood, setFeaturedFood] = useState<Food[] | []>([]);
  const [filteredFood, setFilteredFood] = useState<Food[] | []>([]);
  const [isFoodDrawerOpen, setIsFoodDrawerOpen] = useState(false);
  const [foodDrawerData, setFoodDrawerData] = useState<Food | null>(null);

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

  return (
    <>
      <Box
        w="full"
        maxW="xl"
        minW="300px"
        minH="full"
        mx="auto"
        overflow="hidden"
        overflowX="auto"
        borderRadius="xl"
        bg="white"
        pb="30px"
      >
        <StoreHero
          cover={storeData.cover}
          name={storeData.name}
          description={storeData.description}
          announcement={storeData.announcement}
          phone={storeData.phone}
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
      <StoreFoodDrawer
        isOpen={isFoodDrawerOpen}
        foodData={foodDrawerData}
        onClose={() => {
          setIsFoodDrawerOpen(false);
          setFoodDrawerData(null);
        }}
      />
    </>
  );
};

export default GlobalStorePage;
