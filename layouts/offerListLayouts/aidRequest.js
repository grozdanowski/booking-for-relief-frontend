import styles from './listItemStyles.module.scss'
import { useState } from 'react'
import Moment from 'react-moment'
import { DateRange, Comment, DirectionsRun } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField'
import { patchEntry } from 'utils/utils'
import Router from 'next/router'
import Link from 'next/link'
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function AidRequestInList({ data }) {

  const [ session, loading ] = useSession()

  const [markAssignmentTriggered, setMarkAssignmentTriggered] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  const handleAssignToMe = (id) => {
    data = {
      'volunteer_assigned': `${session.user.name}, ${session.user.email}, ${phoneInput}`
    }
    patchEntry('aid-requests', id, data)
      .then(() => setTimeout(() => {
        Router.reload(window.location.pathname)
      }, 1500))
      .catch(error => {
        console.log('Error patching the entry :(', error)
      })
  }

  const shouldDisplayNotes = () => {
    if (session && data.volunteer_assigned) {
      return data.volunteer_assigned.includes(session.user.email)
    }
  }

  const tags = data.tags ? data.tags.split(',').map((tag, index) => {
    return (
      <li key={`item-${data.id}-tag-${index}`} className={styles.tagWrapper}>
      <Link href={`/search/${tag}`}>
        <a className={styles.tagContainer}>
          {tag}
        </a>
      </Link>
    </li>
    )
  }) : []

  return (
    <div className={styles.listItemContainerAlert}>
      {markAssignmentTriggered ? (
        <div className={styles.markAsFulfilledContainer}>
          <h3>Dodijeli ovaj upit sebi</h3>
          <p>Molimo te da budeš maksimalno odgovoran/na po preuzimanju ovoga slučaja/upita. Bez unosa broja telefona ne možeš preuzeti slučaj.</p>
          <div className={styles.emailInputWrapper}>
            <TextField
              className={styles.inputField}
              label='Moj broj telefona'
              placeholder='+385900000000'
              helperText='Važno: molimo te da uneseš svoj broj kako bi te koordinatori volontera mogli kontaktirati!'
              onChange={(event) => setPhoneInput(event.target.value)}
              value={phoneInput}
              variant='outlined'
              type='phone'
              required
            />
          </div>
          <div className={styles.buttonsWrapper}>
            {(phoneInput) && (
              <button
                className={styles.submitButton}
                onClick={() => handleAssignToMe(data.id)}
              >
                Dodijeli meni!
              </button>
            )}
            <button
              className={styles.cancelButton}
              onClick={() => setMarkAssignmentTriggered(false)}
            >
              Odustani
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.itemHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.typeLabelAlert}>Tražim pomoć!</span>
              <Link href={`/trazim-pomoc/${data.id}`}><span className={styles.mainLabel}>{data.location}</span></Link>
            </div>
            <div className={styles.headerRight}>
              {(session && !data.volunteer_assigned) && (
                <button
                  className={styles.markFulfilledButton}
                  onClick={() => setMarkAssignmentTriggered(true)}
                >
                  Dodijeli sebi
                </button>
              )}
              {(data.volunteer_assigned) && (
                <div className={styles.volunteerAssignedNotice}>
                  <DirectionsRun />
                  <span>Volonter dodijeljen</span>
                </div>
              )}
            </div>
            </div>
            <Link href={`/trazim-pomoc/${data.id}`}>
              <ul className={styles.meta}>
                <li key='created-at'>
                  <i className={styles.metaIcon}>
                    <DateRange/>
                  </i>
                  <span>
                  <Moment date={data.created_at} format='DD.MM.YYYY, H:mm' />
                  </span>
                </li>
                <li>
                  <i className={styles.metaIcon}>
                    <Comment/>
                  </i>
                  <span>
                    {data.comments && data.comments.length}
                  </span>
                </li>
              </ul>
            </Link>
            <ul className={styles.tagsWrapper}>
              {tags}
            </ul>
            <div className={styles.descriptionWrapper}>
              {data.description}
            </div>
            {shouldDisplayNotes() ? (
              <div className={styles.internalNotesWrapper}>
                <span className={styles.notesTitle}>Interne napomene:</span>
                {data.notes ? data.notes : 'Nema napomene'}
              </div>
            ) : ''}
            <div className={styles.footer}>
              <span className={styles.contactName}>
                Kontakt osoba: {data.contact_name}
              </span>
              <a href={`tel:${data.contact_phone}`}>{data.contact_phone}</a>
              {data.available_on_whatsapp && (
                <span className={styles.whatsappAvailability}>
                  <img src='/icons/whatsapp-icon.svg' alt='available on WhatsApp' />
                  Dostupan/na na WhatsApp
                </span>
              )}
            </div>
        </div>
      )}
    </div>
  )
}