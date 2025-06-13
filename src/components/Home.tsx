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
    OrderedList,
} from "@chakra-ui/react"
import { List } from "@chakra-ui/react"
import { Card } from '@components/design/Card'
import { searchSchoolDistricts, searchSchools, NCESDistrictFeatureAttributes, NCESSchoolFeatureAttributes } from "@utils/nces"


const Home: React.FC = () => {

    const [districtQuery, setDistrictQuery] = useState<string>("");

    const [districts, setDistricts] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
    const [districtError, setDistrictError] = useState<string | null>(null);

    const [schoolSearch, setSchoolSearch] = React.useState<NCESSchoolFeatureAttributes[]>([]);
    const [searching, setSearching] = React.useState(false)

    useEffect(() => {
        // Clear results if query is empty
        if (!districtQuery) {
            setDistricts([]);
            setDistrictError(null);
            setLoadingDistricts(false);
            return;
        }

        let canceled = false;
        setLoadingDistricts(true);
        setDistrictError(null);

        const loadDistricts = async () => {
            try {
                const results = await searchSchoolDistricts(districtQuery);
                if (!canceled) {
                    setDistricts(results);
                }
            } catch (err: any) {
                if (!canceled) {
                    setDistrictError(err.message || "Failed to load districts");
                }
            } finally {
                if (!canceled) {
                    setLoadingDistricts(false);
                }
            }
        };

        loadDistricts();

        // Cleanup if query changes mid-request
        return () => {
            canceled = true;
        };
    }, [districtQuery]);
    
    return (
        <Center padding="100px" height="90vh">
            <ScaleFade initialScale={0.9} in={true}>
                <Card variant="rounded" borderColor="blue">
                    <Heading>School Data Finder</Heading>

                    <Divider margin={4} />

                    <Heading size="md">District Search</Heading>
                    <Input
                        placeholder="Search for a district…"
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
                                {districts.map((d) => (
                                <ListItem key={d.LEAID}>
                                    {d.NAME}
                                </ListItem>
                                ))}
                            </UnorderedList>
                        </Box>

                    <Divider margin={4} />
                </Card>
            </ScaleFade>
        </Center>
    );
};

export default Home