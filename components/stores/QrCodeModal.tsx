import {
  Box,
  Text,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
} from "@chakra-ui/react";
import { MdSave } from "react-icons/md";

interface QrCodeModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const QrCodeModal = ({ url, isOpen, onClose }: QrCodeModalProps) => {
  async function downloadImage() {
    const image = await fetch(url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "qrcode";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Store QR code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack alignItems="flex-end" justifyContent="center">
            <img src={url} style={{ width: "200px" }} />
            <Button onClick={downloadImage} colorScheme="blue">
              <MdSave />
            </Button>
          </HStack>
          <Box p="10px">
            <Text>
              Download this image for print, so your customers can scan it to view the store
              menu.
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QrCodeModal;
