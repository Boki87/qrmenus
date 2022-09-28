import { SyntheticEvent, useEffect, useState } from "react";
import {
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
  FormControl,
  FormLabel,
  Textarea,
  DrawerFooter,
} from "@chakra-ui/react";
import { supabase } from "../../api/supabase-client";
import { useAppSelector } from "../../app/hooks";
import { Store } from "../../types/Store";

interface StoreDrawerProps {
  isOpen: boolean;
  storeId: string;
  onClose: () => void;
  onRefetchStores: () => void;
}

const StoreDrawer = ({
  isOpen,
  storeId,
  onClose,
  onRefetchStores,
}: StoreDrawerProps) => {
  const user = useAppSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [storeData, setStoreData] = useState<Store>({
    id: "",
    user_id: user?.id,
    name: "",
    cover: "",
    email: "",
    description: "",
    announcement: "",
    working_hours: "",
    address: "",
    phone: "",
  });

  function resetStoreData() {
    setStoreData({
      id: "",
      user_id: user?.id,
      name: "",
      cover: "",
      email: "",
      description: "",
      announcement: "",
      working_hours: "",
      address: "",
      phone: "",
    });
  }

  function updateFormData(e: SyntheticEvent) {
    let input = e.target as HTMLInputElement;
    setStoreData((old) => ({ ...old, [input.name]: input.value }));
  }

  async function fetchStoreData(id: string) {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("stores")
        .select()
        .match({ id, user_id: user?.id })
        .single();
      if (error) {
        throw error;
      }
      setStoreData(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      setIsUpdating(true);

      if (storeId === "") {
        let { id, ...rest } = storeData;
        let insertData = rest;
        const { data, error } = await supabase
          .from("stores")
          .insert([rest])
          .single();
        if (error) {
          throw error;
        }
      } else {
        const { data, error } = await supabase
          .from("stores")
          .upsert([storeData])
          .single();
        if (error) {
          throw error;
        }
      }
      onRefetchStores();
      setIsUpdating(false);
    } catch (e) {
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    if (storeId !== "") {
      fetchStoreData(storeId);
    } else {
      resetStoreData();
    }
  }, [storeId]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
      <DrawerOverlay />
      <form onSubmit={submitHandler}>
        <DrawerContent borderLeftRadius="md">
          <DrawerCloseButton onClick={onClose} />
          <DrawerHeader borderBottomWidth="1px">
            {storeId === "" ? "Add new store" : "Edit store"}
          </DrawerHeader>
          <DrawerBody p="0px" overflowY="auto">
            {!isLoading && (
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                p="20px"
              >
                <FormControl mb="20px">
                  <FormLabel>Store Name</FormLabel>
                  <Input
                    placeholder="name"
                    name="name"
                    type="text"
                    required
                    value={storeData.name}
                    onInput={updateFormData}
                  />
                </FormControl>
                <FormControl mb="20px">
                  <FormLabel>Store Email</FormLabel>
                  <Input
                    placeholder="email"
                    name="email"
                    type="email"
                    value={storeData.email}
                    onInput={updateFormData}
                  />
                </FormControl>
                <FormControl mb="20px">
                  <FormLabel>Phone</FormLabel>
                  <Input
                    placeholder="000 000 000"
                    name="phone"
                    type="text"
                    value={storeData.phone}
                    onInput={updateFormData}
                  />
                </FormControl>
                <FormControl mb="20px">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="description"
                    name="description"
                    value={storeData.description}
                    onInput={updateFormData}
                  />
                </FormControl>
                <FormControl mb="20px">
                  <FormLabel>Annoucement</FormLabel>
                  <Textarea
                    placeholder="Your message"
                    name="announcement"
                    value={storeData.announcement}
                    onInput={updateFormData}
                  />
                </FormControl>
                <FormControl mb="20px">
                  <FormLabel>Working hours</FormLabel>
                  <Textarea
                    placeholder="Monday  10 - 00"
                    name="working_hours"
                    value={storeData.working_hours}
                    onInput={updateFormData}
                  />
                </FormControl>
                <FormControl mb="20px">
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    placeholder="USA, NYC"
                    name="address"
                    value={storeData.address}
                    onInput={updateFormData}
                  />
                </FormControl>
              </Box>
            )}
            {isLoading && (
              <Center mt="30px">
                <Spinner color="blue" />
              </Center>
            )}
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Center w="full" gap="10px">
              <Button isLoading={isUpdating} type="submit" colorScheme="blue">
                {storeId !== "" ? "Update" : "Save"}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </Center>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default StoreDrawer;
