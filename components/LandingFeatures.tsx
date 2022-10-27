import {
  AspectRatio,
  Center,
  Text,
  Box,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import AppContainer from "./Container";
import AnimatedSection from "./AnimatedSection";
import LandingPageHowtoSection from "./landingPage/LandingPageHowtoSection";

const howtos = [
  {
    image: "images/preview/qrmenus3.jpg",
    h1: "Manage all of your Stores",
    listItems: [
      "Create stores",
      "Update store details",
      "Delete stores",
      "Upload store cover image",
      "etc",
    ],
    direction: "row",
  },
  {
    image: "images/preview/qrmenus4.jpg",
    h1: "Create and manage food categories",
    text: "Reorder & set title for each",
    direction: "row-reverse",
  },
  {
    image: "images/preview/qrmenus5.jpg",
    h1: "Add foods to your categories",
    listItems: [
      "Edit food details",
      "Set name",
      "Upload image",
      "Set to be featured on your menu",
      "Remove from menu temporary by by toggling the 'is live' toggle",
    ],
    direction: "row",
  },
  {
    image: "images/preview/qrmenus6.jpg",
    h1: "Preview your menu at any time",
    direction: "row-reverse",
  },
  {
    image: "images/preview/qrmenus7.jpg",
    h1: "View the QRCode image",
    text: "Download the image for print, so customers can scan and view your beautifull digital menu 👏",
    direction: "row",
  },
  {
    image: "images/preview/qrcode.png",
    imageContain: true,
    h1: "Give it a go",
    text: "Open up your mobile camera and just point at the QRCode",
    direction: "row-reverse",
  },
];

const LandingFeatures = () => {
  const titleColor = useColorModeValue("gray.600", "white");
  return (
    <Box bg={useColorModeValue("gray.100", "gray.700")} py="50px">
      <AppContainer>
        <AnimatedSection animateOnScroll={true}>
          <Center mb="40px">
            <AnimatedSection>
                <Text
                  id="howitworks"
                  as="h3"
                  fontSize="4xl"
                  fontWeight="bold"
                  color={titleColor}
                >
                  How it works
                </Text>
            </AnimatedSection>
          </Center>
        </AnimatedSection>
        {howtos.map((howto) => (
          <LandingPageHowtoSection
            image={howto.image}
            imageContain={howto.imageContain}
            h1={howto.h1}
            listItems={howto.listItems}
            text={howto.text}
            direction={
              howto.direction && howto.direction === "row"
                ? "row"
                : "row-reverse"
            }
            key={howto.h1}
          />
        ))}
      </AppContainer>
    </Box>
  );
};

export default LandingFeatures;
