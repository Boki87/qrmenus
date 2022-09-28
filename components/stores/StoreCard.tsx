import {
  Spacer,
  Box,
  Text,
  Image,
  Center,
  HStack,
  IconButton,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Store } from "../../types/Store";
import { FiEdit, FiDelete, FiEye } from "react-icons/fi";

const StoreCard = ({
  store,
  onEditStore,
  onDeleteStore,
}: {
  store: Store;
  onEditStore: (id?: string) => void;
  onDeleteStore: (id?: string) => void;
}) => {
  return (
    <Box
      w="full"
      h="300px"
      borderRadius="md"
      overflow="hidden"
      shadow="md"
      bg={useColorModeValue("white", "gray.700")}
    >
      <Box
        w="full"
        h="200px"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={store?.cover !== "" ? "" : "20px"}
      >
        <Image
          src={store?.cover !== "" ? store.cover : "/images/undraw/store.svg"}
          objectFit={store?.cover !== "" ? "cover" : "contain"}
          alt="store cover image"
          minW="full"
          minH="full"
        />
      </Box>
      <VStack w="full" h="100px" py="10px">
        <Center>
          <Text>{store.name}</Text>
        </Center>
        <Spacer />
        <HStack gap="10px">
          <IconButton
            onClick={() => onEditStore(store?.id)}
            aria-label="edit button"
            icon={<FiEdit />}
          />
          <IconButton
            onClick={() => onDeleteStore(store?.id)}
            aria-label="delete button"
            icon={<FiDelete />}
          />
          <IconButton aria-label="view button" icon={<FiEye />} />
        </HStack>
      </VStack>
    </Box>
  );
};

export default StoreCard;
