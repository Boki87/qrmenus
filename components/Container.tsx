import { ReactNode } from "react";
import { Container } from "@chakra-ui/react";

interface AppContainerProps {
  children?: ReactNode;
  [x: string]: any;
}

const AppContainer = ({ children, ...props }: AppContainerProps) => {
  return (
    <Container maxW="5xl" w="full" {...props}>
      {children}
    </Container>
  );
};

export default AppContainer;
