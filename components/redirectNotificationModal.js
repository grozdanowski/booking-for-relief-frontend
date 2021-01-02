import styles from './redirectNotificationModal.module.scss'
import { Clear } from '@material-ui/icons'

export default function RedirectNotificationModal({dismissFunction}) {

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalContainer}>
        <button className={styles.dismissButton} onClick={() => dismissFunction()}><Clear /></button>
        <h1 className={styles.modalTitle}>
          Obavijest
        </h1>
        <p><strong>U međuvremenu je objavljena i službena aplikacija</strong>.</p>
        <p>Klikom na gumb ispod možete otići na službenu aplikaciju, no možete nastaviti koristiti i ovu ukoliko tako preferirate.</p>
        <a className={styles.modalButton} href='https://potres2020.openit.hr'>Idi na službenu aplikaciju</a>
      </div>
    </div>
  )
}