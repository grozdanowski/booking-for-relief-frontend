import Head from 'next/head'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'

export default function Terms() {
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa | Pravila privatnosti i uvjeti korištenja</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout>

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