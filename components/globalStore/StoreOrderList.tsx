import { useEffect, useState } from "react";
import { HStack, Text, Spacer, Button, Center } from "@chakra-ui/react";
import { useOrderListContext } from ".";

const StoreOrderList = () => {
  const { orderList, openDrawer, currency } = useOrderListContext();
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    let cost = 0;
    orderList.forEach((item) => (cost += item.price * item.amount));
    cost = +cost.toFixed(2);
    setTotalCost(cost);
  }, [orderList]);

  return (
    <>
      {orderList?.length >= 0 && (
        <Center w="full" position="absolute" bottom="0px" left="0px">
          <HStack
            onClick={openDrawer}
            bg="orange.400"
            color="white"
            h="50px"
            px="10px"
            cursor="pointer"
                        w="full"
            maxW="xl"
          >
            <Text>Your Order</Text>
            <Spacer />
            <Button
              variant="ghost"
              _hover={{ bg: "whiteAlpha.200" }}
              _active={{ bg: "whiteAlpha.400" }}
            >
              {totalCost} {currency}
            </Button>
          </HStack>
        </Center>
      )}
    </>
  );
};

export default StoreOrderList;
