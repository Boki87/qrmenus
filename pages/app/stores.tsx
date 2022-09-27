import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { supabase } from "../../api/supabase-client";
import AppLayout from "../../components/AppLayout";
import AppContainer from "../../components/Container";

const Stores: NextPage = () => {
  return (
    <AppLayout>
      <AppContainer>Stores</AppContainer>
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

  return {
    props: {},
  };
}
