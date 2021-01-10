import Head from 'next/head'
import styles from './index.module.scss'
import { fetchQuery } from 'utils/utils'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'

export default function Terms({ itemTags }) {
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa | Pravila privatnosti i uvjeti korištenja</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags}>

        <LayoutWithSideMap items = {[]}>
          <div className={styles.introSection}>
            <h1>Pravila privatnosti i uvjeti korištenja</h1>
            <p>Ova aplikacija je razvijena u svrhu koordinacije volontera za potrebe odgovora na prirodnu katastrofu koja je pogodila središnju Hrvatsku.</p>
            <p>Podaci o korisnicima se ne prikupljaju, izuzev u svrhu praćenja performansi aplikacije, te dodjele određenih zadataka pojedinim volonterima.</p>
            <p>Aplikacija koristi Facebook Login sustav, no korisničke podatke ne sprema u bazu podataka.</p>
          </div>
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getServerSideProps() {
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  return {
    props: {
      itemTags,
    }
  }
}