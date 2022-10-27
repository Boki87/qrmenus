import {
  Button,
  VStack,
  Box,
  Text,
  Center,
  useColorModeValue,
  HStack,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import AppContainer from "./Container";
import NextLink from "next/link";
import { VscArrowSmallRight } from "react-icons/vsc";
import AnimatedSection from "./AnimatedSection";

const LandingHeroSection = () => {
  return (
    <Box py="100px">
      <AppContainer>
        <Center>
          <VStack textAlign="center">
            <Text
              as="h1"
              fontSize="4xl"
              fontWeight="bold"
              color={useColorModeValue("gray.700", "gray.100")}
              letterSpacing="tighter"
              lineHeight={"45px"}
              mb="10px"
            >
              Make a Digital QR Code Menu for your restaurant
            </Text>
            <HStack>
              <NextLink href="/auth/signup">
                <Button
                  border="2px"
                  borderColor="blue.400"
                  color="white"
                  borderRadius="full"
                  bg="blue.400"
                  _hover={{ color: "blue.500", bg: "gray.50" }}
                >
                  Create an account <VscArrowSmallRight />
                </Button>
              </NextLink>
              <NextLink href="/app">
                <Button
                  border="2px"
                  borderColor="blue.400"
                  color="blue.400"
                  borderRadius="full"
                >
                  App Dashboard
                </Button>
              </NextLink>
            </HStack>
            <Text>
              QRMenus is a passion project. And it will be free to use for
              anyone. All of the source code can be found on{" "}
              <a
                href="https://github.com/Boki87/qrmenus"
                target="_blank"
                style={{ color: `var(--chakra-colors-blue-500)` }}
                rel="noreferrer"
              >
                github.com
              </a>
            </Text>
          </VStack>
        </Center>
        <AnimatedSection delay={0.4}>
          <AspectRatio
            maxW="1100px"
            w="100%"
            maxH="768px"
            ratio={1100 / 768}
            overflow="hidden"
            borderRadius="xl"
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            shadow="xl"
            mt="50px"
            bg="white"
            border="1px"
            borderColor="gray.100"
          >
            <Image
              src="/images/preview/qrmenus1.jpg"
              minW="100%"
              h="auto"
              objectFit="contain"
            />
          </AspectRatio>
        </AnimatedSection>
      </AppContainer>
    </Box>
  );
};

export default LandingHeroSection;
