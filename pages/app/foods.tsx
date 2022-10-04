import { useState, useEffect, SyntheticEvent } from "react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { supabase } from "../../api/supabase-client";
import AppLayout from "../../components/AppLayout";
import AppContainer from "../../components/Container";
import { Grid, GridItem, HStack, Select, Box } from "@chakra-ui/react";
import FoodCategories from "../../components/foods/FoodCategories";
import { fetchCategoriesForStore } from "../../api/foods";
import { fetchStoresForUser } from "../../api/stores";
import { Store } from "../../types/Store";
import { User } from "../../types/User";
import { FoodCategory } from "../../types/FoodCategory";
import FoodCategoryModal from "../../components/foods/FoodCategoryModal";
import { openConfirmDialog } from "../../features/modals/modal-slice";
import { useAppDispatch } from "../../app/hooks";
import FoodItems from "../../components/foods/FoodItems";

interface FoodsPageProps {
  stores: Store[] | [];
  user: User;
}

const Foods: NextPage<FoodsPageProps> = ({ stores, user }) => {
  const dispatch = useAppDispatch();
  const [selectedStore, setSelectedStore] = useState("");
  const [categories, setCategories] = useState<FoodCategory[] | []>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState("");

  async function fetchAndSetCategories(storeId: string) {
    const cats = await fetchCategoriesForStore(storeId, user.id);
    setCategories(cats);
  }

  async function deleteCategoryHandler(id: string) {
    try {
      const { payload: isConfirmed } = await dispatch(
        openConfirmDialog("Sure you want to delete this category?")
      );

      if (isConfirmed) {
        const { data, error } = await supabase
          .from("food_categories")
          .delete()
          .match({ id });
        if (error) throw error;
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function storeSelectHandler(e: SyntheticEvent) {
    let { value: selectedValue } = e.target as HTMLSelectElement;
    setSelectedStore(selectedValue);
    setSelectedCategory("");
    if (selectedValue) {
      try {
        setLoadingCategories(true);
        await fetchAndSetCategories(selectedValue);
        setLoadingCategories(false);
      } catch (e) {
        console.log(e);
        setLoadingCategories(false);
      }
    } else {
      setCategories([]);
      setSelectedCategory("");
      setLoadingCategories(false);
    }
  }

  return (
    <>
      <AppLayout>
        <AppContainer>
          <HStack mt="20px">
            <Select
              onChange={storeSelectHandler}
              variant="filled"
              placeholder="Select a store"
            >
              {stores.map((store) => (
                <option value={store.id} key={store.id}>
                  {store.name}
                </option>
              ))}
            </Select>
          </HStack>
          <Grid
            mt="20px"
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
            gap={{ base: 0, md: 2 }}
          >
            <GridItem minW="200px">
              <FoodCategories
                categories={categories}
                loading={loadingCategories}
                selectedCategory={selectedCategory}
                selectedStore={selectedStore}
                onSelectCategory={(id) => setSelectedCategory(id)}
                onOpenModal={() => setIsCategoryModalOpen(true)}
                onEdit={(id) => {
                  setCategoryToEdit(id);
                  setIsCategoryModalOpen(true);
                }}
                onDelete={deleteCategoryHandler}
              />
            </GridItem>
            <GridItem colSpan={3}>
              <FoodItems selectedCategory={selectedCategory} />
            </GridItem>
          </Grid>
        </AppContainer>
      </AppLayout>
      <FoodCategoryModal
        selectedStore={selectedStore}
        categoryToEdit={categoryToEdit}
        isOpen={isCategoryModalOpen}
        onAdded={(newCat) => {
          setCategories([...categories, newCat]);
        }}
        onUpdated={(updatedVal) => {
          let updatedCats = categories.map((cat) => {
            if (cat.id === updatedVal.id) {
              return updatedVal;
            } else {
              return cat;
            }
          });
          setCategories(updatedCats);
        }}
        onClose={() => {
          setCategoryToEdit("");
          setIsCategoryModalOpen(false);
        }}
      />
    </>
  );
};

export default Foods;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const stores = await fetchStoresForUser(user.id);
    console.log(stores);

    return {
      props: {
        stores,
        user,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        user,
        stores: [],
      },
    };
  }
};
