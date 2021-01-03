import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AidRequestInList from 'layouts/offerListLayouts/aidRequest'


export default function HelpNeeded({ aidRequests }) {

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
        <title>Pomoć žrtvama potresa | Apeli za pomoć</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout>
        <LayoutWithSideMap items = {mapItems}>
          <div className={styles.introSection}>
            <h1>Svi zahtjevi za pomoći</h1>
            <p className={styles.noticeText}>Napomena: Molimo da volonteri budu iznimno odgovorni po preuzimanju pojedinih slučajeva na sebe. Hvala!</p>
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
  const aidRequests = await fetchQuery('aid-requests', `?${aidRequestQuery}&_limit=-1`);
  return {
    props: {
      aidRequests,
    }
  }
}