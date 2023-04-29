import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

import { db } from '@/services/firebaseConnection'
import { doc, getDoc } from "firebase/firestore";

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Head from 'next/head';
import styles from './task.module.scss'
import { FiCalendar } from 'react-icons/fi'

type Task = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  name: string;
}

interface TaskListProps {
  data: string;
}

export default function Task({ data }: TaskListProps) {
  const task =  JSON.parse(data) as Task;

  return (
    <>
      <Head>
        <title>Detalhes da sua tarefa - Board</title>
      </Head>

      <main className={styles.main}>
        <article className={styles.container}>
          <section className={styles.actions}>
            <div>
              <FiCalendar size={30} color='#FFF'/>
              <span>Tarefa criada:</span>
              <time>{task.createdFormated}</time>
            </div>
          </section>
          <p>{task.tarefa}</p>
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { id } = params
  const session = await getSession({ req })

  if(!session){
    return {
      redirect: {
        destination: '/board',
        permanent: false
      }
    }
  }

  const data = await getDoc(doc(db, "tarefas", id))
  .then((snapshot) => {
    const data = {
      id: snapshot.id,
      created: snapshot.data()?.created,
      createdFormated: format(snapshot.data()?.created.toDate(), 'PPPP', {locale: ptBR}),
      tarefa: snapshot.data()?.tarefa,
      userId: snapshot.data()?.userId,
      name: snapshot.data()?.name,
    }

    return JSON.stringify(data)
  })

  return {
    props: {
      data
    }
  }
}