import Head from 'next/head'
import { authenticatedFetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './category.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import EntryInList from 'layouts/entryListLayout'
import RedirectNotificationModal from 'components/redirectNotificationModal'

export default function Home({ pageContent, itemTags, siteSettings, availableEntryCategories, currentSlug }) {

  const [notificationModalActive, setNotificationModalActive] = useState(false)
  
  return (
    <div className={styles.container}>
      <Head>
        <title>{pageContent.page_title} | {siteSettings.site_title}</title>
        <meta name="description" content={pageContent.page_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags} availableEntryCategories = {availableEntryCategories} siteSettings = {siteSettings}>
        {notificationModalActive && (
          <RedirectNotificationModal dismissFunction={() => setNotificationModalActive(false)} />
        )}

        <LayoutWithSideMap items = {[]} mapZones = {siteSettings.map_zones}>
          <div className={styles.introSection}>
            <h1>{pageContent.page_title}</h1>
          </div>
          {pageContent.page_content}
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getStaticPaths() {
  const results = await authenticatedFetchQuery('data-api/static-pages-list');
  const paths = results.pages.map((page) => {
    return {
      params: {
        slug: page.page_slug
      }
    }
  })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({params}) {
  const results = await authenticatedFetchQuery(`data-api/static-page/${params.slug}`);
  const currentSlug = params.slug;
  return {
    props: {
      pageContent: results.page,
      itemTags: results.itemTags,
      siteSettings: results.publicSiteSettings ? results.publicSiteSettings[0] : [],
      availableEntryCategories: results.availableEntryCategories,
      currentSlug: currentSlug,
    },
    revalidate: 1,
  }
}