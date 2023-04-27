import { GetStaticProps } from 'next'
import Head from 'next/head'
import { Donaters } from '../components/Donaters'

import styles from '../styles/index.module.scss'

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>

      <main className={styles.contentContainer}>
        <img className={styles.img} src="/images/board-user.svg" alt="ferramenta board" />

        <section className={styles.callToAction}>
          <h1>Escreva, planeje e organize-se...</h1>
          <p>
            <span>100% Gratuito</span> e online
          </p>
        </section>

        <Donaters />
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