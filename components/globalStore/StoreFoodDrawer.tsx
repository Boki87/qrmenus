import { SyntheticEvent, useEffect, useState } from "react";
import {
  Text,
  HStack,
  Image,
  VStack,
  Button,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { Food } from "../../types/Food";
import { BsClock } from "react-icons/bs";
import { RiScales2Line } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";
import { useOrderListContext } from ".";
import { supabase } from "../../api/supabase-client";

interface StoreFoodDrawerProps {
  isOpen: boolean;
  isInDevMode: boolean;
  onClose: () => void;
  foodData: Food;
}

const StoreFoodDrawer = ({
  isOpen,
  isInDevMode,
  onClose,
  foodData,
}: StoreFoodDrawerProps) => {
  const { addToOrder } = useOrderListContext();
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    async function addView() {
      if (!foodData?.id) return;
      if (isInDevMode) return;
      await supabase.from("food_stats").insert([
        {
          food_id: foodData.id,
          user_id: foodData.user_id,
        },
      ]);
    }
    addView();
  }, []);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={"right"}
      size={{ base: "full", md: "md" }}
    >
      <DrawerOverlay />
      <DrawerContent borderLeftRadius="md" color="gray.800">
        <DrawerCloseButton onClick={onClose} />
        <DrawerHeader borderBottomWidth="1px" textAlign="center">
          {foodData?.name}
        </DrawerHeader>
        <DrawerBody p="0px" pb="60px" overflowY="auto" color="gray.800">
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
            <Image
              src={
                foodData?.image !== ""
                  ? foodData?.image
                  : "/images/restaurant.jpg"
              }
              w="full"
              objectFit="cover"
              minW="full"
              minH="full"
              zIndex={1}
            />
          </Box>
          <HStack gap={2} justifyContent="center" py="10px">
            <VStack
              w="100px"
              h="80px"
              borderRadius="md"
              bg="orange.50"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="3xl">
                <BsClock />
              </Text>
              <Text noOfLines={1}>{foodData?.prep_time} min</Text>
            </VStack>
            <VStack
              w="100px"
              h="80px"
              borderRadius="md"
              bg="orange.50"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="3xl">
                <RiScales2Line />
              </Text>
              <Text noOfLines={1}>
                {foodData?.size} {foodData?.size_unit}
              </Text>
            </VStack>
            <VStack
              w="100px"
              h="80px"
              borderRadius="md"
              bg="orange.50"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="3xl">
                <GiMoneyStack />
              </Text>
              <Text noOfLines={1}>
                {foodData?.price} {foodData?.currency}
              </Text>
            </VStack>
          </HStack>

          {foodData?.description && (
            <Box p="10px">
              <Box
                borderRadius="xl"
                bg="orange.100"
                color="gray.700"
                minH="60px"
                p="10px"
              >
                <Text whiteSpace="pre-wrap">{foodData?.description}</Text>
              </Box>
            </Box>
          )}

          {foodData?.comment && (
            <Box p="10px">
              <Box
                borderRadius="xl"
                bg="orange.200"
                color="gray.700"
                minH="60px"
                p="10px"
              >
                <Text whiteSpace="pre-wrap">{foodData?.comment}</Text>
              </Box>
            </Box>
          )}

          <HStack px="10px" justifyContent="center" mb="60px">
            <NumberInput
              min={1}
              value={amount}
              onChange={(val) => setAmount(parseInt(val))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button
              onClick={() => {
                addToOrder(foodData, amount);
                onClose();
                setAmount(1);
              }}
              colorScheme="orange"
            >
              Add to order
            </Button>
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default StoreFoodDrawer;
