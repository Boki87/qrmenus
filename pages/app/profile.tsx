import { SyntheticEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Center,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { supabase } from "../../api/supabase-client";
import AppLayout from "../../components/AppLayout";
import AppContainer from "../../components/Container";
import AvatarUpload from "../../components/AvatarUpload";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUser } from "../../features/user/user-slice";

const AppPage: NextPage = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateUserName(e: SyntheticEvent) {
    let input = e.target as HTMLInputElement;
    // console.log(input.value)
    setUserName(input.value);
  }

  async function updateName() {
    if (!user) return;
    try {
      setIsLoading(true);
      let { data, error } = await supabase
        .from("profiles")
        .update({ name: userName })
        .match({ id: user.user_profile_id });
      if (error) throw error;
      console.log(data);
      dispatch(
        setUser({
          ...user,
          name: userName,
        })
      );
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user]);

  return (
    <AppLayout>
      <AppContainer>
        <Grid
          templateColumns={{ base: "repeat(1, 1ft)", md: "repeat(2, 1fr)" }}
          gap={2}
          mt="30px"
        >
          <GridItem w="100%" pt="10px" order={{ base: 1, md: -1 }}>
            <FormControl mb="10px">
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={userName}
                onChange={updateUserName}
              />
            </FormControl>

            <FormControl mb="30px">
              <FormLabel>Email</FormLabel>
              <Input type="email" defaultValue={user?.email} disabled />
            </FormControl>

            <Center>
              <Button onClick={updateName} isLoading={isLoading}>
                Save
              </Button>
            </Center>
          </GridItem>
          <GridItem w="100%" pt="10px">
            <Center>
              <AvatarUpload />
            </Center>
          </GridItem>
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

  return {
    props: {},
  };
};
