import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  alertClose,
  alertConfirm,
  alertDecline,
} from "../features/modals/modal-slice";

const AppConfirmDialog = () => {
  const cancelRef = useRef(null);

  const { isOpen, message } = useAppSelector(
    (state) => state.modals.alertDialog
  );

  const dispatch = useAppDispatch();

  function onClose() {
    dispatch(alertDecline());
  }

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>CONFIRM</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{message}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={() => dispatch(alertDecline())}>
            No
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            onClick={() => dispatch(alertConfirm())}
          >
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AppConfirmDialog;
