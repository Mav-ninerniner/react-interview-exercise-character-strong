import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  UnorderedList,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

interface SchoolListModalProps {
  isOpen: boolean;
  onClose: () => void;
  districtName: string;
  schools: NCESSchoolFeatureAttributes[];
  loading: boolean;
  error: string | null;
}

const SchoolListModal: React.FC<SchoolListModalProps> = ({
  isOpen,
  onClose,
  districtName,
  schools,
  loading,
  error,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Schools in {districtName}</ModalHeader>
      <ModalCloseButton color="red.500" />
      <ModalBody pb={8}>
        {loading && <Spinner />}
        {error && (
          <Text color="red.500" mb={2}>
            {error}
          </Text>
        )}
        {!loading && !error && (
          <Box maxH="400px" overflowY="auto">
            <UnorderedList spacing={2}>
              {schools.map((s) => (
                <ListItem key={s.LEAID}>
                  {s.NAME}
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
        )}
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default SchoolListModal;
