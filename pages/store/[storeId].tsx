import {Box} from '@chakra-ui/react'
import type { GetServerSideProps, NextPage } from "next";
import { fetchStoreData } from "../../api/stores";
import { GlobalStoreData } from "../../types/GlobalStorePage";
import GlobalStorePage from "../../components/globalStore";

const StorePage: NextPage<GlobalStoreData> = ({ storeData }) => {
  return (
    <Box bg="black" h="full" overflow="auto">
      <GlobalStorePage storeData={storeData} />
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
