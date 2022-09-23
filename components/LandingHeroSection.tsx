import {Button, VStack, Box, Text, Center, useColorModeValue, HStack } from "@chakra-ui/react";
import AppContainer from "./Container";
import NextLink from 'next/link'
import {VscArrowSmallRight} from 'react-icons/vsc'

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
            <HStack>
              <NextLink href="/auth/signup">
                <Button border="2px" borderColor="blue.400" color="white" borderRadius="full" bg="blue.400" _hover={{color: 'blue.500', bg:'gray.50'}}>Create an account <VscArrowSmallRight /></Button>
              </NextLink>
              <NextLink href="/app">
                <Button border="2px" borderColor="blue.400" color="blue.400" borderRadius="full">App Dashboard</Button>
              </NextLink>
            </HStack>
          </VStack>
        </Center>
      </AppContainer>
    </Box>
  );
};

export default LandingHeroSection;
