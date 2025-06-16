import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "250px" };

export default function SchoolMap({lat, lng}: {lat: number; lng: number; }) {
  const rawKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  if (typeof rawKey !== "string" || rawKey === "") {
    return <Text color="red.500">Missing Google Maps API key</Text>;
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: rawKey,
  });

  if (loadError) 
    return <Box>Error loading map</Box>;
  if (!isLoaded) 
    return <Spinner />;

  const center = { lat, lng };

  return (
    <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={15}
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
    </Box>
  );
}
