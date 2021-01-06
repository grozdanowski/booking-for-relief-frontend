import Header from 'components/header'
import styles from './mainSiteLayout.module.scss'

export default function MainSiteLayout({ filterValue, setLocationFilterFunction, itemTags = [], children }) {

  return (
    <div className={styles.appLayout}>
      <section className={styles.appHeader}>
        <Header itemTags = {itemTags} />
      </section>
      {children}
      <footer className={styles.appFooter}>
        Aplilkacija je work in progress i kontinuirano se radi na unaprijeđenju. Za sve probleme i upite slobodno se javite na <a href="mailto:matej@bytepanda.io">matej@bytepanda.io</a>.
      </footer>
    </div>
  )
}