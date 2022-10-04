import { useEffect, useState } from "react";
import {
  Box,
  useColorModeValue,
  Center,
  Text,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { Food } from "../../types/Food";
import { supabase } from "../../api/supabase-client";
import { useAppSelector } from "../../app/hooks";
import Foods from "../../pages/app/foods";

interface FoodItemsProps {
  selectedCategory: string;
}

const FoodItems = ({ selectedCategory }: FoodItemsProps) => {
  const [foodItems, setFoodItems] = useState<Food[] | []>([]);
  const user = useAppSelector((state) => state.user.user);
  const [loadingFoods, setLoadingFoods] = useState(false);

  async function fetchAndSetFoods(categoryId: string) {
    if (!user?.id) return;
    try {
      setLoadingFoods(true);
      const { data, error } = await supabase
        .from("foods")
        .select()
        .match({ food_category_id: selectedCategory, user_id: user.id });

      if (error) throw error;
      console.log(data);
      setFoodItems(data);
      setLoadingFoods(false);
    } catch (e) {
      console.log(e);
      setLoadingFoods(false);
    }
  }

  useEffect(() => {
    if (selectedCategory !== "") {
      fetchAndSetFoods(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <Box
      w="full"
      h="full"
      bg={useColorModeValue("gray.100", "gray.700")}
      minH="300px"
      borderRadius="md"
      p="10px"
    >
      {loadingFoods && (
        <Box
          w="full"
          h="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Center>
            <Spinner color="blue.400" />
          </Center>
        </Box>
      )}
      {!loadingFoods && (selectedCategory === "" || foodItems.length === 0) && (
        <Box
          w="full"
          h="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
            <Center>
              <img
                src="/images/undraw/no-results.svg"
                style={{ width: "100px" }}
              />
            </Center>
            <Center>
              <Text>No results</Text>
            </Center>
          </Box>
        </Box>
      )}
      {!loadingFoods &&
        selectedCategory !== "" &&
        foodItems.length > 0 &&
        foodItems.map((food) => <FoodItem foodItemData={food} key={food.id} />)}
    </Box>
  );
};

export default FoodItems;

interface FoodItemPros {
  foodItemData: Food;
}

const FoodItem = ({ foodItemData }: FoodItemPros) => {
  return (
    <HStack mb="10px" bg={useColorModeValue("white", "gray.600")}>
      <Text>{foodItemData.name}</Text>
    </HStack>
  );
};
