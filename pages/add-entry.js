import Head from 'next/head'
import styles from './newEntry.module.scss'
import { useState } from 'react'
import getConfig from 'next/config'
import { authenticatedFetchQuery, authenticatedPostQuery } from 'utils/utils'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import LocationAutocompleteNewEntry from 'components/locationAutocompleteNewEntry'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import InputAdornment from '@material-ui/core/InputAdornment'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { useRouter } from 'next/router'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { doPhoneNumberLookup } from 'utils/infobipApiUtils'

const { publicRuntimeConfig } = getConfig()

export default function NewEntry({ itemTags, siteSettings, availableEntryCategories }) {

  const [category, setCategory] = useState(null);
  const [locationInputValue, setLocationInputValue] = useState('')
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [availableOnWhatsapp, setAvailableOnWhatsapp] = useState(false);
  const [availableOnTelegram, setAvailableOnTelegram] = useState(false);
  const [locationLatitude, setlocationLatitude] = useState(null);
  const [locationLongitude, setlocationLongitude] = useState(null);
  const [dateFrom, setDateFrom] = useState();
  const [dateUntil, setDateUntil] = useState();
  const [newItemTags, setNewItemTags] = useState([]);
  const [submittingMessage, setSubmittingMessage] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [numberIsValid, setNumberIsValid] = useState(null);

  const tagChoices = itemTags.map((tag) => {return tag.tag});

  const router = useRouter();

  const handleSetLocation = (location) => {
    setLocationInputValue(location);
    setLocation(location);
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        setlocationLatitude(latLng.lat);
        setlocationLongitude(latLng.lng);
      })
      .catch(error => console.error('Error during geolocation :(', error));
  }

  const categoryOptionsRender = availableEntryCategories.map((category) => {
    return (
      <button
        key={category.type_slug}
        className={styles.typeChoiceButton}
        onClick={() => setCategory(category.id)}
      >
        {category.category_map_pin_icon ? <img src={`${publicRuntimeConfig.baseUrl}${category.category_map_pin_icon.url}`} alt={category.add_entry_label} /> : ''}
        <span className={styles.buttonLabel}>
          {category.add_entry_label}
        </span>
      </button>
    )
  })

  const phoneNumberInput = [
    <TextField
      className={styles.inputField}
      label='Broj MOBITELA kontakt osobe'
      placeholder='Broj mobitela'
      InputProps={{
        startAdornment: <InputAdornment position="start">+385</InputAdornment>,
      }}
      helperText='OBAVEZNO: broj mobitela kontakt osobe u formatu 09111... Molimo da ne unosiš predznak zemlje. Broj (i uređaj) mora biti aktivan, te mora biti mobilni broj.'
      onChange={(event) => setContactPhone(event.target.value)}
      onBlur={(event) => handlePhoneNumberInput(event.target.value)}
      value={contactPhone}
      variant='outlined'
      type='tel'
      required
    />,
    <div>
      {(!numberIsValid && (contactPhone !== '') && (numberIsValid !== null)) ? (
        <span className={styles.fieldValidationError}>
          Broj telefona nije ispravan ili uređaj/broj nije aktivan. Molimo provjerite unos.
        </span>
      ) : ''}
    </div>
  ]

  const handlePhoneNumberInput = async(value) => {
    const transposedNumber = (value[0] === '0') ? value.substring(1) : value;
    if (transposedNumber.length < 2+6) { // basic validation - to avoid calling doPhoneNumberLookup API for invalid phone numbers (saving donated resources)
      setNumberIsValid(false)
      return
    }
    const phoneNumberCheck = await doPhoneNumberLookup(`385${transposedNumber}`);
    if (phoneNumberCheck.results[0].status.groupName === 'DELIVERED') {
      setNumberIsValid(true)
    } else {
      setNumberIsValid(false)
    }
  }

  const handleSubmit = () => {
    const requiredFieldsFilled = location && title && description && contactName && numberIsValid && newItemTags.length;

    if (requiredFieldsFilled) {
      setValidationError(null);
      const data = {
        title: title,
        location: location,
        location_latitude: locationLatitude,
        location_longitude: locationLongitude,
        description: description,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: (contactPhone[0] === '0') ? `+385${contactPhone.substring(1)}` : `+385${contactPhone}`,
        contact_available_on_whatsapp: availableOnWhatsapp,
        contact_available_on_telegram: availableOnTelegram,
        done: false,
        date_from: dateFrom ? new Date(dateFrom).toISOString() : null,
        date_until: dateUntil ? new Date(dateUntil).toISOString() : null,
        entry_category: category,
        tags: newItemTags.join(', '),
      }

      setCategory('submitting');
      setSubmittingMessage('Dodajemo tvoj unos...');
      authenticatedPostQuery('data-api/add-entry', data)
        .then((res) => setTimeout(() => {
          router.push(`/`)
        }, 1500))
        .catch((error) => {
          console.error('Error publishing an entry :(', error)
          setSubmittingMessage('Problem pri dodavanju tvoj unosa. Molimo te da se obratiš administratorima.');
        });           
    } else {
      setValidationError('Molimo unesite sva obavezna polja (označena zvjezdicom *) i provjerite postoje li greške kod pojedinih polja.')
    }
  }

  const submittingContent = (
    <div className={styles.submittingMessage}>
      {submittingMessage}
    </div>
  )

  const formContent = (
    <div className={styles.newEntryForm}>
      <div className={styles.inputWrapperLocation}>
        <div className={styles.locationLabelWrapper}>
          <label className={styles.locationLabel}>Lokacija<span className={styles.requiredMarker}>*</span></label>
          <span className={styles.locationInstructions}>OBAVEZNO: Pretražite lokacije i odaberite željenu.</span>
        </div>
        <LocationAutocompleteNewEntry value={locationInputValue} setValue={setLocationInputValue} setLocationFunction={handleSetLocation} />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Ime kontakt osobe'
          placeholder='Ime osobe'
          helperText='OBAVEZNO: ime kontakt osobe'
          onChange={(event) => setContactName(event.target.value)}
          value={contactName}
          variant='outlined'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Kontakt mail adresa'
          placeholder='moj@email.hr'
          helperText='Vaša mail adresa.'
          onChange={(event) => setContactEmail(event.target.value)}
          value={contactEmail}
          variant='outlined'
          type='email'
        />
      </div>
      <div className={styles.inputWrapperFull}>
        {phoneNumberInput}
      </div>
      <div className={styles.inputWrapperHalf}>
        <FormControlLabel
          control={<Checkbox checked={availableOnWhatsapp} onChange={(event) => setAvailableOnWhatsapp(event.target.checked)} name="checkedG" />}
          label="Dostupan/na sam na WhatsApp"
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <FormControlLabel
          control={<Checkbox checked={availableOnTelegram} onChange={(event) => setAvailableOnTelegram(event.target.checked)} name="checkedG" />}
          label="Dostupan/na sam na Telegram"
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <TextField
          className={styles.inputField}
          label='Naslov'
          placeholder='Naslov'
          helperText='OBAVEZNO: naslov'
          onChange={(event) => setTitle(event.target.value)}
          value={title}
          variant='outlined'
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <TextField
          className={styles.inputField}
          label='Opis Vaše potrebe'
          placeholder='Opis...'
          helperText='OBAVEZNO: Opišite što Vam je potrebno (radna snaga, materijali, hrana, ...)'
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          variant='outlined'
          multiline
          rows={7}
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <Autocomplete
          className={styles.inputField}
          variant='outlined'
          multiple
          options={tagChoices}
          getOptionLabel={(tag) => tag}
          style={{ width: '100%' }}
          renderInput={(params) => <TextField {...params} helperText='MOLIMO: unesite bar jednu oznaku (tag) kako biste nam pomogli klasificirati vaš unos.' label="Dodaj oznake (tagove)" variant="outlined" />}
          onChange={(event, newValue) => {
            setNewItemTags(newValue);
          }}
          onClose={(event, newValue) => {
            if (!(Number.isInteger(event.target.value) || (event.target.value === ''))) {
              const tempItemTags = newItemTags;
              tempItemTags.push(event.target.value);
              setNewItemTags(tempItemTags);
            }
          }}
          freeSolo={true}
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Vrijedi od:'
          helperText='OPCIONALNO: Od kad unos vrijedi'
          onChange={(event) => setDateFrom(event.target.value)}
          value={dateFrom}
          variant='outlined'
          type='datetime-local'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Vrijedi do:'
          helperText='OPCIONALNO: Do kad unos vrijedi'
          onChange={(event) => setDateUntil(event.target.value)}
          value={dateUntil}
          variant='outlined'
          type='datetime-local'
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <button className={styles.submitButton} onClick={() => handleSubmit()}>Dodaj</button>
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Novi unos | {siteSettings.site_title}</title>
        <meta name="description" content={siteSettings.site_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags} availableEntryCategories = {availableEntryCategories} siteSettings = {siteSettings}>
        <LayoutWithSideMap items = {[]} mapZones = {siteSettings.map_zones}>
          <div className={styles.introSection}>
            <h1>Dodaj novi unos</h1>
            <p className={styles.noticeText}>Napomena: Molimo da unose koje ste kreirali, a u međuvremenu su ispunjeni, označite kao "<strong>Ispunjeno</strong>" kako bi zadržali preglednost sustava. Hvala.</p>
          </div>
          {category ? (
            <div>
              {validationError ? (
                <div className={styles.validationErrorMessage}>
                  {validationError}
                </div>
              ) : ''}
              {(category === 'submitting') ? submittingContent : formContent}
              {validationError ? (
                <div className={styles.validationErrorMessage}>
                  {validationError}
                </div>
              ) : ''}
            </div>
          ) : (
            <div className={styles.typeChoiceWrapper}>
              <h2>Odaberi tip unosa:</h2>
              <div className={styles.typeChoiceButtonsWrapper}>
                {categoryOptionsRender}
              </div>
            </div>
          )}
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getStaticProps() {
  const results = await authenticatedFetchQuery('data-api/latest-entries');
  return {
    props: {
      itemTags: results.itemTags,
      siteSettings: results.publicSiteSettings ? results.publicSiteSettings[0] : [],
      availableEntryCategories: results.availableEntryCategories,
    },
    revalidate: 1,
  }
}