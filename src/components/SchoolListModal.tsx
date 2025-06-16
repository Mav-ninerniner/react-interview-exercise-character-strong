import React, { useState, useMemo, useEffect } from "react";
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
  SimpleGrid,
  UnorderedList,
  ListItem,
  Input,
} from "@chakra-ui/react";
import { SchoolListModalProps } from "@utils/nces";

interface DetailItemProps {
  label: string;
  value?: string | number;
}
const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  if (value == null) 
    return null;
  return (
    <>
      <Text fontWeight="bold">{label}:</Text>
      <Text>{value}</Text>
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
  const [filterQuery, setFilterQuery] = useState<string>("");

  const selectedSchool = schools.find((s) => String(s.NCESSCH) === selectedId);

  // filter schools by Name
  const filteredSchools = useMemo(() =>
      schools.filter((s) =>
        s.NAME?.toLowerCase().includes(filterQuery.toLowerCase())
      ), [schools, filterQuery]
  );

   useEffect(() => {
    if (isOpen) {
      setFilterQuery("");
      setSelectedId("");
    }
  }, [isOpen, districtName]);

  const details: [string, string | number | undefined][] = selectedSchool
    ? [
        ["Name of institution", selectedSchool.NAME],
        ["School year", selectedSchool.SCHOOLYEAR],
        ["Location Street", selectedSchool.STREET],
        ["Location City", selectedSchool.CITY],
        ["Location State", selectedSchool.STATE],
        ["Location ZIP", selectedSchool.ZIP],
        ["County Name", selectedSchool.NMCNTY],
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
              {/* 1) In-modal search box */}
              <Input
                placeholder="Filter schools…"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />

              {/* 2) School List */}
              <Box maxH="300px" overflowY="auto" mb={4} pl={4}>
                <UnorderedList spacing={2}>
                  {filteredSchools.map((s) => (
                    <ListItem
                      key={s.NCESSCH}
                      cursor="pointer"
                      px={3}
                      py={2}
                      borderRadius="md"
                      bg={
                        selectedId === String(s.NCESSCH)
                          ? "teal.100"
                          : "transparent"
                      }
                      _hover={{ bg: "teal.50" }}
                      transition="background-color 0.2s"
                      onClick={() => setSelectedId(String(s.NCESSCH))}
                    >
                      {s.NAME}
                    </ListItem>
                  ))}
                  {filteredSchools.length === 0 && (
                    <Text textAlign="center" color="gray.500">
                      No schools match “{filterQuery}”
                    </Text>
                  )}
                </UnorderedList>
              </Box>

              {/* 3) Details Grid */}
              {selectedSchool && (
                <Box
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="sm"
                  maxH="600px"
                  overflowY="auto"
                  overflowX="hidden"
                  w="100%"
                  pr={4}
                >
                  <SimpleGrid columns={2} spacing={3}>
                    {
                      details.map(([label, value]) => (
                        <DetailItem key={label} label={label} value={value} />
                      ))
                    }
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

