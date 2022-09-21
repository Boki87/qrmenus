import type { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import {
  Link,
  Box,
  Text,
  HStack,
  Button,
  useColorModeValue,
  Tabs,
  TabPanels,
  Tab,
  TabPanel,
  TabList,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import AuthLayout from "../../components/AuthLayout";
import MagicLinkForm from "../../components/MagicLinkForm";
import { BsArrowRight } from "react-icons/bs";
import PasswordForm from "../../components/PasswordForm";
import ThemeToggleButton from "../../components/ThemeToggleButton";
import { supabase } from "../../api/supabase-client";

const Signin: NextPage = () => {
  async function googleLogin() {
    const { user, session, error } = await supabase.auth.signIn(
      {
        provider: "google",
      },
      { redirectTo: "http://localhost:3000/auth/callbacks" }
    );
    //console.log(user, session, error)
  }

  return (
    <AuthLayout>
      <Box
        maxW="md"
        h="full"
        mx="auto"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box mb="20px">
          <Box fontSize="2xl" fontWeight="bolder">
            <Text as="span" color={useColorModeValue("gray.600", "white")}>
              my
            </Text>
            <Text as="span" color="blue.600">
              app
            </Text>
          </Box>
        </Box>

        <Text
          as="h1"
          fontSize="3xl"
          fontWeight="bolder"
          color={useColorModeValue("gray.700", "white")}
        >
          Welcome back
        </Text>
        <Text as="p" color={useColorModeValue("gray.600", "gray.300")}>
          Welcome back to myapp. Enter your credentials to sign in. Don't have
          an account yet?{" "}
          <NextLink href="/auth/signup">
            <Link
              color="blue.500"
              fontWeight="bold"
              display="inline-flex"
              alignItems="center"
              gap="5px"
            >
              Create one here <BsArrowRight />
            </Link>
          </NextLink>
        </Text>

        <Tabs isFitted mt="20px">
          <TabList>
            <Tab>Magic link</Tab>
            <Tab>Password</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px="0px">
              <MagicLinkForm />
            </TabPanel>
            <TabPanel px="0px">
              <PasswordForm />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Divider my="30px" />

        <Text
          mb="10px"
          fontSize="lg"
          fontWeight="bold"
          color={useColorModeValue("gray.600", "gray.100")}
        >
          Or continue with
        </Text>
        <HStack>
          <Button
            onClick={googleLogin}
            borderRadius="full"
            colorScheme="blue"
            flex="1"
          >
            Google
          </Button>
          <Button
            borderRadius="full"
            bg="black"
            _hover={{ bg: "gray.800" }}
            _active={{ bg: "gray.900" }}
            color="white"
            flex="1"
          >
            Github
          </Button>
        </HStack>

        <HStack mt="30px">
          <ThemeToggleButton />
          <Spacer />
          <Text>&copy; by myapp. All rigths reserved.</Text>
        </HStack>
      </Box>
    </AuthLayout>
  );
};

export default Signin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (user) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
