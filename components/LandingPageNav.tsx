import { ReactNode, useState, useEffect } from "react";
import {
  Button,
  Link,
  VStack,
  HStack,
  Spacer,
  Text,
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  MenuGroup,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import AppContainer from "./Container";
import AppLogo from "./AppLogo";
import { useAppSelector } from "../app/hooks";
import ThemeToggleButton from "./ThemeToggleButton";
import NextLink from "next/link";
import { MdPerson, MdExitToApp } from "react-icons/md";
import { supabase } from "../api/supabase-client";
import { useRouter } from "next/router";
import { GoThreeBars } from "react-icons/go";

const AppNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showBorder, setShowBorder] = useState(false);

  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  async function signOut() {
    supabase.auth.signOut();
  }

  useEffect(() => {
    const onScroll = (e: Event) => {
      if (window.scrollY > 20) {
        setShowBorder(true);
      } else {
        setShowBorder(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <HStack
        as="nav"
        h="80px"
        borderBottom={"1px"}
        borderColor={useColorModeValue(
          showBorder ? "transparent" : "gray.200",
          showBorder ? "transparent" : "whiteAlpha.200"
        )}
        alignItems="center"
        position="fixed"
        top="0px"
        left="0px"
        w="full"
        bg={useColorModeValue("white", "gray.800")}
        zIndex={1}
      >
        <AppContainer h="full">
          <HStack h="full">
            <HStack>
              <NextLink href="/">
                <Box cursor="pointer">
                  <AppLogo />
                </Box>
              </NextLink>

              <HStack
                style={{ marginLeft: "50px" }}
                h="full"
                gap="10px"
                display={{ base: "none", md: "flex" }}
              >
                <Link href="#">Home</Link>
                <Link href="#howitworks">How it works</Link>
              </HStack>
            </HStack>
            <Spacer />
            <HStack>
              <ThemeToggleButton />
              {!user && (
                <NextLink href="/auth/signin">
                  <Button
                    border="2px"
                    borderColor="blue.300"
                    borderRadius="full"
                    color="blue.500"
                  >
                    Sign in
                  </Button>
                </NextLink>
              )}
              {user && (
                <Menu>
                  <MenuButton
                    as={Avatar}
                    aria-label="Options"
                    variant="outline"
                    size="sm"
                    cursor="pointer"
                    src={user?.avatar}
                    _hover={{ filter: "brightness(95%)" }}
                  />

                  <MenuList>
                    <MenuGroup title={"Hello " + user?.name}>
                      <Link href="/app/profile">
                        <MenuItem icon={<MdPerson />}>Profile</MenuItem>
                      </Link>
                      <MenuItem onClick={signOut} icon={<MdExitToApp />}>
                        Sign Out
                      </MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>
              )}
              <IconButton
                display={{ base: "inline-flex", md: "none" }}
                aria-label="drawer toggle"
                icon={<GoThreeBars />}
                borderRadius="full"
                onClick={onOpen}
              />
            </HStack>
          </HStack>
        </AppContainer>
      </HStack>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody>
            <VStack alignItems="flex-start" mt="50px">
              <NavLink href="#">Section 1</NavLink>
              <NavLink href="#">Section 2</NavLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AppNav;

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
  return (
    <NextLink href={href}>
      <Link fontWeight="bold">{children}</Link>
    </NextLink>
  );
};
