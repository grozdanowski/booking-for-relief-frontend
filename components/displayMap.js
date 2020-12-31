import React, { useState, useEffect } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api';

export default function displayMap({ items, onMarkerClick = (type, id) => console.log(`Marker ${id} of ${type} clicked.`) }) {

  const [map, setMap] = useState(null);
  const [mapItems, setMapItems] = useState([]);

  useEffect( () => {
    setMapItems(items);
  }, [items])

  const mapPins = mapItems.map((item, index) => {

    if ((item.locationLat && item.locationLon)) {
      
      let markerIcon;

      switch (item.type) {
        case 'accommodation':
          markerIcon = 'icons/map-marker--accommodation.svg'
          break;
        case 'transport':
          markerIcon = 'icons/map-marker--transport.svg'
          break;
        case 'aidCollection':
          markerIcon = 'icons/map-marker--aid-collection.svg'
          break;
        case 'aidRequest':
          markerIcon = 'icons/map-marker--help-needed.svg'
          break;
        default:
          markerIcon = null;
      }

      return (
        <Marker
          defaultOptions = {{mapTypeControl: false}}
          position = {{lat: item.locationLat, lng: item.locationLon}}
          onClick = {() => onMarkerClick(item.type, item.id) }
          key = {`mapmarker-${index}`}
          icon ={{
            url: markerIcon,
            scaledSize:  new window.google.maps.Size(42, 50)
            }}
        />
      )
    }
  })

  const containerStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  const onLoad = React.useCallback(function callback(map) {
    const mapBounds = new window.google.maps.LatLngBounds();

    items.forEach((item) => {
      if ((item.locationLat && item.locationLon)) {
        mapBounds.extend({lat: item.locationLat, lng: item.locationLon})
      }
    })

    map.fitBounds(mapBounds);
    setMap(map)
  }, [])
  
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const OPTIONS = {
    minZoom: 4,
    maxZoom: 18,
  }

  return (
    <div>
      <GoogleMap
        key={items.length ? items[0].locationLat : 'empty-map'}
        mapContainerStyle={containerStyle}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={OPTIONS}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        {mapPins}
      </GoogleMap>
    </div>
  )
}