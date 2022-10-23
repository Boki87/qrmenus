import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { IoStorefrontSharp } from "react-icons/io5";
import { MdFastfood } from "react-icons/md";

interface StoreTotalViews {
  storeViews: number;
  foodsViews: number;
}

const StoreTotalViews = ({ storeViews, foodsViews }: StoreTotalViews) => {
  const bg = useColorModeValue("white", "gray.700");
  const color = useColorModeValue("gray.600", "white");
  return (
    <Box borderRadius="xl" shadow="xl" p="20px" bg={bg}>
      <Text fontWeight="bold" fontSize={["2xl", "3xl"]} mb="15px" color={color}>
        Total views:
      </Text>
      <Text fontSize="xl" mb="10px">
        <IoStorefrontSharp style={{ display: "inline" }} /> Stores: {storeViews}
      </Text>
      <Text fontSize="xl">
        <MdFastfood style={{ display: "inline" }} /> Foods: {foodsViews}
      </Text>
    </Box>
  );
};

export default StoreTotalViews;
