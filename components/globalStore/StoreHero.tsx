import {
  Center,
  Box,
  Image,
  Text,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Store } from "../../types/Store";

const StoreHero = (props: Store) => {
  const { cover, name, description, announcement } = props;

  return (
    <Box
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderTopRadius="xl"
      overflowX="hidden"
      h="300px"
      position="relative"
    >
      {announcement && (
        <Alert position="absolute" left="0px" top="0px" zIndex={11}>
          <AlertIcon />
          {announcement}
        </Alert>
      )}
      <Image
        src={cover !== "" ? cover : "/images/restaurant.jpg"}
        w="full"
        objectFit="cover"
        minW="full"
        minH="full"
        zIndex={1}
      />

      <VStack
        position="absolute"
        top="0px"
        left="0px"
        w="full"
        h="full"
        zIndex={10}
        css={{ background: "rgba(0,0,0,.6)" }}
        p="20px"
      >
        <Center mt={announcement ? "70px" : "30px"}>
          <Text
            color="whiteAlpha.900"
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
          >
            Welcome to {name}
          </Text>
        </Center>
        <Center>
          <Text color="whiteAlpha.900" textAlign="center">
            {description}
          </Text>
        </Center>
      </VStack>
    </Box>
  );
};

export default StoreHero;
