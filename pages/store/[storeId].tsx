import type { GetServerSideProps, NextPage } from "next";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { fetchStoreData } from "../../api/stores";

interface StorePageProps {
  storeData: any | null;
}

const StorePage: NextPage<StorePageProps> = ({ storeData }) => {
  const router = useRouter();

  const { storeId } = router.query;

  console.log(storeData);

  return (
    <Box>
      Hello there {storeId} {JSON.stringify(storeData)}
    </Box>
  );
};

export default StorePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { storeId } = context.query;
  if (!storeId) {
    return {
      props: {
        storeData: null,
      },
    };
  }
  try {
    const storeData = await fetchStoreData(storeId);
    return {
      props: {
        storeData,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        storeData: null,
      },
    };
  }
};
