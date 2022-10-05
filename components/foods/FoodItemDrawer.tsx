import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import {
  Spacer,
  Switch,
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
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { supabase } from "../../api/supabase-client";
import { useAppSelector } from "../../app/hooks";
import { Food } from "../../types/Food";
import useUploadFileHook from "../../hooks/useUploadFileHook";
import { AiOutlineUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

interface FoodItemDrawerProps {
  isOpen: boolean;
  foodItemId: string;
  storeId: string;
  categoryId: string;
  onClose: () => void;
  onRefetchFoodList: () => void;
}

const FoodItemDrawer = ({
  isOpen,
  foodItemId,
  storeId,
  categoryId,
  onClose,
  onRefetchFoodList,
}: FoodItemDrawerProps) => {
  const user = useAppSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { uploadFile, isUploading, errorUploading, publicUrl } =
    useUploadFileHook();

  const toast = useToast();

  const [foodItemData, setFoodItemData] = useState<Food>({
    id: "",
    user_id: user?.id || "",
    store_id: storeId,
    food_category_id: categoryId,
    name: "",
    image: "",
    description: "",
    comment: "",
    price: 0,
    currency: "",
    is_live: true,
    is_featured: false,
    size: 0,
    size_unit: "",
    prep_time: 0,
  });

  function resetStoreData() {
    setFoodItemData({
      id: "",
      user_id: user?.id || "",
      store_id: storeId,
      food_category_id: categoryId,
      name: "",
      image: "",
      description: "",
      comment: "",
      price: 0,
      currency: "",
      is_live: true,
      is_featured: false,
      size: 0,
      size_unit: "",
      prep_time: 0,
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
    setFoodItemData((old) => ({ ...old, [input.name]: input.value }));
  }

  async function fetchFoodItemData(id: string) {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("foods")
        .select()
        .match({ id, user_id: user?.id })
        .single();
      if (error) {
        throw error;
      }
      setFoodItemData(data);
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
    if (!user?.id) return;

    try {
      setIsUpdating(true);

      if (foodItemId === "") {
        let { id, ...rest } = foodItemData;
        let insertData = rest;
        insertData.user_id = user?.id;
        const { data, error } = await supabase
          .from("foods")
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
            folder: "food-images",
          });
          const { data: updateData, error: updateError } = await supabase
            .from("foods")
            .update({ image: publicUrl + "?" + +new Date() })
            .match({ id: data.id });
          if (updateError) {
            throw updateError;
          }
        }
      } else {
        const { data, error } = await supabase
          .from("foods")
          .upsert([foodItemData])
          .single();
        if (error) {
          throw error;
        }
      }
      setIsUpdating(false);
      onRefetchFoodList();
      toast({
        status: "success",
        description: "Changes saved",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (e) {
      setIsUpdating(false);
      toast({
        status: "error",
        description: "Could not save changes.",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  }

  async function removeCover() {
    if (!foodItemData?.image) {
      return;
    }

    if (foodItemData.image.includes("blob:http")) {
      setFoodItemData({ ...foodItemData, image: "" });
      return;
    }

    let imageUrl = foodItemData?.image
      .split("?")[0]
      .split("/public/public/")[1];
    if (!imageUrl) {
      return;
    }
    try {
      const { data, error } = await supabase.storage
        .from("public")
        .remove([imageUrl]);
      if (error) {
        throw error;
      }

      const { data: updateData, error: updateError } = await supabase
        .from("foods")
        .update({ image: "" })
        .match({ id: foodItemData.id });

      if (updateError) {
        throw updateError;
      }
      setFoodItemData({ ...foodItemData, image: "" });
      onRefetchFoodList();
      //   onClose();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (foodItemId !== "") {
      fetchFoodItemData(foodItemId);
    } else {
      resetStoreData();
    }
  }, [foodItemId]);

  useEffect(() => {
    if (file && foodItemId !== "") {
      uploadFile({
        bucketName: "public",
        file,
        fileName: `${foodItemId}-cover`,
        folder: "food-images",
      });
    }

    if (file && foodItemId === "") {
      let img = URL.createObjectURL(file);
      setFoodItemData({ ...foodItemData, image: img });
    }
  }, [file]);

  useEffect(() => {
    if (publicUrl && foodItemId !== "") {
      foodItemData.image = publicUrl + "?" + +new Date();
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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={"right"}
      size={{ base: "full", md: "md" }}
    >
      <DrawerOverlay />
      <form onSubmit={submitHandler}>
        <DrawerContent borderLeftRadius="md">
          <DrawerCloseButton onClick={onClose} />
          <DrawerHeader borderBottomWidth="1px">
            {foodItemId === "" ? "Add a food to the list" : "Edit food"}
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
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Special delux burger"
                    name="name"
                    type="text"
                    required
                    value={foodItemData.name}
                    onInput={updateFormData}
                  />
                </FormControl>

                <FormControl mb="20px">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Food description"
                    name="description"
                    value={foodItemData.description}
                    onInput={updateFormData}
                  />
                </FormControl>
                <FormControl mb="20px">
                  <FormLabel>Comments</FormLabel>
                  <Textarea
                    placeholder="comments on the food"
                    name="comment"
                    value={foodItemData.comment}
                    onInput={updateFormData}
                  />
                </FormControl>
                <FormControl mb="20px">
                  <FormLabel>Price</FormLabel>
                  <HStack>
                    <Input
                      placeholder=""
                      name="price"
                      type="number"
                      value={foodItemData.price}
                      onInput={updateFormData}
                      flex={4}
                    />
                    <Input
                      placeholder="EUR"
                      name="currency"
                      value={foodItemData.currency}
                      onInput={updateFormData}
                      flex={1}
                    />
                  </HStack>
                </FormControl>
                <FormControl mb="20px">
                  <FormLabel>Size</FormLabel>
                  <HStack>
                    <Input
                      placeholder=""
                      name="size"
                      type="number"
                      value={foodItemData.size}
                      onInput={updateFormData}
                      flex={4}
                    />
                    <Input
                      placeholder="grams"
                      name="size_unit"
                      value={foodItemData.size_unit}
                      onInput={updateFormData}
                      flex={1}
                    />
                  </HStack>
                </FormControl>
                <FormControl
                  display="flex"
                  alignItems="center"
                  mb="20px"
                  bg={useColorModeValue("gray.50", "gray.600")}
                  h="40px"
                  px="10px"
                >
                  <FormLabel htmlFor="is-live" mb="0">
                    Is Live
                  </FormLabel>
                  <Spacer />
                  <Switch
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      let isChecked = e.target.checked;
                      let toggle = !isChecked;
                      setFoodItemData({ ...foodItemData, is_live: !toggle });
                    }}
                    isChecked={foodItemData.is_live}
                    id="is-live"
                  />
                </FormControl>
                <FormControl
                  display="flex"
                  alignItems="center"
                  mb="20px"
                  bg={useColorModeValue("gray.50", "gray.600")}
                  h="40px"
                  px="10px"
                >
                  <FormLabel htmlFor="is-featured" mb="0">
                    Is Featured
                  </FormLabel>
                  <Spacer />
                  <Switch
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      let isChecked = e.target.checked;
                      let toggle = !isChecked;
                      setFoodItemData({
                        ...foodItemData,
                        is_featured: !toggle,
                      });
                    }}
                    isChecked={foodItemData.is_featured}
                    id="is-featured"
                  />
                </FormControl>
                <VStack>
                  <Image
                    src={foodItemData.image || "/images/undraw/image.svg"}
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
                    {foodItemData.image !== "" && (
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
                {foodItemId !== "" ? "Update" : "Save"}
              </Button>
              <Button onClick={onClose}>Close</Button>
            </Center>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default FoodItemDrawer;
