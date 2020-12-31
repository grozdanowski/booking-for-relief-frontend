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
        <p><strong>U međuvremenu je objavljena i službena aplikacija</strong> iza koje stoji Geodetski fakultet Sveučilišta u Zagrebu, hrvatska OpenStreetMap zajednica i Open IT d.o.o. u suradnji s Hrvatskom gorskom službom spašavanja, Operativnim centrom Civilne zaštite i Državnom geodetskom upravom Republike Hrvatske pripremili su i održavaju platformu na kojoj možete zatražiti i ponuditi pomoć i informacije.</p>
        <p>Kako bi izbjegli konfuziju s objavljivanjem na više aplikacija, pozivamo Vas da koristite službenu aplikaciju. <strong>Kliknite na gumb da posjetite službenu aplikaciju.</strong></p>
        <a className={styles.modalButton} href='https://potres2020.openit.hr'>Idi na službenu aplikaciju</a>
      </div>
    </div>
  )
}