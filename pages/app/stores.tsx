import {
  Center,
  VStack,
  Box,
  Text,
  HStack,
  Spacer,
  Button,
  Grid,
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
import DineSvg from "../../assets/undraw/dine.svg";

const Stores: NextPage<{ stores?: Store[] }> = ({ stores }) => {
  return (
    <AppLayout>
      <AppContainer>
        <HStack>
          <Text fontSize="xl" fontWeight="bold">
            Your stores
          </Text>
          <Spacer />
          <Button rightIcon={<IoAddSharp />}>NEW STORE</Button>
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
          {stores &&
            stores.map((store) => <StoreCard store={store} key={store.id} />)}
        </Grid>
        {!stores ||
          (stores.length == 0 && (
            <VStack w="full">
              <Text>No stores yet</Text>
              <img src="/images/undraw/dine.svg" style={{ height: "200px" }} />
            </VStack>
          ))}
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
