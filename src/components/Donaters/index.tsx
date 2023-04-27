import { useState } from 'react'
import { CiCircleMore } from "react-icons/ci";

import styles from './styles.module.scss'

export function Donaters(){
  const [moreButton, setMoreButton] = useState(false)
  const [donatersArray] = useState([
    'https://sujeitoprogramador.com/steve.png',
    'https://sujeitoprogramador.com/steve.png',
    'https://sujeitoprogramador.com/steve.png',
    'https://sujeitoprogramador.com/steve.png',
    'https://sujeitoprogramador.com/steve.png',
    'https://sujeitoprogramador.com/steve.png',
  ])

  function handleClick() {
    setMoreButton(moreButton === false ? true : false)
  }

  return (
    <>
      <section className={styles.contentContainer}>
          <h2>Apoiadores:</h2>

          <div className={styles.donaters}>
            {moreButton ? (
              donatersArray.map(donater => (
                <img key={Math.random()} src={donater} alt={donater} />
            ))) : (
              donatersArray.slice(0, 5).map(donater => (
                <img key={Math.random()} src={donater} alt={donater} />
            )))}
          </div>

          {donatersArray.length > 5 ? (
          <button className={styles.moreDonaters} onClick={handleClick}>
            <CiCircleMore color='#FFB800'/>
            {moreButton ? 'Ver menos' : 'Ver mais'}
          </button>
          ) : <></>}
      </section>
    </>
  )
}