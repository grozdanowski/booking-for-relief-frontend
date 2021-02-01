import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AidRequestInList from 'layouts/offerListLayouts/aidRequest'


export default function HelpNeeded({ aidRequests, itemTags }) {

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
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa | Potrebe za pomoći</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        <LayoutWithSideMap items = {mapItems}>
          <div className={styles.introSection}>
            <h1>Svi zahtjevi za pomoći</h1>
            <br />
            <strong>Upute za donatore:</strong>
            <ul>
              <li>Obavezno nazovite tražitelje pomoći za provjeru je li im u međuvremenu pružena pomoć!</li>
              <li>Ukoliko im je u međuvremenu pružena pomoć, ali to nije naznačeno u sustavu, molimo Vas da dodate tu napomenu u komentar.</li>
              <li>Ulogirajte se u aplikaciju i prebacite zahtjev na sebe ako planirate pomoći.</li>
              <li>Status zahtjeva naznačite kao "ispunjeno" nakon što je zahtjev ispunjen!</li>
            </ul>
            <br />
            <strong>Hvala na pomoći ❤️</strong>
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

export async function getServerSideProps() {
  var qs = require('qs');
  const aidRequestQuery = qs.stringify({ _where: [{ fulfilled: false }] }, { encode: true });
  const aidRequests = await fetchQuery('aid-requests', `?_sort=created_at:desc&${aidRequestQuery}&_limit=-1`);
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  return {
    props: {
      aidRequests,
      itemTags,
    }
  }
}