import { SyntheticEvent, useEffect, useState } from "react";
import {
  HStack,
  Image,
  VStack,
  Button,
  Spinner,
  Center,
  Input,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Food } from "../../types/Food";

interface StoreFoodDrawerProps {
    isOpen: boolean,
    onClose: () => void
    foodData: Food | null
} 

const StoreFoodDrawer = ({isOpen, onClose, foodData}: StoreFoodDrawerProps) => {



  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={"right"}
      size={{ base: "full", md: "md" }}
    >
      <DrawerOverlay />
      <DrawerContent borderLeftRadius="md">
        <DrawerCloseButton onClick={onClose} />
        <DrawerHeader borderBottomWidth="1px">Preview</DrawerHeader>
        <DrawerBody p="0px" pb="60px" overflowY="auto">
                    {JSON.stringify(foodData)}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default StoreFoodDrawer;
