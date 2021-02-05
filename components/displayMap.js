import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import { GoogleMap, Marker, Polygon, InfoBox } from '@react-google-maps/api';
import Moment from 'react-moment'
import { ExpandLess, ExpandMore, DateRange, DirectionsRun } from '@material-ui/icons'
import styles from './displayMap.module.scss'

const { publicRuntimeConfig } = getConfig()

export default function displayMap({ items, mapZones = [], onMarkerClick = (type, id) => console.log(`Marker ${id} of ${type} clicked.`) }) {

  const [map, setMap] = useState(null);
  const [mapItems, setMapItems] = useState([]);
  const [legendExpanded, setLegendExpanded] = useState(true);
  const [infoBoxVisible, setInfoBoxVisible] = useState(false);
  const [infoBoxData, setInfoBoxData] = useState(null);

  useEffect( () => {
    setMapItems(items);
  }, [items])

  const mapPins = mapItems.map((item, index) => {

    if ((item.location_latitude && item.location_longitude)) {

      if (item.entry_category.category_map_pin_icon && item.entry_category.category_map_pin_icon_assigned) {

        const markerIcon = item.volunteer_assigned ? `${publicRuntimeConfig.baseUrl}${item.entry_category.category_map_pin_icon_assigned.url}` : `${publicRuntimeConfig.baseUrl}${item.entry_category.category_map_pin_icon.url}`

        return (
          <Marker
            defaultOptions = {{mapTypeControl: false}}
            position = {{lat: item.location_latitude, lng: item.location_longitude}}
            onClick = {() => handleMarkerClick(item) }
            key = {`mapmarker-${index}`}
            icon ={{
              url: markerIcon,
              scaledSize:  new window.google.maps.Size(42, 50)
              }}
          />
        )

      } else {

        return (
          <Marker
            defaultOptions = {{mapTypeControl: false}}
            position = {{lat: item.location_latitude, lng: item.location_longitude}}
            onClick = {() => handleMarkerClick(item) }
            key = {`mapmarker-${index}`}
          />
        )

      }

    }
  })

  const zonePolygons = mapZones ? mapZones.map((zone, index) => {

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
  }) : []

  const mapLegendZones = mapZones.map((zone, index) => {

    return (
      <div key={`legendZone-${index}`} className={styles.singleZone}>
        <span className={styles.zoneColorSquare} style={{ backgroundColor: zone.color }}></span>
        <span className={styles.zoneName}>{zone.name}</span>
      </div>
    )
  })

  const handleMarkerClick = (itemData) => {
    setInfoBoxVisible(true);
    setLegendExpanded(false);
    setInfoBoxData(itemData);
  }

  const infoBoxRender = infoBoxData ? (
    <InfoBox
      position={{lat: infoBoxData.location_latitude, lng: infoBoxData.location_longitude}}
      onCloseClick={() => setInfoBoxVisible(false)}
    >
      <div className={styles.infoBoxContainer}>
        <div className={styles.infoWrapper}>
          <span className={styles.infoLocation}>
            {infoBoxData.location}
          </span>
          <div className={styles.infoMeta}>
            <div className={styles.itemDate}>
              <DateRange className={styles.metaIcon} />
              <span>
                <Moment date={infoBoxData.created_at} format='DD.MM.YYYY' />
              </span>
            </div>
            {infoBoxData.volunteer_assigned ? (
              <div className={styles.volunteerAssigned}>
                <DirectionsRun className={styles.metaIcon} />
                <span>Volonter dodijeljen</span>
              </div>
            ) : ''}
          </div>
          <div className={styles.infoDescription}>
            {(infoBoxData.description.length > 180) ? `${infoBoxData.description.substring(0, 180)}...` : infoBoxData.description}
          </div>
        </div>
        <div className={styles.boxFooter}>
          <button
            onClick={() => onMarkerClick(infoBoxData.type, infoBoxData.id)}
            className={styles.navigateButton}
          >
            Otvori detalje
          </button>
        </div>
      </div>
    </InfoBox>
  ) : '';

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
      if ((item.location_latitude && item.location_longitude)) {
        mapBounds.extend({lat: item.location_latitude, lng: item.location_longitude})
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
    streetViewControl: false,
    mapTypeControl: false,
  }

  return (
    <div>
      <GoogleMap
        key={items.length ? items[0].location_latitude : 'empty-map'}
        mapContainerStyle={containerStyle}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={OPTIONS}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        {mapPins}
        {zonePolygons}
        {infoBoxVisible ? infoBoxRender : ''}
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