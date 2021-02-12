import Head from 'next/head'
import { authenticatedFetchQuery } from 'utils/utils'
import styles from './volunteerTasks.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import EntryInList from 'layouts/entryListLayout'


export default function VolunteerTasks({ results, itemTags, siteSettings, availableEntryCategories, id }) {
  
  const mapItems = results;

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);

  let mapsUrlLocations = '';
  
  if (mapItems.length) {
    mapItems.forEach((item, index) => {
      mapsUrlLocations += `${item.locationLatitude},${item.locationLongitude}|`
    })
    mapsUrlLocations = mapsUrlLocations.slice(0, -1);
  }

  const mapsFullUrl = mapItems.length ? `https://www.google.com/maps/dir/?api=1&dir_action=navigate&waypoints=${mapsUrlLocations}&destination=${mapItems[mapItems.length-1].locationLatitude},${mapItems[mapItems.length-1].locationLongitude}` : '#';
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Zadaci volontera | {siteSettings.site_title}</title>
        <meta name="description" content={siteSettings.site_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags} availableEntryCategories = {availableEntryCategories} siteSettings = {siteSettings}>
        <LayoutWithSideMap items = {mapItems} mapZones = {siteSettings.map_zones}>
          <div className={styles.introSection}>
            <h1>Zadaci volontera</h1>
            <p><strong>{id}</strong></p>
            <br />
            <div dangerouslySetInnerHTML={{ __html: siteSettings.donor_instructions }}></div>
            <br />
            {(mapItems.length) ? [
              <p>Klikom na sljedeći gumb možeš otvoriti u Google Mapsima rutu sa svim destinacijama na tvojoj listi:</p>,
              <a className={styles.googleMapsButton} target='_blank' href={mapsFullUrl}>Navigiraj u Google Mapama</a>
            ] : ''}
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

export async function getServerSideProps({ params }) {
  const id = params.id;
  const results = await authenticatedFetchQuery(`data-api/volunteer-assigned-entries/${params.id}`);
  return {
    props: {
      results: results.entries,
      itemTags: results.itemTags,
      siteSettings: results.publicSiteSettings ? results.publicSiteSettings[0] : [],
      availableEntryCategories: results.availableEntryCategories,
      id: id,
    }
  }
}