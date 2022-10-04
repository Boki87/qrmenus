import { SyntheticEvent, useState, useEffect } from "react";
import {
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { supabase } from "../../api/supabase-client";
import { useAppSelector } from "../../app/hooks";
import { FoodCategory } from "../../types/FoodCategory";

interface FoodCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStore: string;
  categoryToEdit: string;
  onAdded: (category: FoodCategory) => void;
  onUpdated: (data: FoodCategory) => void;
}

const FoodCategoryModal = ({
  isOpen,
  onClose,
  selectedStore,
  categoryToEdit,
  onAdded,
  onUpdated,
}: FoodCategoryModalProps) => {
  const user = useAppSelector((state) => state.user.user);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingFromDb, setLoadingFromDb] = useState(false);

  function updateName(e: SyntheticEvent) {
    const { value } = e.target as HTMLInputElement;
    setName(value);
  }

  async function onSubmitHandler(e: SyntheticEvent) {
    e.preventDefault();
    if (!user?.id || name === "") {
      return;
    }
    if (categoryToEdit === "") {
      await addNewHandler(selectedStore, user.id);
    } else {
      await updateHandler(selectedStore, user.id, categoryToEdit);
    }
  }

  async function addNewHandler(storeId: string, userId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("food_categories")
        .insert([
          {
            name,
            store_id: storeId,
            user_id: userId,
          },
        ])
        .single();
      if (error) {
        throw error;
      }
      onAdded(data);
      setLoading(false);
      onClose();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  async function updateHandler(
    storeId: string,
    userId: string,
    categoryId: string
  ) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("food_categories")
        .update({
          name,
        })
        .match({
          id: categoryId,
          user_id: userId,
          store_id: storeId,
        })
        .single();
      if (error) {
        throw error;
      }
      onUpdated(data);
      setLoading(false);
      onClose();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  async function fetchAndSetName(categoryId: string) {
    try {
      setLoadingFromDb(true);
      const { data, error } = await supabase
        .from("food_categories")
        .select("name")
        .match({ id: categoryId })
        .single();
      if (error) {
        throw error;
      }
      setName(data.name);
      setLoadingFromDb(false);
    } catch (e) {
      console.log(e);
      setLoadingFromDb(false);
    }
  }

  useEffect(() => {
    if (categoryToEdit !== "") {
      fetchAndSetName(categoryToEdit);
    }
  }, [categoryToEdit]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={onSubmitHandler}>
        <ModalContent>
          <ModalHeader>
            {categoryToEdit === ""
              ? "Create a new category"
              : "Update category"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!loadingFromDb && (
              <FormControl mb="20px">
                <FormLabel>Name:</FormLabel>
                <Input
                  placeholder="From the grill"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onInput={updateName}
                />
              </FormControl>
            )}
            {loadingFromDb && (
              <Center>
                <Spinner color="blue.400" />
              </Center>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              mr="10px"
              isLoading={loading}
              type="submit"
              colorScheme="blue"
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default FoodCategoryModal;
