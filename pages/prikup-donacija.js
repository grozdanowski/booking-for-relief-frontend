import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AidCollectionInList from 'layouts/offerListLayouts/aidCollection'


export default function AidCollections({ aidCollections, itemTags }) {

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
        <title>Pomoć žrtvama potresa | Prikupi donacija</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        <LayoutWithSideMap items = {mapItems}>
          <div className={styles.introSection}>
            <h1>Sve aktivne lokacije prikupa pomoći</h1>
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
  const query = qs.stringify({ _where: [{ fulfilled: false }] }, { encode: true });
  const aidCollections = await fetchQuery('aid-collections', `?_sort=created_at:desc&${query}&_limit=-1`);
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  return {
    props: {
      aidCollections,
      itemTags,
    }
  }
}