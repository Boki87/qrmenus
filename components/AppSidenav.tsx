import { ReactNode } from "react";
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GiKnifeFork } from "react-icons/gi";
import {
  MdOutlineStorefront,
  MdOutlineBarChart,
  MdSpaceDashboard,
} from "react-icons/md";

const buttons = [
  {
    title: "dashboard",
    href: "/app",
    icon: <MdSpaceDashboard />,
  },

  {
    title: "stores",
    href: "/app/stores",
    icon: <MdOutlineStorefront />,
  },

  {
    title: "foods",
    href: "/app/foods",
    icon: <GiKnifeFork />,
  },
];

const AppSidenav = () => {
  const router = useRouter();
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  return (
    <Box
      minW={{ base: "50px", md: "200px" }}
      h="full"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
    >
      {buttons.map((btn) => (
        <NavBtn
          href={btn.href}
          path={router.asPath}
          icon={btn.icon}
          title={btn.title}
          key={btn.title}
        />
      ))}
    </Box>
  );
};

export default AppSidenav;

const NavBtn = ({
  href,
  path,
  icon,
  title,
}: {
  href: string;
  path: string;
  icon: ReactNode;
  title: string;
}) => {
  const active = href === path;
  const router = useRouter();

  let color = useColorModeValue("gray.200", "gray.600");
  if (!active) {
    color = "inherit";
  }
  const hoverBg = useColorModeValue("gray.200", "gray.600");

  return (
    <HStack
      onClick={() => router.push(href)}
      h="50px"
      w="full"
      cursor="pointer"
      px="10px"
      gap="10px"
      fontSize="xl"
      textTransform="capitalize"
      justifyContent={{ base: "center", md: "flex-start" }}
      bg={color}
      _hover={{ bg: hoverBg }}
    >
      {icon}
      <Text display={{ base: "none", md: "inline" }}>{title}</Text>
    </HStack>
  );
};
