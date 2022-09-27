import {
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
} from "@chakra-ui/react";
import AppContainer from "./Container";
import AppLogo from "./AppLogo";
import { useAppSelector } from "../app/hooks";
import ThemeToggleButton from "./ThemeToggleButton";
import Link from "next/link";
import { MdPerson, MdExitToApp } from "react-icons/md";
import { supabase } from "../api/supabase-client";
import { useRouter } from "next/router";

const AppNav = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  async function signOut() {
    supabase.auth.signOut();
    router.push("/auth/signin");
  }

  return (
    <HStack
      as="nav"
      h="60px"
      borderBottom="1px"
      borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
      alignItems="center"
      position="fixed"
      top="0px"
      left="0px"
      w="full"
      bg={useColorModeValue("white", "gray.800")}
      zIndex={1}
    >
      <AppContainer h="full" maxW="full">
        <HStack h="full">
          <Link href="/">
            <Box cursor="pointer">
              <AppLogo />
            </Box>
          </Link>
          <Spacer />
          <HStack>
            <ThemeToggleButton />
            <Menu>
              <MenuButton
                as={Avatar}
                aria-label="Options"
                variant="outline"
                size="sm"
                cursor="pointer"
                src={user?.user?.avatar}
                _hover={{ filter: "brightness(95%)" }}
              />

              <MenuList>
                <MenuGroup title={"Hello " + user?.user?.name}>
                  <Link href="/app/profile">
                    <MenuItem icon={<MdPerson />}>Profile</MenuItem>
                  </Link>
                  <MenuItem onClick={signOut} icon={<MdExitToApp />}>
                    Sign Out
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </AppContainer>
    </HStack>
  );
};

export default AppNav;
