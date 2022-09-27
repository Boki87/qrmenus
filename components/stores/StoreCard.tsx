import {
  Spacer,
  Box,
  Text,
  Image,
  Center,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { Store } from "../../types/Store";
import { FiEdit, FiDelete, FiEye } from "react-icons/fi";

const StoreCard = ({ store }: { store: Store }) => {
  return (
    <Box
      w="full"
      h="300px"
      border="1px"
      borderColor="gray.100"
      borderRadius="md"
      shadow="md"
    >
      <Box
        w="full"
        h="200px"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          src={store?.cover}
          objectFit="cover"
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
          <IconButton aria-label="edit button" icon={<FiEdit />} />
          <IconButton aria-label="delete button" icon={<FiDelete />} />
          <IconButton aria-label="view button" icon={<FiEye />} />
        </HStack>
      </VStack>
    </Box>
  );
};

export default StoreCard;
