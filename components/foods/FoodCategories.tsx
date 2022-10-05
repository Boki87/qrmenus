import { SyntheticEvent } from "react";
import {
  Box,
  useColorModeValue,
  Text,
  HStack,
  Button,
  Spacer,
  Spinner,
  Center,
  Tooltip,
} from "@chakra-ui/react";
import { FoodCategory } from "../../types/FoodCategory";
import { HiOutlinePlus } from "react-icons/hi";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

interface FoodCategoriesProps {
  categories: FoodCategory[] | [];
  loading: boolean;
  selectedCategory: string;
  selectedStore: string;
  onSelectCategory: (id: string) => void;
  onOpenModal: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FoodCategories = ({
  categories,
  loading,
  selectedCategory,
  selectedStore,
  onSelectCategory,
  onOpenModal,
  onDelete,
  onEdit,
}: FoodCategoriesProps) => {
  return (
    <Box
      w="full"
      bg={useColorModeValue("gray.100", "gray.700")}
      minH="200px"
      borderRadius="md"
      p="10px"
      mb={{ base: "10px", md: "0px" }}
    >
      <HStack>
        <Text>Categories</Text>
        <Spacer />
        <Button
          onClick={onOpenModal}
          rightIcon={<HiOutlinePlus />}
          colorScheme="blue"
          disabled={selectedStore === ""}
          size="sm"
        >
          NEW
        </Button>
      </HStack>
      <Box mt="20px">
        {loading && (
          <Center>
            <Spinner color="blue.400" />
          </Center>
        )}
        {!loading &&
          categories.length > 0 &&
          categories.map((cat) => (
            <FoodCategory
              id={cat.id}
              name={cat.name}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              onDelete={onDelete}
              onEdit={onEdit}
              key={cat.id}
            />
          ))}
        {!loading && categories.length === 0 && (
          <Box>
            <Center mb="10px">
              <img
                src="/images/undraw/no-results.svg"
                style={{ width: "150px" }}
              />
            </Center>
            <Center>
              <Text>No categories</Text>
            </Center>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FoodCategories;

interface FoodCategoryProps {
  id: string;
  name: string;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FoodCategory = ({
  id,
  name,
  selectedCategory,
  onSelectCategory,
  onEdit,
  onDelete,
}: FoodCategoryProps) => {
  const active = id === selectedCategory;

  return (
    <HStack
      h="40px"
      w="full"
      borderLeft="4px"
      borderColor={active ? "blue.500" : "gray.400"}
      bg={useColorModeValue("white", "gray.600")}
      borderRadius="md"
      px="10px"
      cursor="pointer"
      mb="10px"
      onClick={() => onSelectCategory(id)}
    >
      <Tooltip label={name}>
        <Text flex="1" size="sm" noOfLines={1}>
          {name}
        </Text>
      </Tooltip>
      <HStack
        onClick={(e: SyntheticEvent) => {
          e.stopPropagation();
        }}
      >
        <Button onClick={() => onEdit(id)} size="sm">
          <AiFillEdit />
        </Button>
        <Button onClick={() => onDelete(id)} size="sm">
          <AiFillDelete />
        </Button>
      </HStack>
    </HStack>
  );
};
