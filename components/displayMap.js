import React, { useState, useEffect } from 'react'
import { GoogleMap, Marker, Polygon } from '@react-google-maps/api';
import { mapZones } from './mapZones'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import styles from './displayMap.module.scss'

export default function displayMap({ items, onMarkerClick = (type, id) => console.log(`Marker ${id} of ${type} clicked.`) }) {

  const [map, setMap] = useState(null);
  const [mapItems, setMapItems] = useState([]);
  const [legendExpanded, setLegendExpanded] = useState(true);

  useEffect( () => {
    setMapItems(items);
  }, [items])

  const mapPins = mapItems.map((item, index) => {

    if ((item.locationLat && item.locationLon)) {
      
      let markerIcon;
      const iconAssigned = item.volunteer_assigned ? '--assigned' : '';

      switch (item.type) {
        case 'accommodation':
          markerIcon = `/icons/map-marker--accommodation${iconAssigned}.svg`
          break;
        case 'transport':
          markerIcon = `/icons/map-marker--transport${iconAssigned}.svg`
          break;
        case 'aidCollection':
          markerIcon = `/icons/map-marker--aid-collection${iconAssigned}.svg`
          break;
        case 'aidRequest':
          markerIcon = `/icons/map-marker--help-needed${iconAssigned}.svg`
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

  const zonePolygons = mapZones.map((zone, index) => {

    return (
      <Polygon
        key={`mapZone-${index}`}
        path={zone.polygon}
        options={{
          fillColor: zone.color,
          fillOpacity: 0.3,
          strokeColor: zone.color,
          strokeOpacity: 0.4,
          strokeWeight: 0.25,
        }}
      />
    )
  })

  const mapLegendZones = mapZones.map((zone, index) => {

    return (
      <div key={`legendZone-${index}`} className={styles.singleZone}>
        <span className={styles.zoneColorSquare} style={{ backgroundColor: zone.color }}></span>
        <span className={styles.zoneName}>{zone.name}</span>
      </div>
    )
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

    if (items.length === 1)  {
      const offset = 0.008;     
      const center = mapBounds.getCenter();                            
      mapBounds.extend(new google.maps.LatLng(center.lat() + offset, center.lng() + offset));
      mapBounds.extend(new google.maps.LatLng(center.lat() - offset, center.lng() - offset));
    }

    map.fitBounds(mapBounds);
    setMap(map)
  }, [])
  
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const OPTIONS = {
    minZoom: 4,
    maxZoom: 20,
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
        {zonePolygons}
        {mapLegendZones ? (
          <div className={styles.mapLegend}>
            <button
              className={styles.legendTriggerButton}
              onClick={() => setLegendExpanded(!legendExpanded)}
            >
              {legendExpanded ? <ExpandMore className={styles.legendTriggerButtonIcon} /> : <ExpandLess className={styles.legendTriggerButtonIcon} /> }
            </button>
            {legendExpanded ? (
              mapLegendZones
            ) : (
              <span className={styles.legendLabel}>Legenda</span>
            )}
          </div>
        ) : ''}
      </GoogleMap>
    </div>
  )
}