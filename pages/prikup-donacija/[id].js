import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AidRequestInList from 'layouts/offerListLayouts/aidRequest'


export default function Entry({ aidRequests }) {

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

  console.log(aidRequests)

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
  
  return (
    <div>
      <Head>
        <title>Pomoć žrtvama potresa | Apeli za pomoć</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout>
        <LayoutWithSideMap items = {mapItems} onMarkerClick = {(type, id) => console.log(type, id)}>
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
  const fetchData = await fetchQuery('aid-collections', `/${params.id}`);
  const aidRequests = [fetchData]
  return {
    props: {
      aidRequests,
    }
  }
}