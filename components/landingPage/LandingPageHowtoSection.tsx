import {
  HStack,
  Box,
  AspectRatio,
  Image,
  Text,
  UnorderedList,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react";
import AnimatedSection from "../AnimatedSection";

interface Props {
  image: string;
  imageContain?: boolean;
  h1: string;
  listItems?: string[];
  text?: string;
  direction: "row" | "row-reverse";
}

const LandingPageHowtoSection = ({
  image,
  h1,
  listItems,
  text,
  direction,
  imageContain = false,
}: Props) => {
  const titleColor = useColorModeValue("gray.600", "white");

  return (
    <Box
      w="full"
      flexDir={direction}
      mb="100px"
      display={{ base: "block", md: "flex" }}
    >
      <Box flex={1} mb="40px">
        <AnimatedSection animateOnScroll={true} delay={0.1}>
          <Box display="flex" justifyContent="center" h="full" w="full">
            <Box maxW="600px" w="full" h="full">
              <AspectRatio
                ratio={1100 / 767}
                overflow="hidden"
                display="flex"
                alignItems={!imageContain ? "flex-start" : "center"}
                justifyContent="center"
                borderRadius="md"
                shadow={!imageContain ? "xl" : "none"}
              >
                {!imageContain ? (
                  <Image src={image} objectFit="contain" minW="full" h="auto" />
                ) : (
                  <Box>
                    <Image
                      src={image}
                      maxW="250px"
                      maxH="250px"
                      w="250px"
                      h="250px"
                    />
                  </Box>
                )}
              </AspectRatio>
            </Box>
          </Box>
        </AnimatedSection>
      </Box>
      <Box
        flex={1}
        alignItems="center"
        display="flex"
        flexDir="column"
        minH="full"
        justifyContent="center"
      >
        <AnimatedSection animateOnScroll={true} delay={0.2}>
          <Box h="full">
            <Text fontSize="2xl" color={titleColor} mb="10px">
              {h1}
            </Text>
            <Box maxW="300px">
              <UnorderedList fontSize="xl" color={titleColor}>
                {listItems &&
                  listItems.map((item, i) => (
                    <ListItem key={`${item}-${i}`}>{item}</ListItem>
                  ))}
              </UnorderedList>
              {text && text !== "" ? (
                <Text fontSize="xl" color={titleColor}>
                  {text}
                </Text>
              ) : null}
            </Box>
          </Box>
        </AnimatedSection>
      </Box>
    </Box>
  );
};

export default LandingPageHowtoSection;
