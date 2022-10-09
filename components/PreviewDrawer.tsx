import { SyntheticEvent, useEffect, useState } from "react";
import {
  HStack,
  Image,
  VStack,
  Button,
  Spinner,
  Center,
  Input,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { closePreview } from "../features/modals/modal-slice";
import { fetchStoreData } from "../api/stores";
import GlobalStore from "./globalStore";

const PreviewDrawer = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [storeData, setStoreData] = useState(null);

  const { isOpen, storeId } = useAppSelector(
    (state) => state.modals.previewStoreDrawer
  );

  function onClose() {
    dispatch(closePreview());
  }

  async function fetchData() {
    try {
      setIsLoading(true);
      const data = await fetchStoreData(storeId);
      setStoreData(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (storeId !== "" && isOpen) {
      fetchData();
    }
    if (!isOpen) {
      setStoreData(null);
    }
  }, [storeId, isOpen]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={"right"}
      size={{ base: "full", md: "md" }}
    >
      <DrawerOverlay />
      <DrawerContent borderLeftRadius="md">
        <DrawerCloseButton onClick={onClose} />
        <DrawerHeader borderBottomWidth="1px">Preview</DrawerHeader>
        <DrawerBody p="0px" overflowY="auto">
          {!isLoading && storeData && <GlobalStore storeData={storeData} />}
          {isLoading && (
            <Box
              h="full"
              w="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Center>
                <Spinner size="xl" color="blue" />
              </Center>
            </Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default PreviewDrawer;
