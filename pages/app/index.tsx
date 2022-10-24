import {
  Box,
  HStack,
  Grid,
  GridItem,
  Text,
  Image,
  useColorModeValue,
  Spacer,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { supabase } from "../../api/supabase-client";
import AppLayout from "../../components/AppLayout";
import AppContainer from "../../components/Container";
import { DashboardStats } from "../../types/DashboardStats";
import ViewsChart from "../../components/dashboard/ViewsChart";
import { useAppSelector } from "../../app/hooks";
import StoreTotalViews from "../../components/dashboard/StoreTotalViews";
import AnimatedSection from "../../components/AnimatedSection";

const AppPage: NextPage<DashboardStats> = ({ stats }) => {
  const user = useAppSelector((state) => state.user.user);
  const bg = useColorModeValue("white", "gray.700");
  const color = useColorModeValue("gray.600", "white");

  if (!stats) {
    return (
      <AppLayout>
        <AppContainer>
          <Text>Could not fetch data</Text>
        </AppContainer>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppContainer>
        <Box>
          <Text fontSize="2xl">Welcome back, {user?.name}</Text>
        </Box>
        <ViewsChart views={stats.store_views} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap="3"
        >
          <AnimatedSection delay={0.1}>
            <StoreTotalViews
              storeViews={stats.total_store_views}
              foodsViews={stats.total_foods_views}
            />
          </AnimatedSection>
          {stats?.stores[0] ? (
            <AnimatedSection delay={0.2}>
              <Box
                borderRadius="xl"
                shadow="xl"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                bg={bg}
                h="full"
              >
                <Box p="20px">
                  <Text fontSize="xl" fontWeight="bold" color={color}>
                    Top performing store
                  </Text>
                  <HStack fontSize="xl">
                    <Text>{stats.stores[0].name}</Text>
                    <Spacer />
                    <Text fontWeight="bold">{stats.stores[0].views}</Text>
                    <Text>
                      {stats.stores[0].views === 1 ? "visti" : "visits"}
                    </Text>
                  </HStack>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flex={1}
                >
                  <Image
                    src={
                      stats.stores[0].cover
                        ? stats.stores[0].cover
                        : "images/undraw/store.svg"
                    }
                    minW="100%"
                    minH="100%"
                  />
                </Box>
              </Box>
            </AnimatedSection>
          ) : null}

          {stats?.foods[0] ? (
            <AnimatedSection delay={0.3}>
              <Box
                borderRadius="xl"
                shadow="xl"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                bg={bg}
                h="full"
              >
                <Box p="20px">
                  <Text fontSize="xl" fontWeight="bold" color={color}>
                    Top performing food
                  </Text>
                  <HStack fontSize="xl">
                    <Text>{stats.foods[0]?.name}</Text>
                    <Spacer />
                    <Text fontWeight="bold">{stats.foods[0].views}</Text>
                    <Text>{stats.foods[0].views === 1 ? "view" : "views"}</Text>
                  </HStack>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flex={1}
                >
                  <Image
                    src={
                      stats.foods[0].image
                        ? stats.foods[0].image
                        : "images/undraw/dine.svg"
                    }
                    minW="100%"
                    minH="100%"
                  />
                </Box>
              </Box>
            </AnimatedSection>
          ) : null}
        </Grid>
      </AppContainer>
    </AppLayout>
  );
};

export default AppPage;

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
    let stats = await fetch("http://localhost:3000/api/stats", {
      method: "POST",
      body: JSON.stringify({ userId: user.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    stats = await stats.json();

    return {
      props: {
        stats,
      },
    };
    //console.log(stats);
  } catch (e) {
    console.log(e);
    return {
      props: {},
    };
  }

  return {
    props: {},
  };
};
