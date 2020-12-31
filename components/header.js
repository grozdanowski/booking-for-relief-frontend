import Link from 'next/link'
import LocationAutocomplete from 'components/locationAutocomplete'
import { useRouter } from "next/router";
import styles from './header.module.scss'

export default function Header({ filterValue = null, setLocationFilterFunction = (filter) => console.log(filter) }) {

  const router = useRouter();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.siteLogo}>
        <Link href='/'>
          <a>Booking <span>for</span> Relief</a>
        </Link>
      </div>
      <div className={styles.siteMainMenu}>
        <ul className={styles.menuItemsWrapper}>
          <li className={styles.menuItem}>
            <Link href='/smjestaj'>
              <a className={styles[(router.pathname == '/smjestaj') ? 'active' : 'inactive']}>Smještaji</a>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href='/prijevoz'>
              <a className={styles[(router.pathname == '/prijevoz') ? 'active' : 'inactive']}>Prijevozi</a>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href='/prikup-donacija'>
              <a className={styles[(router.pathname == '/prikup-donacija') ? 'active' : 'inactive']}>Prikup donacija</a>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href='/trazim-pomoc'>
              <a className={styles[(router.pathname == '/trazim-pomoc') ? 'active' : 'inactive']}><span className={styles.alert}>Tražim pomoć</span></a>
            </Link>
          </li>
        </ul>
        <Link href='/dodaj-unos'>
          <a className={styles.addButton}>Dodaj unos</a>
        </Link>
      </div>
      <div className={styles.stuffRight}>
        {(filterValue !== null) && (
          <LocationAutocomplete
            locationValue = {filterValue}
            setLocationFunction = {setLocationFilterFunction}
          />
        )}
      </div>
    </header>
  )
}