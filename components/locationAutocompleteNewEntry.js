import PlacesAutocomplete from 'react-places-autocomplete'
import { Search } from '@material-ui/icons'
import { useState } from 'react'
import styles from './locationAutocompleteNewEntry.module.scss'

export default function LocationAutocompleteNewEntry({ value, setValue, setLocationFunction }) {

  return (
    <PlacesAutocomplete
      value={value}
      onChange={setValue}
      onSelect={setLocationFunction}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className={styles.wrapper}>
          <input
            {...getInputProps({
              placeholder: 'Pretraži i odaberi...',
              className: styles.searchInput,
            })}
          />
          <Search className={styles.icon} />
          <div className={styles.autocompleteDropdownContainer}>
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion, index) => {
              const className = suggestion.active
                ? styles.suggestionActive
                : styles.suggestion;
              return (
                <div
                  key={`filter-suggestion-${index}`}
                  {...getSuggestionItemProps(suggestion, {
                    className
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  )
}