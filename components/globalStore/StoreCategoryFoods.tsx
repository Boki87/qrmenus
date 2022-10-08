import {
  VStack,
  HStack,
  Box,
  Text,
  Image,
  Button,
  Center,
} from "@chakra-ui/react";
import { Food } from "../../types/Food";
import { MdFastfood, MdNoFood } from "react-icons/md";

interface StoreCategoryFoodsProps {
  foods: Food[];
  activeCategoryName: string;
}

const StoreCategoryFoods = ({
  foods,
  activeCategoryName,
}: StoreCategoryFoodsProps) => {
  return (
    <Box>
      <Text
        fontSize="xl"
        fontWeight="bold"
        ml="10px"
        mb="10px"
        color="gray.800"
      >
        {activeCategoryName}
      </Text>
      <VStack>
        {foods.length > 0 &&
          foods.map((food) => (
            <StoreCategoryFoodItem
              image={food.image}
              name={food.name}
              price={food.price}
              currency={food.currency}
              size={food.size}
              size_unit={food.size_unit}
              key={food.id}
            />
          ))}
        {foods.length === 0 && (
          <Center fontSize="6xl" color="gray.700">
            <MdNoFood />
          </Center>
        )}
      </VStack>
    </Box>
  );
};

export default StoreCategoryFoods;

const StoreCategoryFoodItem = ({
  image,
  name,
  price,
  currency,
  size,
  size_unit,
}: {
  image?: string;
  name?: string;
  price?: number;
  currency?: string;
  size?: number;
  size_unit?: string;
}) => {
  return (
    <HStack h="120px" minH="120px" w="full" color="black">
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="full"
        w="150px"
      >
        <Box
          w="110px"
          h="110px"
          borderRadius="full"
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          shadow="md"
          fontSize="6xl"
          color="gray.700"
        >
          {image ? (
            <Image src={image} minW="full" minH="full" objectFit="cover" />
          ) : (
            <MdFastfood />
          )}
        </Box>
      </Box>
      <VStack flex={1} maxW="250px" alignItems="flex-start">
        <Box>
          <Text fontWeight="bold">{name}</Text>
        </Box>
        <HStack>
          <Button size="sm" borderRadius="full">
            {price} {currency}
          </Button>
          <Text color="gray.500" fontSize="sm">
            {size} {size_unit}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
};
