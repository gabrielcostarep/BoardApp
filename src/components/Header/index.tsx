import Link from 'next/link'
import styles from './styles.module.scss'

import { SignInButton } from '../SignInButton'

export function Header(){
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href='/'><img src="/images/logo.svg" alt="Logo do Board" /></Link>
        <nav>
          <Link href='/' className={styles.btn}>Home</Link>
          <Link href='/board' className={styles.btn}>Meu Board</Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}