import Head from 'next/head'
import { authenticatedFetchQuery } from 'utils/utils'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import EntryInList from 'layouts/entryListLayout'
import CommentDisplay from 'components/commentDisplay'
import CommentEditor from 'components/commentEditor'
import styles from 'pages/singleEntryStyles.module.scss'
import NavigateBack from 'components/navigateBack'

export default function Entry({ entry, itemTags, siteSettings, availableEntryCategories }) {
  
  const mapItems = entry ? [ entry ] : [];

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
  
  return (
    <div>
      <Head>
        <title>{entry.title} | {siteSettings.site_title}</title>
        <meta name="description" content={siteSettings.site_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainSiteLayout itemTags = {itemTags} availableEntryCategories = {availableEntryCategories} siteSettings = {siteSettings}>
        <LayoutWithSideMap items = {mapItems} mapZones = {siteSettings.map_zones}>
          <NavigateBack />
          {mapItems.map((item, index) => {
            return (
              <OfferingListItem key={`item-${index}`}>
                <EntryInList data = {item} mapZones = {siteSettings.map_zones} />
              </OfferingListItem>
            )
          })}
          {entry.comments && (
            <div className={styles.comments}>
              <h2 className={styles.commentsTitle}>Komentari:</h2>
              {entry.comments.map((comment, index) => (
                <CommentDisplay key={`comment-${index}`} data = {comment} />
              ))}
              <CommentEditor
                parentId = {entry.id}
              />              
            </div>
          )}
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getServerSideProps({params}) {
  const results = await authenticatedFetchQuery(`data-api/entry/${params.id}`);
  return {
    props: {
      entry: results.entry,
      itemTags: results.itemTags,
      siteSettings: results.publicSiteSettings ? results.publicSiteSettings[0] : [],
      availableEntryCategories: results.availableEntryCategories,
    }
  }
}