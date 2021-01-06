import Head from 'next/head'
import { fetchQuery } from 'utils/potres2020utils'
import { useState } from 'react'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AidRequestInList from 'layouts/offerListLayouts/aidRequestFromPotres2020'

export default function Entry({ aidRequests, itemTags }) {

  const [filter, setFilter] = useState('');
  
  const transposedAidRequests = [];

  const findLatLonData = (values, requestedValue) => {
    let value = null;
    Object.keys(values).forEach((key) => {
      if ((Array.isArray(values[key])) && (values[key][0][requestedValue])) {
        value = values[key][0][requestedValue];
      }
    })
    return value;
  }

  aidRequests.map((item, index) => {
    transposedAidRequests.push({
      id: item.id,
      type: 'aidRequest',
      locationLat: findLatLonData(item.values, 'lat'),
      locationLon: findLatLonData(item.values, 'lon'),
      location: item.title,
      description: item.content,
      additionalContent: item.values['3c8441b3-5744-48bb-9d9e-d6ec4be50613'],
      contact_phone: item.values['4583d2a1-331a-4da2-86df-3391e152198e'],
      contact_name: item.values['1328cf24-09de-44cd-b159-6242e6165530'],
      originalUrl: item.url,
      created_at: item.created,
    })
  })

  console.log('Transposed:',transposedAidRequests);

  // mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);

  
  return (
    <div>
      <Head>
        <title>Pomoć žrtvama potresa | Apeli za pomoć</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        <LayoutWithSideMap items = {transposedAidRequests} onMarkerClick = {(type, id) => console.log(type, id)}>
          {transposedAidRequests.map((item, index) => {
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
  const postIds = params.id.split('&');
  const anAsyncFunction = async (postId) => { return  fetchQuery('posts', `/${postId}`)};
  const getData = async() => {
    return Promise.all(postIds.map(postId => anAsyncFunction(postId)))
  }
  const aidRequests = await getData();
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  return {
    props: {
      aidRequests,
      itemTags,
    }
  }
}