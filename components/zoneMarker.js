import React from 'react'
import { PolyUtil } from 'node-geometry-library'
import styles from './zoneMarker.module.scss'

export default function ZoneMarker({ point, mapZones = [] }) {

  let markerColor = null;

  if (mapZones) {
    mapZones.forEach((zone, index) => {
      if (PolyUtil.containsLocation(point, zone.polygon)) {
        markerColor = zone.color;
      }
    })
  } 

  return (
    <span style={{ backgroundColor: markerColor }} className={styles.zoneMarker} />
  )
}