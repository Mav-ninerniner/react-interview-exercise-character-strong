import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Spinner,
  Text,
  VStack,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { SchoolListModalProps } from "@utils/nces";


interface DetailItemProps {
  label: React.ReactNode;
  value: string | number | undefined;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  if (value == null) return null;
  return (
    <>
      <Text fontWeight="bold">
        {React.Children.toArray(label)}:
      </Text>
      <Text>{value.toString()}</Text>
    </>
  );
};

const SchoolListModal: React.FC<SchoolListModalProps> = ({
  isOpen,
  onClose,
  districtName,
  schools,
  loading,
  error,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");

  const selectedSchool = schools.find((s) => s.NCESSCH === selectedId);

  // Build an array of [label, value] for mapping
  const details: [string, string | number | undefined][] = selectedSchool
    ? [
        ["NCESSCH", selectedSchool.NCESSCH],
        ["LEAID", selectedSchool.LEAID],
        ["Name", selectedSchool.NAME],
        ["OPSTFIPS", selectedSchool.OPSTFIPS],
        ["Street", selectedSchool.STREET],
        ["City", selectedSchool.CITY],
        ["State", selectedSchool.STATE],
        ["ZIP", selectedSchool.ZIP],
        ["STFIP", selectedSchool.STFIP],
        ["CNTY", selectedSchool.CNTY],
        ["NMCNTY", selectedSchool.NMCNTY],
        ["Locale", selectedSchool.LOCALE],
        ["Latitude", selectedSchool.LAT],
        ["Longitude", selectedSchool.LON],
      ]
    : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="80vh" w="600px" mx="auto">
        <ModalHeader>Schools in {districtName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody px={6} overflowY="auto">
          {loading && <Spinner />}
          {error && (
            <Text color="red.500" mb={2}>
              {error}
            </Text>
          )}

          {!loading && !error && (
            <VStack spacing={4} align="stretch">
              {/* Dropdown */}
              <Select
                placeholder="Select a school…"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {schools.map((s) => (
                  <option key={s.NCESSCH} value={String(s.NCESSCH)}>
                    {s.NAME}
                  </option>
                ))}
              </Select>

              {/* Details Grid */}
              {selectedSchool && (
                <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" maxH="600px" overflowY="auto" overflowX="hidden" w="100%" pr={4}>
                  <SimpleGrid columns={2} spacing={3}>
                    {details.map(([label, value]) => (
                      <DetailItem key={label} label={label} value={value} />
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SchoolListModal;
