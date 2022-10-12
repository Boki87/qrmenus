import type { NextPage } from "next";
import NextLink from "next/link";
import {
  Link,
  Box,
  Text,
  HStack,
  Button,
  useColorModeValue,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import {APP_URL} from '../../api/supabase-client'
import AuthLayout from "../../components/AuthLayout";
import {supabase} from '../../api/supabase-client'
import { BsArrowRight } from "react-icons/bs";
import ThemeToggleButton from "../../components/ThemeToggleButton";
import SignupForm from "../../components/SignupForm";
import AppLogo from "../../components/AppLogo";

const Signup: NextPage = () => {



  async function googleLogin() {
    const { user, session, error } = await supabase.auth.signIn(
      {
        provider: "google",
      },
      { redirectTo: `${APP_URL}/auth/callbacks` }
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
          <NextLink href="/">
            <Box mb="20px" cursor="pointer">
              <AppLogo />
            </Box>
          </NextLink>

        <Text
          as="h1"
          fontSize="3xl"
          fontWeight="bolder"
          color={useColorModeValue("gray.700", "white")}
        >
          Create an account
        </Text>
        <Text as="p" color={useColorModeValue("gray.600", "gray.300")}>
          Enter your information to create a new account. Already have an
          account?{" "}
          <NextLink href="/auth/signin">
            <Link
              color="blue.500"
              fontWeight="bold"
              display="inline-flex"
              alignItems="center"
              gap="5px"
            >
              Sign in <BsArrowRight />
            </Link>
          </NextLink>
        </Text>

        <Box mt="30px">
          <SignupForm />
        </Box>

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
          <Button onClick={googleLogin} borderRadius="full" colorScheme="blue" flex="1">
            Google
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

export default Signup;
