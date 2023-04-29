import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

import styles from './donate.module.scss'
import Head from 'next/head'

interface DonateProps {
  user: {
    name: string;
    id: string;
    image: string;
  }
}

export default function Donate({ user }: DonateProps) {
  const isVip = true

  return (
    <>
      <Head>
        <title>Apoie a plataforma Board</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.container}>
          <img src="./images/rocket.svg" alt="Banner de um foguete" />

          {isVip ?
            <div className={styles.vip}>
            <img src={user.image} alt="Foto de perfil do usuario" />
            <span>Parabéns você é um novo apoiador.</span>
            </div>
            : <></>
          }
          

          <h1>Seja um apoiador deste projeto 🏆</h1>
          <h3>Contribua com apenas <span>R$ 1,00</span></h3>
          <strong>Tenha funcionalidades exclusivas, como editar e ver detalhes da sua tarefa.</strong>
        </section>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if(!session){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const user = {
    name: session?.session.user.name,
    id: session?.session.user.email,
    image: session?.session.user.image
  }

  return {
    props: {
      user
    }
  }
}