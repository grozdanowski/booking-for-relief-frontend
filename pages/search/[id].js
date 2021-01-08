import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from 'pages/index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AccommodationInList from 'layouts/offerListLayouts/accommodation'
import TransportInList from 'layouts/offerListLayouts/transport'
import AidCollectionInList from 'layouts/offerListLayouts/aidCollection'
import AidRequestInList from 'layouts/offerListLayouts/aidRequest'


export default function HelpNeeded({ results, id, itemTags }) {

  const [filter, setFilter] = useState('');
  
  const mapItems = [];

  if (results) {
    results.forEach(item => {
      mapItems.push({
        type: 'aidRequest',
        ...item
      })
    });
  }

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);

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
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa | Pretraga</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        <LayoutWithSideMap items = {mapItems}>
          <div className={styles.introSection}>
            <h1>Rezultati pretrage po tagu "{id}"</h1>
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

export async function getServerSideProps({ params }) {
  var qs = require('qs');
  const id = params.id;
  const aidRequestQuery = qs.stringify({ _where: [{ fulfilled: false }, { _or: [ { tags_contains: params.id }, { location_contains: params.id }, { description_contains: params.id }  ] }] }, { encode: true });
  const aidRequests = await fetchQuery('aid-requests', `?${aidRequestQuery}&_limit=-1`);
  const accommodations = await fetchQuery('accommodations', `?${aidRequestQuery}&_limit=-1`);
  const transports = await fetchQuery('transports', `?${aidRequestQuery}&_limit=-1`);
  const aidCollections = await fetchQuery('aid-collections', `?${aidRequestQuery}&_limit=-1`);
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  const results = aidRequests.concat(accommodations, transports, aidCollections);
  return {
    props: {
      results,
      id,
      itemTags,
    }
  }
}