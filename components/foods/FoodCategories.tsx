import { SyntheticEvent, useCallback, useRef } from "react";
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
import update from "immutability-helper";
import { Identifier, XYCoord } from "dnd-core";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FoodCategory } from "../../types/FoodCategory";
import { HiOutlinePlus } from "react-icons/hi";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

interface FoodCategoriesProps {
  categories: FoodCategory[] | [];
  loading: boolean;
  selectedCategory: number;
  selectedStore: string;
  reorderCategories: (dragIndex: number, hoverIndex: number) => void;
  onSelectCategory: (id: number) => void;
  onOpenModal: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const FoodCategories = ({
  categories,
  loading,
  selectedCategory,
  selectedStore,
  reorderCategories,
  onSelectCategory,
  onOpenModal,
  onDelete,
  onEdit,
}: FoodCategoriesProps) => {
  const renderCategory = useCallback((cat: FoodCategory, index: number) => {
    return (
      <FoodCategory
        id={cat.id}
        name={cat.name}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onDelete={onDelete}
        onEdit={onEdit}
        key={cat.id}
        index={index}
        moveCategory={reorderCategories}
      />
    );
  }, []);

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
        <DndProvider backend={HTML5Backend}>
          {!loading &&
            categories.length > 0 &&
            categories.map((cat, i) => renderCategory(cat, i))}
        </DndProvider>
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
  id: number;
  name: string;
  selectedCategory: number;
  onSelectCategory: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  index: number;
  moveCategory: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: number;
  type: string;
}

const ItemTypes = {
  CARD: "card",
};

const FoodCategory = ({
  id,
  name,
  selectedCategory,
  onSelectCategory,
  onEdit,
  onDelete,
  index,
  moveCategory,
}: FoodCategoryProps) => {
  const active = id === selectedCategory;

  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      //Dont replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      //Get rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCategory(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return {
        id,
        index,
      };
    },
    collect: (monitor: any) => {
      return { isDragging: monitor.isDragging() };
    },
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <HStack
      as="div"
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
      ref={ref}
      opacity={opacity}
      data-handler-id={handlerId}
    >
      {/* <Tooltip label={name}> */}
      <Text flex="1" size="sm" noOfLines={1}>
        {name}
      </Text>
      {/* </Tooltip> */}
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
