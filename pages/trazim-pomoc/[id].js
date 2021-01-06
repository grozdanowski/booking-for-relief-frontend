import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AidRequestInList from 'layouts/offerListLayouts/aidRequest'
import CommentDisplay from 'components/commentDisplay'
import CommentEditor from 'components/commentEditor'
import styles from 'pages/singleEntryStyles.module.scss'

export default function Entry({ aidRequests, itemTags }) {

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
    <div>
      <Head>
        <title>Pomoć žrtvama potresa | Apeli za pomoć</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        <LayoutWithSideMap items = {mapItems} onMarkerClick = {(type, id) => console.log(type, id)}>
          {mapItems.map((item, index) => {
            return (
              <OfferingListItem key={`item-${index}`}>
                <AidRequestInList data = {item} />
              </OfferingListItem>
            )
          })}
          {aidRequests[0].comments && (
            <div className={styles.comments}>
              <h2 className={styles.commentsTitle}>Komentari:</h2>
              {aidRequests[0].comments.map((comment, index) => (
                <CommentDisplay key={`comment-${index}`} data = {comment} />
              ))}
              <CommentEditor
                parentId = {aidRequests[0].id}
                parentType = 'aid-requests'
                previousComments = {aidRequests[0].comments}
              />              
            </div>
          )}
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const fetchData = await fetchQuery('aid-requests', `/${params.id}`);
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  const aidRequests = [fetchData]
  return {
    props: {
      aidRequests,
      itemTags,
    }
  }
}