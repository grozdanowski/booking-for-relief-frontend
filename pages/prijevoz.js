import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import TransportInList from 'layouts/offerListLayouts/transport'


export default function Transports({ transports }) {

  const [filter, setFilter] = useState('');
  
  const mapItems = [];

  if (transports) {
    transports.forEach(item => {
      mapItems.push({
        type: 'transport',
        ...item
      })
    });
  }

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa | Prijevozi</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout>
        <LayoutWithSideMap items = {mapItems}>
          <div className={styles.introSection}>
            <h1>Sve ponude prijevoza</h1>
          </div>

          {mapItems.map((item, index) => {
            return (
              <OfferingListItem key={`item-${index}`}>
                <TransportInList data = {item} />
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
  const transports = await fetchQuery('transports', `?${query}&_limit=-1`);
  return {
    props: {
      transports,
    }
  }
}