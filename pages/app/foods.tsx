import { useState, useEffect, SyntheticEvent, useCallback } from "react";
import update from "immutability-helper";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { supabase } from "../../api/supabase-client";
import AppLayout from "../../components/AppLayout";
import AppContainer from "../../components/Container";
import { Grid, GridItem, HStack, Select } from "@chakra-ui/react";
import FoodCategories from "../../components/foods/FoodCategories";
import { fetchCategoriesForStore } from "../../api/foods";
import { fetchStoresForUser } from "../../api/stores";
import { Store } from "../../types/Store";
import { User } from "../../types/User";
import { FoodCategory } from "../../types/FoodCategory";
import FoodCategoryModal from "../../components/foods/FoodCategoryModal";
import { openConfirmDialog } from "../../features/modals/modal-slice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import FoodItems from "../../components/foods/FoodItems";
import {
  setSelectedStore,
  setSelectedCategory,
  setCategoryToEdit,
} from "../../features/food/food-slice";
import AnimatedSection from "../../components/AnimatedSection";

interface FoodsPageProps {
  stores: Store[] | [];
  user: User;
}

const Foods: NextPage<FoodsPageProps> = ({ stores, user }) => {
  const dispatch = useAppDispatch();

  const { selectedStore, categoryToEdit } = useAppSelector(
    (state) => state.food
  );

  const [categories, setCategories] = useState<FoodCategory[] | []>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  async function fetchAndSetCategories(storeId: string) {
    const cats = await fetchCategoriesForStore(storeId, user.id);
    setCategories(cats);
  }

  async function deleteCategoryHandler(id: number) {
    const { payload: isConfirmed } = await dispatch(
      openConfirmDialog("Sure you want to delete this category?")
    );

    if (!isConfirmed) return;
    dispatch(setSelectedCategory(-1));
    try {
      const { data: foodData, error: foodError } = await supabase
        .from("foods")
        .delete()
        .match({ food_category_id: id });

      if (foodError) throw foodError;

      const { data, error } = await supabase
        .from("food_categories")
        .delete()
        .match({ id });
      if (error) throw error;

      setCategories((prevCats) => {
        return prevCats.filter((c) => c.id !== id);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function storeSelectHandler(e: SyntheticEvent) {
    let { value: selectedValue } = e.target as HTMLSelectElement;
    dispatch(setSelectedStore(stores.filter((s) => s.id === selectedValue)[0]));
    dispatch(setSelectedCategory(-1));
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
      dispatch(setSelectedCategory(-1));
      setLoadingCategories(false);
    }
  }

  async function reorderOnServer(newCats: FoodCategory[]) {
    try {
      const { data, error } = await supabase
        .from("food_categories")
        .upsert(newCats, { onConflict: "id" });

      if (error) throw error;
    } catch (e) {
      console.log(e);
    }
  }

  const reorderCategoriesHandler = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setCategories((prevCategories: FoodCategory[]) => {
        let newCats = update(prevCategories, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCategories[dragIndex] as FoodCategory],
          ],
        });

        let arr = newCats.map((c, i) => {
          return { ...c, order_index: i + 1 };
        });
        //update order on server
        reorderOnServer(arr);

        return arr;
      });
    },
    []
  );

  useEffect(() => {
    dispatch(setSelectedStore(null));
    dispatch(setSelectedCategory(-1));
  }, []);

  return (
    <>
      <AppLayout>
        <AppContainer>
          <AnimatedSection>
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
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <Grid
              mt="20px"
              templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
              gap={{ base: 0, md: 2 }}
              mb="100px"
            >
              <GridItem minW="200px">
                <FoodCategories
                  categories={categories}
                  loading={loadingCategories}
                  onOpenModal={() => setIsCategoryModalOpen(true)}
                  reorderCategories={reorderCategoriesHandler}
                  onEdit={(id) => {
                    dispatch(setCategoryToEdit(id));
                    setIsCategoryModalOpen(true);
                  }}
                  onDelete={deleteCategoryHandler}
                />
              </GridItem>
              <GridItem colSpan={3}>
                <FoodItems />
              </GridItem>
            </Grid>
          </AnimatedSection>
        </AppContainer>
      </AppLayout>
      <FoodCategoryModal
        selectedStore={selectedStore}
        categoryToEdit={categoryToEdit}
        isOpen={isCategoryModalOpen}
        categories={categories}
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
          dispatch(setCategoryToEdit(-1));
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
