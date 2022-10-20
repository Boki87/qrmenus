import { Box, Text } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { supabase } from "../../api/supabase-client";
import AppLayout from "../../components/AppLayout";
import AppContainer from "../../components/Container";

const AppPage: NextPage = () => {
  return (
    <AppLayout>
      <AppContainer>
        <Text>Dashboard</Text>
        <Box h="3000px"></Box>
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

    console.log(stats);
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
