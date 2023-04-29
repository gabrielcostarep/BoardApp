import { GetStaticProps } from 'next'
import Head from 'next/head'

import styles from '../styles/index.module.scss'

import Image from 'next/image'
import boardUser from '../../public/images/board-user.svg'

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>

      <main className={styles.contentContainer}>
        <Image className={styles.img} src={boardUser} alt="ferramenta board" />

        <section className={styles.callToAction}>
          <h1>Escreva, planeje e organize-se...</h1>
          <p>
            <span>100% Gratuito</span> e online
          </p>
        </section>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 60 * 60
  }
}