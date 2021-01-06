import styles from './listItemStyles.module.scss'
import { useState } from 'react'
import Moment from 'react-moment'
import TextField from '@material-ui/core/TextField'
import { Face, ChildCare, Pets, DateRange, Comment } from '@material-ui/icons'
import { markEntryAsFulfilled } from 'utils/utils'
import Router from 'next/router'
import Link from 'next/link'
import React from 'react'
import Chip from '@material-ui/core/Chip'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function AccommodationInList({ data }) {

  const [ session, loading ] = useSession()

  const [markFulfilledTriggered, setMarkFulfilledTriggered] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleMarkAsFulfilled = (id) => {
    markEntryAsFulfilled('accommodations', id)
      .then(response => {
        Router.reload(window.location.pathname);
      })
      .catch(error => {
        console.log('Error marking entry as fulfilled :(', error)
      })
  }

  const tags = data.tags ? data.tags.split(',').map((tag, index) => {
    return (
      <li key={`item-${data.id}-tag-${index}`} className={styles.tagWrapper}>
      <Link href={`/search/${tag}`}>
        <Chip label={tag} />
      </Link>
    </li>
    )
  }) : []

  return (
    <div className={styles.listItemContainer}>
      {markFulfilledTriggered ? (        
        <div className={styles.markAsFulfilledContainer}>
          <p>Kako bi osigurali što bolju preglednost sustava, omogućili smo uklanjanje ispunjenih unosa. Kako bi unos označili kao ispunjen, unesite mail adresu koju ste unijeli pri kreiranju. Ukoliko je mail adresa ispravna, prikazati će se gumb za potvrdu.</p>
          <div className={styles.emailInputWrapper}>
            <TextField
              className={styles.inputField}
              label='Kontakt mail adresa'
              placeholder='moj@email.hr'
              helperText='Važno: mail adresa koju ste unijeli pri kreiranju unosa'
              onChange={(event) => setEmailInput(event.target.value)}
              value={emailInput}
              variant='outlined'
              type='email'
              required
            />
          </div>
          <div className={styles.buttonsWrapper}>
            {(emailInput === data.submitter_email) && (
              <button
                className={styles.submitButton}
                onClick={() => handleMarkAsFulfilled(data.id)}
              >
                Označi kao ispunjeno
              </button>
            )}
            <button
              className={styles.cancelButton}
              onClick={() => setMarkFulfilledTriggered(false)}
            >
              Odustani
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.itemHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.typeLabel}>NP{data.id} - Smještaj / pomoć</span>
              <Link href={`/smjestaj/${data.id}`}><span className={styles.mainLabel}>{data.location}</span></Link>
            </div>
            <div className={styles.headerRight}>

            </div>
          </div>
          <Link href={`/smjestaj/${data.id}`}>
            <ul className={styles.meta}>
              <li key='number-adults'>
                <i className={styles.metaIcon}>
                  <Face className={styles.metaIconInner} />
                </i>
                <span>
                  {data.number_of_adults}
                </span>
              </li>
              {data.number_of_children && (
                <li key='number-kids'>
                  <i className={styles.metaIcon}>
                    <ChildCare className={styles.metaIconInner}/>
                  </i>
                  <span>
                    {data.number_of_children}
                  </span>
                </li>
              )}
              <li>
                <i className={styles.metaIcon}>
                  <Pets className={styles.metaIconInner}/>
                </i>
                <span>
                  {data.pets_allowed ? 'Da' : '-'}
                </span>
              </li>
              <li>
                <i className={styles.metaIcon}>
                  <DateRange className={styles.metaIconInner}/>
                </i>
                <span>
                  {data.startdate ? <Moment date={data.startdate} format='DD.MM.YYYY' /> : '-'} - {data.enddate ? <Moment date={data.enddate} format='DD.MM.YYYY' /> : '-'}
                </span>
              </li>
              <li>
                <i className={styles.metaIcon}>
                  <Comment className={styles.metaIconInner}/>
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
          <div className={styles.footer}>
            <span className={styles.contactName}>
              {data.contact_name}
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