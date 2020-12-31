import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AidCollectionInList from 'layouts/offerListLayouts/aidCollection'


export default function AidCollections({ aidCollections }) {

  const [filter, setFilter] = useState('');
  
  const mapItems = [];

  if (aidCollections) {
    aidCollections.forEach(item => {
      mapItems.push({
        type: 'aidCollection',
        ...item
      })
    });
  }

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout>
        <LayoutWithSideMap items = {mapItems} onMarkerClick = {(type, id) => console.log(type, id)}>
          <div className={styles.introSection}>
            <h1>Sve aktivne lokacije prikupa pomoći</h1>
            <p className={styles.noticeText}>Napomena: Molimo da unose koje ste kreirali, a u međuvremenu su ispunjeni, označite kao "<strong>Ispunjeno</strong>" kako bi zadržali preglednost sustava. Hvala.</p>
          </div>

          {mapItems.map((item, index) => {
            return (
              <OfferingListItem key={`item-${index}`}>
                <AidCollectionInList data = {item} />
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
  const aidCollections = await fetchQuery('aid-collections', `?${query}&_limit=20`);
  return {
    props: {
      aidCollections,
    }
  }
}