import { useState } from 'react'
import { authenticatedPostQuery } from 'utils/utils'
import TextField from '@material-ui/core/TextField'
import Router from 'next/router'
import styles from './commentEditor.module.scss'
import React from 'react'
import { useSession } from 'next-auth/client'


export default function CommentEditor({ parentId }) {

  const [ session, loading ] = useSession()

  const [author, setAuthor] = useState(session ? session.user.name : '');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    const data = {
      comment: {
        'author': author,
        'content': content,
      },
      entryId: parentId
    }
    authenticatedPostQuery('data-api/add-entry-comment', data)
      .then(() => setTimeout(() => {
        Router.reload(window.location.pathname)
      }, 1500))
      .catch(error => console.error('Error linking the comment :(', error));
  }


  return (
    <div className={styles.editorWrapper}>
      <span className={styles.editorTitle}>Dodaj komentar:</span>
      {submitting ? (

        <span>Spremam komentar...</span>
      ) : (
        <div>
          <div className={styles.inputWrapper}>
            <TextField
              className={styles.inputField}
              label='Ime'
              placeholder='Tvoje ime'
              helperText='Ime koje će se prikazati uz komentar'
              onChange={(event) => setAuthor(event.target.value)}
              value={author}
              variant='outlined'
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <TextField
              className={styles.inputField}
              label='Sadržaj'
              placeholder='Tvoj komentar...'
              onChange={(event) => setContent(event.target.value)}
              value={content}
              variant='outlined'
              multiline
              rows={7}
              required
            />
          </div>
          { (author && content) && (
            <div className={styles.buttonWrapper}>
              <button className={styles.submitButton} onClick={() => handleSubmit()}>Dodaj komentar</button>
            </div>
          )}
        </div>        
      )}
    </div>
  )
}