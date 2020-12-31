import Header from 'components/header'
import styles from './mainSiteLayout.module.scss'

export default function MainSiteLayout({ filterValue, setLocationFilterFunction, children }) {

  return (
    <div className={styles.appLayout}>
      <section className={styles.appHeader}>
        <Header filterValue = {filterValue} setLocationFilterFunction = {setLocationFilterFunction} />
      </section>
      {children}
    </div>
  )
}