import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  useColorModeValue,
  Center,
  Text,
  Spinner,
  HStack,
  Spacer,
  Button,
  AvatarBadge,
} from "@chakra-ui/react";
import { Food } from "../../types/Food";
import { supabase } from "../../api/supabase-client";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  openConfirmDialog,
  openPreview,
} from "../../features/modals/modal-slice";
import { HiOutlinePlus } from "react-icons/hi";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdFastfood } from "react-icons/md";
import FoodItemDrawer from "../../components/foods/FoodItemDrawer";
import { FiEye } from "react-icons/fi";

const FoodItems = () => {
  const { selectedCategory, selectedStore } = useAppSelector(
    (state) => state.food
  );
  const dispatch = useAppDispatch();

  const [foodItems, setFoodItems] = useState<Food[] | []>([]);
  const user = useAppSelector((state) => state.user.user);
  const [loadingFoods, setLoadingFoods] = useState(false);

  /* FOODS STATE */
  const [foodItemToEdit, setFoodItemToEdit] = useState("");
  const [isFoodItemDrawerOpen, setIsFoodDrawerOpen] = useState(false);
  /* FOODS STATE END*/

  async function fetchAndSetFoods() {
    if (!user?.id) return;
    try {
      setLoadingFoods(true);
      const { data, error } = await supabase
        .from("foods")
        .select()
        .match({ food_category_id: selectedCategory, user_id: user.id })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFoodItems(data);
      setLoadingFoods(false);
    } catch (e) {
      console.log(e);
      setLoadingFoods(false);
    }
  }

  async function refetchFoodList() {
    await fetchAndSetFoods();
  }

  async function onDeleteHandler(id: string) {
    try {
      const { payload: isConfirmed } = await dispatch(
        openConfirmDialog("Sure you want to delete this food?")
      );

      if (!isConfirmed) return;

      const { data, error } = await supabase
        .from("foods")
        .delete()
        .match({ id })
        .single();
      if (error) throw error;

      setFoodItems(foodItems.filter((f) => f.id !== id));
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setFoodItems([]);
  }, [selectedStore]);

  useEffect(() => {
    if (selectedCategory !== -1) {
      fetchAndSetFoods();
    }
  }, [selectedCategory]);

  return (
    <>
      <Box
        w="full"
        h="full"
        bg={useColorModeValue("gray.100", "gray.700")}
        minH="300px"
        borderRadius="md"
        p="10px"
      >
        <HStack h="40px" mb="10px">
          <Text fontSize="xl" fontWeight="bold">
            Food List
          </Text>
          <Spacer />
          <Button
            onClick={() => {
              if (selectedStore?.id) {
                dispatch(openPreview(selectedStore?.id));
              }
            }}
            size="sm"
            disabled={!selectedStore}
            colorScheme="twitter"
            fontSize="xl"
          >
            <FiEye />
          </Button>
          <Button
            onClick={() => {
              setFoodItemToEdit("");
              setIsFoodDrawerOpen(true);
            }}
            rightIcon={<HiOutlinePlus />}
            colorScheme="blue"
            disabled={selectedCategory === -1}
            size="sm"
          >
            NEW
          </Button>
        </HStack>
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
        {!loadingFoods && (selectedCategory === -1 || foodItems.length === 0) && (
          <Box
            w="full"
            h="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box>
              <Center mb="10px">
                <img
                  src="/images/undraw/no-results.svg"
                  style={{ width: "150px" }}
                />
              </Center>
              <Center>
                <Text>No results</Text>
              </Center>
            </Box>
          </Box>
        )}
        <Box overflowY="auto" h="calc(100% - 50px)">
          {!loadingFoods &&
            selectedCategory !== -1 &&
            foodItems.length > 0 &&
            foodItems.map((food) => (
              <FoodItem
                foodItemData={food}
                onEdit={(id) => {
                  setFoodItemToEdit(id);
                  setIsFoodDrawerOpen(true);
                }}
                onDelete={onDeleteHandler}
                key={food.id}
              />
            ))}
        </Box>
      </Box>
      <FoodItemDrawer
        isOpen={isFoodItemDrawerOpen}
        foodItemId={foodItemToEdit}
        onRefetchFoodList={refetchFoodList}
        onClose={() => {
          setFoodItemToEdit("");
          setIsFoodDrawerOpen(false);
        }}
      />
    </>
  );
};

export default FoodItems;

interface FoodItemPros {
  foodItemData: Food;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FoodItem = ({ foodItemData, onEdit, onDelete }: FoodItemPros) => {

  const {selectedStore} = useAppSelector(state => state.food)


  return (
    <HStack
      mb="10px"
      bg={useColorModeValue("white", "gray.600")}
      px="10px"
      py="5px"
      borderRadius="md"
      gap={2}
      minW={{ base: "none", md: "lg" }}
      borderLeft="4px"
      borderColor={foodItemData.is_live ? "blue.400" : "gray.400"}
    >
      <Avatar
        src={foodItemData.image}
        borderRadius="md"
        display={{ base: "none", md: "flex" }}
        icon={<MdFastfood />}
        bg="gray.200"
      >
        {foodItemData.is_featured && (
          <AvatarBadge bg="green.400" boxSize="1.2em" />
        )}
      </Avatar>
      <Text noOfLines={1} minW={{ base: "50px", md: "100px" }}>
        {foodItemData.name}
      </Text>
      <Text
        fontSize="sm"
        noOfLines={2}
        display={{ base: "none", md: "-webkit-box" }}
        minW="80px"
      >
        {foodItemData.description}
      </Text>
      <Spacer />
      <Text
        fontWeight="bold"
        minW="80px"
        noOfLines={1}
        display={{ base: "none", md: "-webkit-box" }}
      >
        {foodItemData.price} {selectedStore?.currency}
      </Text>
      <HStack>
        <Button onClick={() => onEdit(foodItemData.id)}>
          <AiFillEdit />
        </Button>
        <Button onClick={() => onDelete(foodItemData.id)}>
          <AiFillDelete />
        </Button>
      </HStack>
    </HStack>
  );
};
