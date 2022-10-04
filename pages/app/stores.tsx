import {
  Center,
  VStack,
  Box,
  Text,
  HStack,
  Spacer,
  Button,
  Grid,
  Spinner,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { supabase } from "../../api/supabase-client";
import AppLayout from "../../components/AppLayout";
import AppContainer from "../../components/Container";
import { fetchStoresForUser } from "../../api/stores";
import { Store } from "../../types/Store";
import StoreCard from "../../components/stores/StoreCard";
import { IoAddSharp } from "react-icons/io5";
import { useState } from "react";
import StoreDrawer from "../../components/stores/StoreDrawer";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { openConfirmDialog } from "../../features/modals/modal-slice";

const Stores: NextPage<{ stores?: Store[] }> = ({ stores }) => {
  const dispatch = useAppDispatch();
  const [storesArr, setStoresArr] = useState<Store[] | undefined>(stores);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [storeId, setStoreId] = useState(""); // '' for new store, 'uuid' to edit existing
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  async function fetchStores() {
    try {
      setIsLoading(true)
      if (user?.id) {
        const updatedStores = await fetchStoresForUser(user?.id);
        setStoresArr(updatedStores);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  async function deleteStoreHandler(id?: string) {
    try {
      let { payload: isConfirmed } = await dispatch(
        openConfirmDialog("Sure yuo want to delete this store?")
      );
      if (isConfirmed) {
        const { data, error } = await supabase
          .from("stores")
          .delete()
          .match({ id });
        if (error) {
          throw error;
        }
        setStoresArr(storesArr?.filter((s) => s.id !== id));
        // await fetchStores();
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <AppLayout>
      <AppContainer>
        <HStack>
          <Text fontSize="xl" fontWeight="bold">
            Your stores
          </Text>
          <Spacer />
          <Button
            onClick={() => {
              setStoreId("");
              setIsDrawerOpen(true);
            }}
            rightIcon={<IoAddSharp />}
            colorScheme="blue"
          >
            NEW STORE
          </Button>
        </HStack>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap="3"
          mt="20px"
        >
          {storesArr &&
            !isLoading &&
            storesArr.map((store) => (
              <StoreCard
                store={store}
                onEditStore={(id?: string) => {
                  if (id) {
                    setStoreId(id);
                    setIsDrawerOpen(true);
                  }
                }}
                onDeleteStore={deleteStoreHandler}
                key={store.id}
              />
            ))}
        </Grid>
        {(!storesArr && !isLoading) ||
          (storesArr?.length == 0 && (
            <VStack w="full">
              <Text>No stores yet</Text>
              <img src="/images/undraw/dine.svg" style={{ height: "200px" }} />
            </VStack>
          ))}
        {isLoading && (
          <Center mt="30px">
            <Spinner color="blue" />
          </Center>
        )}
        <StoreDrawer
          isOpen={isDrawerOpen}
          storeId={storeId}
          onRefetchStores={fetchStores}
          onClose={() => {
            setIsDrawerOpen(false);
            setStoreId("");
          }}
        />
      </AppContainer>
    </AppLayout>
  );
};

export default Stores;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const stores = await fetchStoresForUser(user.id);
    return {
      props: {
        stores,
      },
    };
  } catch (e) {
    return {
      props: {},
    };
  }
};
