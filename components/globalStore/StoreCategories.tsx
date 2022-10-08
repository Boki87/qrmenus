import { Box, Button, HStack } from "@chakra-ui/react";
import { FoodCategory } from "../../types/FoodCategory";

interface StoreCategoriesProps {
  onSetActive: (val: number) => void;
  categories: FoodCategory[];
  activeCategory: number;
}

const StoreCategories = ({
  categories,
  onSetActive,
  activeCategory,
}: StoreCategoriesProps) => {
  return (
    <Box overflowX="auto" h="60px" px="10px">
      <HStack gap={3} h="full">
        {categories.map((cat) => (
          <Button
            onClick={() => {
              onSetActive(cat.id);
            }}
            minW="36%"
            key={cat.id}
            borderRadius="full"
            colorScheme={cat.id === activeCategory ? "blue" : "gray"}
          >
            {cat.name}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default StoreCategories;
