import { VStack, Box, Text, Center, useColorModeValue } from "@chakra-ui/react";
import AppContainer from "./Container";

const LandingHeroSection = () => {
  return (
    <Box py="100px">
      <AppContainer>
        <Center>
          <VStack textAlign="center">
            <Text
              as="h1"
              fontSize="6xl"
              fontWeight="bold"
              color={useColorModeValue("gray.700", "gray.100")}
              letterSpacing="tighter"
              lineHeight={'45px'}
              mb="10px"
            >
              Welcome to your new web app!
            </Text>
            <Text fontSize="xl">
              Build whatever you want with this starter template.
            </Text>
          </VStack>
        </Center>
      </AppContainer>
    </Box>
  );
};

export default LandingHeroSection;
