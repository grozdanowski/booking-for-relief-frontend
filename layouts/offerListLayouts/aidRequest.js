import styles from './listItemStyles.module.scss'
import { useState } from 'react'
import Moment from 'react-moment'
import { DateRange, Comment, DirectionsRun, NetworkCellOutlined } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { patchEntry } from 'utils/utils'
import Router from 'next/router'
import Link from 'next/link'
import React from 'react'
import Chip from '@material-ui/core/Chip'
import { signIn, signOut, useSession } from 'next-auth/client'
import ZoneMarker from 'components/zoneMarker'
import { emitVolunteerAssigned, emitVolunteerMarkedTaskDone } from 'utils/integromatUtils'
import { doPhoneNumberLookup } from 'utils/infobipApiUtils'

const statusRender = (status) => {
  switch (status) {
    case 'provjereno':
      return 'Novo'
    case 'rizicno_opasno':
      return 'Novo'
    case 'preuzeto':
      return 'Preuzeto'
    case 'u_izvrsavanju':
      return 'Preuzeto'
    case 'parcijalno_rijeseno':
      return 'Parcijalno riješeno'
    case 'treba_ponoviti':
      return 'Treba ponoviti'
    case 'zavrseno':
      return 'Završeno'
    default:
      return 'Novo'
  }
}

export default function AidRequestInList({ data }) {

  const [ session, loading ] = useSession()

  const [modalViewTriggered, setModalViewTriggered] = useState(false);
  const [modalContent, setModalContent] = useState('assignSelf');
  const [phoneInput, setPhoneInput] = useState('');
  const [resolvedComment, setResolvedComment] = useState('');
  const [numberIsValid, setNumberIsValid] = useState(null);

  const handleTriggerAssignModal = () => {
    setModalContent('assignSelf');
    setModalViewTriggered(true);
  }

  const handleTriggerUnassignModal = () => {
    setModalContent('unAssignSelf');
    setModalViewTriggered(true);
  }

  const handleTriggerMarkDoneModal = () => {
    setModalContent('markDone');
    setModalViewTriggered(true);
  }

  const handleAssignToMe = (id) => {
    const newData = {
      'volunteer_assigned': `${session.user.name}, ${session.user.email}, ${phoneInput}`
    }
    const integromatData = {
      id: data.id,
      event: 'Volonter se assignao!',
      location: data.location,
      itemUrl: `https://potres.app/aid-requests/${data.id}`,
      potres2020Url: data.original_app_id ? `https://potres2020.openit.hr/posts/${data.id}` : '-',
      volunteerName: session.user.name,
      volunteerEmail: session.user.email,
      volunteerPhone: phoneInput,
    }
    patchEntry('aid-requests', id, newData)
      .then(() => setTimeout(() => {
        // emit event to Integromat
        emitVolunteerAssigned(integromatData)
          .then(() => Router.reload(window.location.pathname))
      }, 1000))
      .catch(error => {
        console.log('Error patching the entry :(', error)
      })
  }

  const handleUnassignMe = (id) => {
    const newData = {
      'volunteer_assigned': ''
    }
    const integromatData = {
      id: data.id,
      event: 'Volonter se unassignao!',
      location: data.location,
      itemUrl: `https://potres.app/aid-requests/${data.id}`,
      potres2020Url: data.original_app_id ? `https://potres2020.openit.hr/posts/${data.id}` : '-',
      volunteerName: session.user.name,
      volunteerEmail: session.user.email,
      volunteerPhone: phoneInput,
    }
    patchEntry('aid-requests', id, newData)
      .then(() => setTimeout(() => {
        // emit event to Integromat
        emitVolunteerAssigned(integromatData)
          .then(() => Router.reload(window.location.pathname))
      }, 1000))
      .catch(error => {
        console.log('Error patching the entry :(', error)
      })
  }

  const handleMarkAsDone = (id) => {
    const currentTime = new Date().toLocaleString();
    const newData = {
      'notes': `${data.notes} \n ${currentTime} Volonter ${session.user.name} označio gotovim uz napomenu: \n ${resolvedComment}`,
      'volunteerMarkedAsDone': true,
    }
    const integromatData = {
      id: data.id,
      event: 'Volonter je označio task kao RIJEŠEN',
      location: data.location,
      itemUrl: `https://potres.app/aid-requests/${data.id}`,
      potres2020Url: data.original_app_id ? `https://potres2020.openit.hr/posts/${data.id}` : '-',
      volunteerComment: resolvedComment,
      volunteerName: session.user.name,
      volunteerEmail: session.user.email,
      volunteerPhone: phoneInput,
    }
    patchEntry('aid-requests', id, newData)
      .then(() => setTimeout(() => {
        // emit event to Integromat
        emitVolunteerMarkedTaskDone(integromatData)
          .then(() => Router.reload(window.location.pathname))
      }, 1000))
      .catch(error => {
        console.log('Error patching the entry :(', error)
      })
  }

  const handlePhoneNumberInput = async(value) => {
    const transposedNumber = (value[0] === '0') ? value.substring(1) : value;
    const phoneNumberCheck = await doPhoneNumberLookup(`385${transposedNumber}`);
    if (phoneNumberCheck.results[0].status.groupName === 'DELIVERED') {
      setNumberIsValid(true)
    } else {
      setNumberIsValid(false)
    }
  }

  const modalContentRender = () => {
    switch (modalContent) {
      case 'assignSelf':
        return (
          <div className={styles.markAsFulfilledContainer}>
            <h3>Dodijeli ovaj upit sebi</h3>
            <p>Molimo te da budeš maksimalno odgovoran/na po preuzimanju ovoga slučaja/upita. Bez unosa broja telefona ne možeš preuzeti slučaj.</p>
            <div className={styles.emailInputWrapper}>
              <TextField
                className={styles.inputField}
                label='Moj broj mobitela'
                placeholder='0900000000'
                InputProps={{
                  startAdornment: <InputAdornment position="start">+385</InputAdornment>,
                }}
                helperText='OBAVEZNO: molimo te da uneseš svoj broj mobitela u formatu 09111... kako bi te koordinatori volontera mogli kontaktirati! Molimo da ne unosiš predznak zemlje. Broj (i uređaj) mora biti aktivan, te mora biti mobilni broj.'
                onChange={(event) => setPhoneInput(event.target.value)}
                onBlur={(event) => handlePhoneNumberInput(event.target.value)}
                value={phoneInput}
                variant='outlined'
                type='phone'
                required
              />
              <div>
                {(!numberIsValid && (phoneInput !== '') && (numberIsValid !== null)) ? (
                  <span className={styles.fieldValidationError}>
                    Broj telefona nije ispravan ili uređaj/broj nije aktivan. Molimo provjerite unos.
                  </span>
                ) : ''}
              </div>
            </div>
            <div className={styles.buttonsWrapper}>
              <button
                className={styles.submitButton}
                onClick={() => handleAssignToMe(data.id)}
                disabled={!(phoneInput && numberIsValid)}
              >
                Dodijeli meni!
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setModalViewTriggered(false)}
              >
                Odustani
              </button>
            </div>
          </div>
        )
      case 'unAssignSelf':
        return (
          <div className={styles.markAsFulfilledContainer}>
            <h3>Ukloni svoj assignment sa ovog zahtjeva</h3>
            <p>Ukoliko smatraš da ipak ne možeš raditi na rješavanju ovog slučaja, unatoč tome što si se već na njega dodijelio/la, ukloni se sa istoga.</p>
            <div className={styles.buttonsWrapper}>
            <button
              className={styles.submitButton}
              onClick={() => handleUnassignMe(data.id)}
            >
              Ukloni assignment
            </button>
              <button
                className={styles.cancelButton}
                onClick={() => setModalViewTriggered(false)}
              >
                Zadrži
              </button>
            </div>
          </div>
        )
      default:
        return (
          <div className={styles.markAsFulfilledContainer}>
            <h3>Označi da je zahtjev riješen</h3>
            <p>Ukoliko si ispunio/la ovaj zahtjev, možeš predati zahtjev da ga se označi kao riješenoga. Molimo unesi i komentar.</p>
            <div>
            <TextField
              className={styles.inputField}
              label='Komentar po rješenju'
              placeholder='Komentar...'
              helperText='Molimo: opiši što je napravljeno ili bitnu napomenu'
              onChange={(event) => setResolvedComment(event.target.value)}
              value={resolvedComment}
              style={{ width: '100%' }}
              variant='outlined'
              multiline
              rows={6}
              required
            />
            </div>
            <div className={styles.buttonsWrapper}>
            <button
              className={styles.submitButton}
              onClick={() => handleMarkAsDone(data.id)}
            >
              Označi riješenim
            </button>
              <button
                className={styles.cancelButton}
                onClick={() => setModalViewTriggered(false)}
              >
                Odustani
              </button>
            </div>
          </div>
        )
    }
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
        <Chip label={tag} />
      </Link>
    </li>
    )
  }) : []

  const volunteerAssignedContent = (data.volunteer_assigned && session) ? (
    data.volunteer_assigned.includes(session.user.email) ? (
      <button
          className={styles.unAssignSelfButton}
          onClick={() => handleTriggerUnassignModal()}
        >
          Ukloni dodjelu
      </button>
    ) : (
      <div className={styles.volunteerAssignedNotice}>
        <DirectionsRun />
        <span>Volonter dodijeljen</span>
      </div>
    )
  ) : (
    <div className={styles.volunteerAssignedNotice}>
      <DirectionsRun />
      <span>Volonter dodijeljen</span>
    </div>
  )

  const markDoneButton = (data.volunteer_assigned && session) ? (
    data.volunteer_assigned.includes(session.user.email) ? (
      <button
          className={styles.markDoneButton}
          onClick={() => handleTriggerMarkDoneModal()}
          disabled={data.volunteerMarkedAsDone}
        >
          {data.volunteerMarkedAsDone ? 'Status poslan...' : 'Označi riješenim'}
      </button>
    ) : (
      null
    )
  ) : (
    null
  )

  const googleMapsUrl = (data.locationLat && data.locationLon) ? `https://www.google.com/maps/dir/?api=1&dir_action=navigate&destination=${data.locationLat},${data.locationLon}` : null;

  return (
    <div className={styles.listItemContainerAlert}>
      {modalViewTriggered ? (
        modalContentRender()
      ) : (
        <div>
          <div className={styles.itemHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.typeLabelAlert}>TP{data.id} - Tražim pomoć!</span>
              <Link href={`/trazim-pomoc/${data.id}`}><span className={styles.mainLabel}>{data.location} <ZoneMarker point={{lat: data.locationLat, lng: data.locationLon}} /></span></Link>
            </div>
            <div className={styles.headerRight}>
              {(session && !data.volunteer_assigned) && (
                <button
                  className={styles.assignToSelfButton}
                  onClick={() => handleTriggerAssignModal()}
                >
                  Dodijeli sebi
                </button>
              )}
              {(data.volunteer_assigned) && (
                volunteerAssignedContent
              )}
              {(googleMapsUrl) ? (
                <a className={styles.googleMapsButton} target='_blank' href={googleMapsUrl}>Navigiraj</a>
              ) : ''}
              { markDoneButton ? markDoneButton : '' }
            </div>
            </div>
            <Link href={`/trazim-pomoc/${data.id}`}>
              <ul className={styles.meta}>
                <li key='status'>
                  <span className={styles.statusMarker}>
                    {statusRender(data.status)}
                  </span>
                </li>
                <li key='created-at'>
                  <i className={styles.metaIcon}>
                    <DateRange className={styles.metaIconInner} />
                  </i>
                  <span>
                  <Moment date={data.created_at} format='DD.MM.YYYY, H:mm' />
                  </span>
                </li>
                <li>
                  <i className={styles.metaIcon}>
                    <Comment className={styles.metaIconInner} />
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