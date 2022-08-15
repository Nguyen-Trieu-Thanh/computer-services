import React, { useMemo, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

//CSS
import "./CustomGoogleMap.css";
import { Form, ListGroup } from "react-bootstrap";

const CustomGoogleMap = () => {
  const [libraries] = useState(["places"]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="custom-google-map-container">
        <Map />
      </div>
    </>
  );
};

export default CustomGoogleMap;

const Map = () => {
  // const center = useMemo(() => ({ lat: 44, lng: -80 }), []);
  const [selected, setSelected] = useState({
    lat: 10.828248478876622,
    lng: 106.63881931796773,
  });

  return (
    <>
      <PlacesAutoComplete setSelected={setSelected} />
      <GoogleMap
        zoom={15}
        center={selected}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  );
};

const PlacesAutoComplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const result = await getGeocode({ address });
    const { lat, lng } = await getLatLng(result[0]);
    setSelected({ lat, lng });
  };

  return (
    <>
      <Form.Control
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Nhập địa chỉ..."
      />
      <ListGroup>
        {status === "OK" &&
          data.map(({ place_id, description }) => (
            <ListGroup.Item
              key={place_id}
              action
              onClick={() => {
                handleSelect(description);
              }}
            >
              {description}
            </ListGroup.Item>
          ))}
      </ListGroup>
    </>
  );
};
