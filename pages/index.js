import Head from 'next/head'
import { authenticatedFetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import EntryInList from 'layouts/entryListLayout'
import RedirectNotificationModal from 'components/redirectNotificationModal'

export default function Home({ entries, itemTags, siteSettings, availableEntryCategories }) {

  const [notificationModalActive, setNotificationModalActive] = useState(false)
  
  const mapItems = entries;

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteSettings.site_title}</title>
        <meta name="description" content={siteSettings.site_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags} availableEntryCategories = {availableEntryCategories} siteSettings = {siteSettings}>
        {notificationModalActive && (
          <RedirectNotificationModal dismissFunction={() => setNotificationModalActive(false)} />
        )}

        <LayoutWithSideMap items = {mapItems} mapZones = {siteSettings.map_zones}>
          <div className={styles.introSection}>
            <h1>Najnoviji unosi:</h1>
            <p>Ova stranica služi kao "oglasna ploča" sa svrhom lakšeg koordiniranja pomoći žrtvama potresa koji je pogodio centralnu Hrvatsku.</p>
            <br />
            <div dangerouslySetInnerHTML={{ __html: siteSettings.donor_instructions }}></div>
          </div>

          {mapItems.map((item, index) => {
            return (
              <OfferingListItem key={`item-${index}`}>
                <EntryInList data = {item} mapZones = {siteSettings.map_zones} />
              </OfferingListItem>
            )
          })}
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getStaticProps() {
  const results = await authenticatedFetchQuery('data-api/latest-entries');
  return {
    props: {
      entries: results.entries,
      itemTags: results.itemTags,
      siteSettings: results.publicSiteSettings ? results.publicSiteSettings[0] : [],
      availableEntryCategories: results.availableEntryCategories,
    },
    revalidate: 1,
  }
}