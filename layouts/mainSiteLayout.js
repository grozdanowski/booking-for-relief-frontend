import Header from 'components/header'
import styles from './mainSiteLayout.module.scss'
import { Add } from '@material-ui/icons'
import Link from 'next/link'

export default function MainSiteLayout({ filterValue, setLocationFilterFunction, itemTags = [], children }) {

  return (
    <div className={styles.appLayout}>
      <section className={styles.appHeader}>
        <Header itemTags = {itemTags} />
      </section>
      {children}
      <Link href='/dodaj-unos'>
        <a className={styles['floating-action-button']}>
          <Add />
        </a>
      </Link>
      <footer className={styles.appFooter}>
        Aplilkacija je work in progress i kontinuirano se radi na unaprijeđenju. Za sve probleme i upite slobodno se javite na <a href="mailto:matej@bytepanda.io">matej@bytepanda.io</a>.
      </footer>
    </div>
  )
}