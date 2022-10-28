import { Box, useColorModeValue, Image } from "@chakra-ui/react";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box w="full" h="full" display="flex">
      <Box flex="1" bg={useColorModeValue("white", "gray.700")} px="20px">
        {children}
      </Box>
      <Box
        flex="1"
        bg={useColorModeValue("gray.100", "gray.900")}
        display={{ base: "none", xl: "flex" }}
        alignItems="center"
        justifyContent="center"
      >
        {/*Your bg here*/}
        <Image
          src="/images/auth-bg.jpg"
          minW="full"
          minH="full"
          objectFit="cover"
        />
      </Box>
    </Box>
  );
};

export default AuthLayout;
