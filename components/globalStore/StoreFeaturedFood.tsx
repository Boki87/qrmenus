import {
  Box,
  HStack,
  Text,
  Image,
  Center,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { Food } from "../../types/Food";

interface StoreFeaturedFoodProps {
  featuredFood: Food[];
}

const StoreFeaturedFood = ({ featuredFood }: StoreFeaturedFoodProps) => {
  return (
    <Box>
      <Text color="gray.700" ml="10px" fontWeight="bold" fontSize="xl" mb="-40px">
        Featured
      </Text>
      <Box
        overflowX="auto"
        h="200px"
        my="30px"
        display="flex"
        alignItems="center"
      >
        <HStack gap="4" px="10px" alignItems="center" mt="50px">
          {featuredFood.map((food) => (
            <FeaturedFoodCard food={food} key={food.id}/>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default StoreFeaturedFood;

const FeaturedFoodCard = ({ food }: { food: Food }) => {
  return (
    <Box
      minW="200px"
      w="200px"
      h="100px"
      borderRadius="md"
      shadow="sm"
      position="relative"
      bgGradient="linear(to-b, blue.500, blue.300)"
      display="flex"
      alignItems="flex-end"
    >
      <Box position="absolute" top="-50px" left="0px" w="full">
        <Center w="full">
          <Box
            w="100px"
            h="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            borderRadius="full"
            shadow="lg"
          >
            <Image
              objectFit="cover"
              minW="full"
              minH="full"
              src={food.image ? food.image : "/images/food-generic.jpg"}
            />
          </Box>
        </Center>
      </Box>
      <HStack h="40px" px="10px" w="full">
        <Text noOfLines={1} color="gray.700" fontSize="sm" fontWeight="bold">
          {food.name}
        </Text>
        <Spacer />
        <Button bg="black" borderRadius="full" size="xs" color="white">
          {food.price} {food.currency}
        </Button>
      </HStack>
    </Box>
  );
};
