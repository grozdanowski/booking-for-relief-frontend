import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AccommodationInList from 'layouts/offerListLayouts/accommodation'
import TransportInList from 'layouts/offerListLayouts/transport'
import AidCollectionInList from 'layouts/offerListLayouts/aidCollection'
import AidRequestInList from 'layouts/offerListLayouts/aidRequest'
import RedirectNotificationModal from 'components/redirectNotificationModal'

export default function Home({ accommodations, aidCollections, transports, aidRequests, itemTags }) {

  const [notificationModalActive, setNotificationModalActive] = useState(false)
  
  const mapItems = [];
  
  if (accommodations) {
    accommodations.forEach(item => {
      mapItems.push({
        type: 'accommodation',
        ...item
      })
    });
  }

  if (aidCollections) {
    aidCollections.forEach(item => {
      mapItems.push({
        type: 'aidCollection',
        ...item
      })
    });
  }

  if (transports) {
    transports.forEach(item => {
      mapItems.push({
        type: 'transport',
        ...item
      })
    });
  }

  if (aidRequests) {
    aidRequests.forEach(item => {
      mapItems.push({
        type: 'aidRequest',
        ...item
      })
    });
  }

  const displayItem = (item) => {
    switch (item.type) {
      case 'accommodation':
        return (
          <AccommodationInList data = {item} />
        )
      case 'transport':
        return (
          <TransportInList data = {item} />
        )
      case 'aidCollection':
        return (
          <AidCollectionInList data = {item} />
        )
      case 'aidRequest':
        return (
          <AidRequestInList data = {item} />
        )
      default:
        break;
    }
  }

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        {notificationModalActive && (
          <RedirectNotificationModal dismissFunction={() => setNotificationModalActive(false)} />
        )}

        <LayoutWithSideMap items = {mapItems}>
          <div className={styles.introSection}>
            <h1>Najnoviji unosi:</h1>
            <p>Ova stranica služi kao "oglasna ploča" sa svrhom lakšeg koordiniranja pomoći žrtvama potresa koji je pogodio centralnu Hrvatsku.</p>
            <p>Ispod možete pronaći najnovije unose iz kategorija ponude <strong>prijevoza</strong>, <strong>ponude smještaja</strong>, <strong>lokacija za prikupljanje pomoći</strong>, kao i lokacija gdje je <strong>potrebna pomoć</strong>. Iste možete pronaći i na karti.</p>
            <p className={styles.noticeText}>Napomena: Molimo da unose koje ste kreirali, a u međuvremenu su ispunjeni, označite kao "<strong>Ispunjeno</strong>" kako bi zadržali preglednost sustava. Hvala.</p>
          </div>

          {mapItems.map((item, index) => {
            return (
              <OfferingListItem key={`item-${index}`}>
                {displayItem(item)}
              </OfferingListItem>
            )
          })}
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getServerSideProps() {
  var qs = require('qs');
  var now = new Date().toISOString();
  const query = qs.stringify({ _where: [{ _or: [{ enddate_gte: now }, { enddate_null: true }] }, { fulfilled: false }] }, { encode: true });
  const aidRequestQuery = qs.stringify({ _where: [{ fulfilled: false }] }, { encode: true });
  const accommodations = await fetchQuery('accommodations', `?_sort=created_at:desc&${aidRequestQuery}&_limit=20`);
  const aidCollections = await fetchQuery('aid-collections', `?_sort=created_at:desc&${aidRequestQuery}&_limit=20`);
  const transports = await fetchQuery('transports', `?_sort=created_at:desc&${aidRequestQuery}&_limit=20`);
  const aidRequests = await fetchQuery('aid-requests', `?_sort=created_at:desc&${aidRequestQuery}&_limit=20`);
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  return {
    props: {
      accommodations,
      aidCollections,
      transports,
      aidRequests,
      itemTags,
    }
  }
}