import { Box, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";
import AppNav from "./AppNav";
import AppSidenav from './AppSidenav'

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <Box w="full" h="full" display="flex" pt="60px">
      <AppNav />
      <AppSidenav />
        <Box flex="1" bg={useColorModeValue('white', 'gray.800')} overflowY="auto">
            {children}
        </Box>
    </Box>
  );
};

export default AppLayout;
