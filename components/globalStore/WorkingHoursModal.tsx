import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

interface WorkingHoursModalProps {
  hours: string;
  isOpen: boolean;
  onClose: () => void;
}

const WorkingHoursModal = ({
  hours,
  isOpen,
  onClose,
}: WorkingHoursModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Working Hours</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p style={{ whiteSpace: "pre-wrap" }}>{hours}</p>
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

export default WorkingHoursModal;
