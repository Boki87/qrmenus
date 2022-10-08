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
  Tooltip,
} from "@chakra-ui/react";
import { Store } from "../../types/Store";
import { FiEdit, FiEye } from "react-icons/fi";
import { ImQrcode } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import { useAppDispatch } from "../../app/hooks";
import { openPreview } from "../../features/modals/modal-slice";

const StoreCard = ({
  store,
  onEditStore,
  onDeleteStore,
}: {
  store: Store;
  onEditStore: (id?: string) => void;
  onDeleteStore: (id?: string) => void;
}) => {
  const dispatch = useAppDispatch();

  function openQrCode() {
    window.open(
      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://192.168.0.105:3000/store/${store.id}`,
      "_blank"
    );
  }

  function onOpenPreview() {
        console.log(store.id)
    if (store?.id) {
      dispatch(openPreview(store.id));
    }
  }

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
        bg="gray.100"
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
          <Tooltip label="Edit Store">
            <IconButton
              onClick={() => onEditStore(store?.id)}
              aria-label="edit button"
              icon={<FiEdit />}
              variant="outline"
            />
          </Tooltip>
          <Tooltip label="Delete Store">
            <IconButton
              variant="outline"
              onClick={() => onDeleteStore(store?.id)}
              aria-label="delete button"
              icon={<AiFillDelete />}
            />
          </Tooltip>
          <Tooltip label="Preview">
            <IconButton
              onClick={onOpenPreview}
              variant="outline"
              aria-label="view button"
              icon={<FiEye />}
            />
          </Tooltip>
          <Tooltip label="View QR Code">
            <IconButton
              onClick={openQrCode}
              variant="outline"
              aria-label="qr code button"
              icon={<ImQrcode />}
            />
          </Tooltip>
        </HStack>
      </VStack>
    </Box>
  );
};

export default StoreCard;
