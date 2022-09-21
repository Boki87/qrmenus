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
        destination: "auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
