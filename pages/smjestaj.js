import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AccommodationInList from 'layouts/offerListLayouts/accommodation'


export default function Accommodations({ accommodations }) {

  const [filter, setFilter] = useState('');
  
  const mapItems = [];

  if (accommodations) {
    accommodations.forEach(item => {
      mapItems.push({
        type: 'accommodation',
        ...item
      })
    });
  }

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa | Smještaji i ostale ponude</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout>
        <LayoutWithSideMap items = {mapItems}>
          <div className={styles.introSection}>
            <h1>Sve ponude smještaja</h1>
          </div>

          {mapItems.map((item, index) => {
            return (
              <OfferingListItem key={`item-${index}`}>
                <AccommodationInList data = {item} />
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
  const query = qs.stringify({ _where: [{ fulfilled: false }] }, { encode: true });
  const accommodations = await fetchQuery('accommodations', `?_sort=created_at:desc&${query}&_limit=-1`);
  return {
    props: {
      accommodations,
    }
  }
}