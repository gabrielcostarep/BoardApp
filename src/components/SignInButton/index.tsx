import { signIn, signOut, useSession } from 'next-auth/react'

import styles from './styles.module.scss'
import { FaGithub} from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import Image from 'next/image'

export function SignInButton(){
  const {data: session, status} = useSession()

  if (status === 'authenticated') {
      return (
      <button type='button'className={styles.SignInButton}>
        <Image src={session.session.user.image ?? "/images/logo.svg"} alt="Foto do usuario" width={35} height={35}/>
        Olá {session.session.user.name ?? "Usuario"}
        <FiX color='#737380' className={styles.closeIcon} onClick={() => signOut()}/>
      </button>
      )
    }
  
  return (
    <button
      type='button'
      className={styles.SignInButton}
      onClick={() => signIn('github')}
    >
      <FaGithub color='#FFB800'/>
      <span>Entrar com github</span>
    </button>
  )
}