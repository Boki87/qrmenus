import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import AppNav from "./AppNav";

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <Box w="full" pt="70px" overflowY="auto">
      <AppNav />
      {children}
    </Box>
  );
};

export default AppLayout;
