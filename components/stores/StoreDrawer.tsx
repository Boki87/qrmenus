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
  FormControl,
  FormLabel,
  Textarea,
  DrawerFooter,
} from "@chakra-ui/react";
import { supabase } from "../../api/supabase-client";
import { useAppSelector } from "../../app/hooks";
import { Store } from "../../types/Store";
import useUploadFileHook from "../../hooks/useUploadFileHook";
import { AiOutlineUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

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
  const [file, setFile] = useState<File | null>(null);

  const { uploadFile, isUploading, errorUploading, publicUrl } =
    useUploadFileHook();

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

  const setFileHandler = (e: SyntheticEvent) => {
    let input = e.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      setFile(null);
      return;
    }

    let f = input.files[0];

    setFile(f);
  };

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

  async function submitHandler(e?: SyntheticEvent) {
    if (e) {
      e.preventDefault();
    }
    try {
      setIsUpdating(true);

      if (storeId === "") {
        let { id, ...rest } = storeData;
        let insertData = rest;
        insertData.user_id = user?.id;
        const { data, error } = await supabase
          .from("stores")
          .insert([rest])
          .single();
        if (error) {
          throw error;
        }
        if (file) {
          let publicUrl = await uploadFile({
            bucketName: "public",
            file,
            fileName: `${data.id}-cover`,
            folder: "store-images",
          });
          // setStoreData(data);
          const { data: updateData, error: updateError } = await supabase
            .from("stores")
            .update({ cover: publicUrl + "?" + +new Date() })
            .match({ id: data.id });
          if (updateError) {
            throw updateError;
          }
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

  async function removeCover() {
    if (!storeData?.cover) {
      return;
    }

    if (storeData.cover.includes("blob:http")) {
      setStoreData({ ...storeData, cover: "" });
      return;
    }

    let coverUrl = storeData?.cover.split("?")[0].split("/public/public/")[1];
    if (!coverUrl) {
      return;
    }
    try {
      const { data, error } = await supabase.storage
        .from("public")
        .remove([coverUrl]);
      if (error) {
        throw error;
      }

      const { data: updateData, error: updateError } = await supabase
        .from("stores")
        .update({ cover: "" })
        .match({ id: storeData.id });

      if (updateError) {
        throw updateError;
      }
      setStoreData({ ...storeData, cover: "" });
      onRefetchStores();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (storeId !== "") {
      fetchStoreData(storeId);
    } else {
      resetStoreData();
    }
  }, [storeId]);

  useEffect(() => {
    if (file && storeId !== "") {
      uploadFile({
        bucketName: "public",
        file,
        fileName: `${storeId}-cover`,
        folder: "store-images",
      });
    }

    if (file && storeId === "") {
      let img = URL.createObjectURL(file);
      setStoreData({ ...storeData, cover: img });
    }
  }, [file]);

  useEffect(() => {
    if (publicUrl && storeId !== "") {
      storeData.cover = publicUrl + "?" + +new Date();
      submitHandler();
    }
  }, [publicUrl]);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      resetStoreData();
    }
  }, [isOpen]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement={'right'} size={{base: 'full', md:'md'}}>
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
                <VStack>
                  <Image
                    src={storeData.cover || "/images/undraw/image.svg"}
                    maxW="200px"
                    maxH="200px"
                  />
                  <HStack>
                    <Button
                      as="label"
                      htmlFor="fileInput"
                      isLoading={isUploading}
                      rightIcon={<AiOutlineUpload />}
                    >
                      Upload Cover
                    </Button>
                    {storeData.cover !== "" && (
                      <Button
                        fontSize="xl"
                        onClick={removeCover}
                        colorScheme="red"
                      >
                        <MdDelete />
                      </Button>
                    )}
                  </HStack>
                  <input
                    type="file"
                    name="fileInput"
                    id="fileInput"
                    style={{ display: "none", position: "absolute" }}
                    accept="image/*"
                    onChange={setFileHandler}
                  />
                </VStack>
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
