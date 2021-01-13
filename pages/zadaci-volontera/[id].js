import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from 'pages/index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AidRequestInList from 'layouts/offerListLayouts/aidRequest'


export default function HelpNeeded({ aidRequests, id, itemTags }) {

  const [filter, setFilter] = useState('');
  
  const mapItems = [];

  if (aidRequests) {
    aidRequests.forEach(item => {
      mapItems.push({
        type: 'aidRequest',
        ...item
      })
    });
  }

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);

  let mapsUrlLocations = '';
  
  if (mapItems.length) {
    mapItems.forEach((item, index) => {
      mapsUrlLocations += `${item.locationLat},${item.locationLon}|`
    })
    mapsUrlLocations = mapsUrlLocations.slice(0, -1);
  }

  const mapsFullUrl = mapItems.length ? `https://www.google.com/maps/dir/?api=1&dir_action=navigate&waypoints=${mapsUrlLocations}&destination=${mapItems[mapItems.length-1].locationLat},${mapItems[mapItems.length-1].locationLon}` : '#';
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa | Zadaci volontera</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        <LayoutWithSideMap items = {mapItems}>
          <div className={styles.introSection}>
            <h1>Zadaci volontera</h1>
            <p><strong>{id}</strong></p>
            <br />
            {(mapItems.length) ? [
              <p>Klikom na sljedeći gumb možeš otvoriti u Google Mapsima rutu sa svim destinacijama na tvojoj listi:</p>,
              <a className={styles.googleMapsButton} target='_blank' href={mapsFullUrl}>Navigiraj u Google Mapama</a>
            ] : ''}
          </div>

          {mapItems.map((item, index) => {
            return (
              <OfferingListItem key={`item-${index}`}>
                <AidRequestInList data = {item} />
              </OfferingListItem>
            )
          })}
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  var qs = require('qs');
  const id = params.id;
  const aidRequestQuery = qs.stringify({ _where: [{ fulfilled: false }, { volunteer_assigned_contains: params.id }] }, { encode: true });
  const aidRequests = await fetchQuery('aid-requests', `?${aidRequestQuery}&_limit=-1`);
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  return {
    props: {
      aidRequests,
      id,
      itemTags,
    }
  }
}