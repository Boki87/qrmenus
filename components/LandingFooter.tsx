import {
  IconButton,
  Box,
  GridItem,
  Grid,
  VStack,
  HStack,
  Text,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import AppLogo from "./AppLogo";
import AppContainer from "./Container";
import { BsGithub, BsTwitter, BsEnvelopeFill } from "react-icons/bs";

const LandingFooter = () => {
  return (
    <Box as="footer" py="50px">
      <AppContainer>
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
        >
          <GridItem mb="20px">
            <VStack alignItems="flex-start">
              <AppLogo />
              <HStack mt="15px">
                <Link href="https://github.com/Boki87/qrmenus" target="_blank">
                  <IconButton
                    colorScheme="blue"
                    borderRadius="full"
                    variant="ghost"
                    aria-label="twitter profile"
                    icon={<BsGithub />}
                  />
                </Link>
                <IconButton
                  colorScheme="blue"
                  borderRadius="full"
                  variant="ghost"
                  aria-label="twitter profile"
                  icon={<BsTwitter />}
                />
                <IconButton
                  colorScheme="blue"
                  borderRadius="full"
                  variant="ghost"
                  aria-label="twitter profile"
                  icon={<BsEnvelopeFill />}
                />
              </HStack>
            </VStack>
            <Text color="gray.500" mt="15px">
              © by QRMenus. All rights reserved.
            </Text>
          </GridItem>
          <GridItem mb="20px">
            <VStack alignItems="flex-start">
              <Text fontWeight="bold">Links</Text>
              <NextLink href="#">
                <Link>Home</Link>
              </NextLink>
              <NextLink href="#">
                <Link>How it works</Link>
              </NextLink>
            </VStack>
          </GridItem>
          <GridItem mb="20px">
            <VStack alignItems="flex-start">
              <Text fontWeight="bold">Legal</Text>
              <NextLink href="#">
                <Link>Privacy Policy</Link>
              </NextLink>
              <NextLink href="#">
                <Link>Terms of Service</Link>
              </NextLink>
            </VStack>
          </GridItem>
        </Grid>
      </AppContainer>
    </Box>
  );
};

export default LandingFooter;
