import React, { useState } from 'react'
import Link from 'next/link'
import Router, { useRouter } from "next/router";
import { signIn, signOut, useSession } from 'next-auth/client'
import TextField from '@material-ui/core/TextField'
import { Search, Menu, Close } from '@material-ui/icons'
import Autocomplete from '@material-ui/lab/Autocomplete'
import styles from './header.module.scss'
import classnames from 'classnames'

export default function Header({ itemTags, availableEntryCategories, siteSettings }) {

  const [ session, loading ] = useSession()
  const router = useRouter();
  
  const [searchInput, setSearchInput] = useState('');
  const [slideOutTriggered, setSlideOutTriggered] = useState(false);

  const doSearch = () => {

    if (searchInput) {
      Router.push(`/search/${searchInput}`)
    }
  }

  const availableTags = itemTags.map((tag) => { return tag.tag });

  const entryCategoriesMenuRender = availableEntryCategories.map((category) => {
    return (
      <li key={`menu-item--${category.type_slug}`} className={styles.menuItem}>
        <Link href={`/category/${category.type_slug}`}>
          <a
            style={{ color: category.category_color_hex }}
            className={styles[(router.pathname == `/category/${category.type_slug}`) ? 'active' : 'inactive']}
          >
            {category.menu_title}
          </a>
        </Link>
      </li>
    )
  })

  const headerAdditionalLinksRender = siteSettings.header_menu_marketing_items ? siteSettings.header_menu_marketing_items.map((item) => {
    return (
      <Link key={`header-additional-menu-item--${item.id}`} href={item.item_url}>
        <a className={styles[(router.pathname == item.item_url) ? 'active' : 'inactive']}>{item.item_title}</a>
      </Link>
    )
  }) : []

  return (
    <header className={styles.headerContainer}>
      <div key='logo-container' className={styles.siteLogo}>
        <Link href='/'>
          <a>potres<span>app</span></a>
        </Link>
      </div>
      <div
        key='slideout-menu'
        className={
          classnames(
            styles.slideOutMenu,
            styles[`${slideOutTriggered ? 'menuOpen' : 'menuClosed'}`],
          )
        }
      >
        <div key='main-categories-menu' className={styles.siteMainMenu}>
          <ul className={styles.menuItemsWrapper}>
            {entryCategoriesMenuRender}
            {session ? (
              <li key='menu-item--my-tasks' className={styles.menuItem}>
                <Link href={`/volunteer-tasks/${session.user.email}`}>
                  <a className={styles[(router.pathname == `/volunteer-tasks/${session.user.email}`) ? 'active' : 'inactive']}><span>Moji zadaci</span></a>
                </Link>
              </li>
            ) : (
              <li key='menu-item--potres2020-collection' className={styles.menuItem}>
                <Link href='/nova-kolekcija'>
                  <a className={styles[(router.pathname == '/nova-kolekcija') ? 'active' : 'inactive']}><span>Kreiraj iz Potres2020</span></a>
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div key='right-menu-section' className={styles.stuffRight}>

          <div className={styles.headerSearch}>
            <Autocomplete
              className={styles.searchInputField}
              options={availableTags}
              getOptionLabel={(tag) => tag}
              style={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Pretraga po tagu ili sadržaju..." variant="outlined" />}
              onChange={(event, newValue) => {
                newValue ? setSearchInput(newValue) : '';
              }}
              onInputChange={(event, newValue) => {
                setSearchInput(newValue)
              }}
              freeSolo={true}
            />
            <button className={styles.searchButton} onClick={() => doSearch()}><Search /></button>
          </div>

          <Link href='/add-entry'>
            <a className={styles.addButton}>Dodaj unos</a>
          </Link>
          <div className={styles.headerAdditionalLinks}>
            {headerAdditionalLinksRender}
          </div>
          <div className={styles.headerAuth}>
            {session ? [
              <span className={styles.signedInHello}>Bok, {session.user.name.split(' ')[0]}</span>,
              <Link href='/api/auth/signout'><a className={styles.addButton}>Sign out</a></Link>
            ] : (
              <Link href='/api/auth/signin'><a className={styles.addButton}>Login</a></Link>
            )}
          </div>
        </div>
      </div>
      <button onClick={() => setSlideOutTriggered(!slideOutTriggered)} className={styles.mobileMenuButton}>
        {slideOutTriggered ? (
          <Close />
        ) : (
          <Menu />
        )}
      </button>
    </header>
  )
}