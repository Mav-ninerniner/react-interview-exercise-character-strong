import React, { useEffect, useState } from "react"
import {
    Button,
    Center,
    Heading,
    Text,
    Icon,
    Input,
    ScaleFade,
    Divider,
    Spinner,
    InputGroup, // Some Chakra components that might be usefull
    HStack,
    VStack,
    InputRightAddon,
    Box,
    ListItem,
    UnorderedList,
    Stack,
} from "@chakra-ui/react"
import { Card } from '@components/design/Card'
import { searchSchoolDistricts, searchSchools, NCESDistrictFeatureAttributes, NCESSchoolFeatureAttributes } from "@utils/nces"
import SchoolListModal from "@components/SchoolListModal";

const Home: React.FC = () => {

    const [districtQuery, setDistrictQuery] = useState<string>("");
    const [districts, setDistricts] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
    const [districtError, setDistrictError] = useState<string | null>(null);

    const [selectedDistrict, setSelectedDistrict] = useState<NCESDistrictFeatureAttributes | null>(null);
    const [schools, setSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
    const [loadingSchools, setLoadingSchools] = useState<boolean>(false);
    const [schoolError, setSchoolError] = useState<string | null>(null);

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    // Fetch Districts
    useEffect(() => {
        // Clear results if query is empty
        if (!districtQuery) {
            setDistricts([]);
            setDistrictError(null);
            setLoadingDistricts(false);
            setSelectedDistrict(null);
            return;
        }

        setLoadingDistricts(true);
        setDistrictError(null);

        const loadDistricts = async () => {
            try {
                const results = await searchSchoolDistricts(districtQuery);
                setDistricts(results);
                if(results.length === 0){
                    setDistrictError("No districts found!");
                }
            } catch (err: any) {
                setDistrictError(err.message || "Failed to load districts");
            } finally {
                setLoadingDistricts(false);
            }
        };

        loadDistricts();

    }, [districtQuery]);

    // Fetch schools when a district is selected
    useEffect(()=>{
        if (!selectedDistrict) {
            setSchools([]);
            setSchoolError(null);
            setLoadingSchools(false);
            return;
        }

        setLoadingSchools(true);
        setSchoolError(null);

        const loadSchools = async () => {
            try {
                // Empty string for school name filter—could add its own input later
                const results = await searchSchools("", selectedDistrict.LEAID);
                    setSchools(results);
                    if(results.length === 0){
                        setSchoolError("No schools found!");
                }
                } catch (err: any) {
                    setSchoolError(err.message || "Failed to load schools");
                } finally {
                    setLoadingSchools(false);
            }
        };

        loadSchools();
    }, [selectedDistrict]);

    const handleDistrictClick = (d: NCESDistrictFeatureAttributes) => {
        setSelectedDistrict(d);
        setModalOpen(true);
    };
    
    return (
        <Center padding="100px" minH="90vh" overflowY="auto">
            <ScaleFade initialScale={0.9} in={true}>
                <Card variant="rounded" borderColor="blue">
                    <Heading>School Data Finder</Heading>

                    <Divider margin={4} />

                    <Heading size="md">District Search</Heading>
                    
                    <Input
                        placeholder="Search for a school district …"
                        value={districtQuery}
                        onChange={(e) => setDistrictQuery(e.target.value)}
                        mb={4}
                    />

                        {loadingDistricts && <Spinner mb={2} />}

                        {districtError && (
                        <Text color="red.500" mb={2}>
                            {districtError}
                        </Text>
                        )}

                        <Box maxH="300px" overflowY="auto" mb={4}>
                            <UnorderedList spacing={2}>
                                {districts.map((d: NCESDistrictFeatureAttributes) => (
                                <ListItem 
                                    key={d.LEAID}
                                    cursor="pointer"
                                    fontWeight={selectedDistrict?.LEAID === d.LEAID ? "bold" : "normal"}
                                    onClick={() => handleDistrictClick(d)}
                                >
                                    {d.NAME}
                                </ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                        
                </Card>
            </ScaleFade>
            {/* School List Modal */}
            {selectedDistrict && (
                <SchoolListModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    districtName={selectedDistrict.NAME}
                    schools={schools}
                    loading={loadingSchools}
                    error={schoolError}
                />
            )}
        </Center>
    );
};

export default Home