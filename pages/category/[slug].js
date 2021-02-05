import Head from 'next/head'
import { authenticatedFetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './category.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import EntryInList from 'layouts/entryListLayout'
import RedirectNotificationModal from 'components/redirectNotificationModal'

export default function Home({ entries, itemTags, siteSettings, availableEntryCategories, currentSlug }) {

  const [notificationModalActive, setNotificationModalActive] = useState(false)
  
  const mapItems = entries;

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);

  const currentCategoryObject = availableEntryCategories.find(category => {
    return category.type_slug === currentSlug
  })
  
  return (
    <div className={styles.container}>
      <Head>
        <title>{currentCategoryObject.plural_title} | {siteSettings.site_title}</title>
        <meta name="description" content={siteSettings.site_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags} availableEntryCategories = {availableEntryCategories} siteSettings = {siteSettings}>
        {notificationModalActive && (
          <RedirectNotificationModal dismissFunction={() => setNotificationModalActive(false)} />
        )}

        <LayoutWithSideMap items = {mapItems} mapZones = {siteSettings.map_zones}>
          <div className={styles.introSection}>
            <h1>{currentCategoryObject.plural_title}</h1>
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

export async function getStaticPaths() {
  const results = await authenticatedFetchQuery('data-api/available-categories');
  const paths = results.availableEntryCategories.map((category) => {
    return {
      params: {
        slug: category.type_slug
      }
    }
  })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({params}) {
  const results = await authenticatedFetchQuery(`data-api/category-entries/${params.slug}`);
  const currentSlug = params.slug;
  return {
    props: {
      entries: results.entries,
      itemTags: results.itemTags,
      siteSettings: results.publicSiteSettings ? results.publicSiteSettings[0] : [],
      availableEntryCategories: results.availableEntryCategories,
      currentSlug: currentSlug,
    },
    revalidate: 1,
  }
}