import { useEffect, useState } from "react";
import {
  Spacer,
  Text,
  HStack,
  Image,
  VStack,
  Button,
  Center,
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
import { useOrderListContext } from ".";

const OrderListDrawer = () => {
  const { orderList, isDrawerOpen, closeDrawer, currency } =
    useOrderListContext();

  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    let cost = 0;
    orderList.forEach((item) => (cost += item.price * item.amount));
    cost = +cost.toFixed(2);
    setTotalCost(cost);
  }, [orderList]);

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      placement={"right"}
      size={{ base: "full", md: "md" }}
    >
      <DrawerOverlay />
      <DrawerContent borderLeftRadius="md">
        <DrawerCloseButton onClick={closeDrawer} />
        <DrawerHeader borderBottomWidth="1px" textAlign="center">
          Your order
        </DrawerHeader>
        <DrawerBody p="10px" pb="60px" overflowY="auto">
          <Box>
            {orderList.map((item) => (
              <OrderItem
                name={item.name}
                currency={currency}
                price={item.price}
                amount={item.amount}
              />
            ))}
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bold">
              Total: {totalCost} {currency}
            </Text>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default OrderListDrawer;

const OrderItem = ({
  name,
  price,
  currency,
  amount,
}: {
  name: string;
  price: number;
  currency?: string;
  amount: number;
}) => {
  const { changeOrder, removeFromOrder } = useOrderListContext();

  function incrementAmount() {
    changeOrder(name, 1);
  }

  function decrementAmount() {
    if (amount > 1) {
      changeOrder(name, -1);
    } else {
      removeFromOrder(name);
    }
  }

  return (
    <HStack mb="7px">
      <Text>{name}</Text>
      <Text fontWeight="bold">
        {price} {currency}
      </Text>
      <Spacer />
      <Text>x</Text>
      <NumberInput size="sm" maxW="80px" value={amount} min={0}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper onClick={incrementAmount} />
          <NumberDecrementStepper onClick={decrementAmount} />
        </NumberInputStepper>
      </NumberInput>
    </HStack>
  );
};
