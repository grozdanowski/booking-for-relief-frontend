import Head from 'next/head'
import { authenticatedFetchQuery } from 'utils/utils'
import styles from './searchResults.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import EntryInList from 'layouts/entryListLayout'
import NavigateBack from 'components/navigateBack'


export default function HelpNeeded({ results, itemTags, siteSettings, availableEntryCategories, searchTerm }) {
  
  const mapItems = results;

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pretraga | {siteSettings.site_title}</title>
        <meta name="description" content={siteSettings.site_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags} availableEntryCategories = {availableEntryCategories} siteSettings = {siteSettings}>
        <LayoutWithSideMap items = {mapItems} mapZones = {siteSettings.map_zones}>
          <div className={styles.introSection}>
            <h1>Rezultati pretrage za: "{searchTerm}"</h1>
            <br />
            <div dangerouslySetInnerHTML={{ __html: siteSettings.donor_instructions }}></div>
          </div>

          <NavigateBack />

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

export async function getServerSideProps({ params }) {
  const id = params.id;
  const results = await authenticatedFetchQuery(`data-api/search-entries/${params.id}`);
  return {
    props: {
      results: results.entries,
      itemTags: results.itemTags,
      siteSettings: results.publicSiteSettings ? results.publicSiteSettings[0] : [],
      availableEntryCategories: results.availableEntryCategories,
      searchTerm: id,
    }
  }
}