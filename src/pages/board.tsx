import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

import { useState, FormEvent } from 'react'
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock} from 'react-icons/fi'

import styles from '../styles/board.module.scss'

import { SupportButton } from '../components/SupportButton'

import { db } from '@/services/firebaseConnection'
import { collection, addDoc } from 'firebase/firestore'
import { format } from 'date-fns'

interface BoardProps {
  user: {
    name: string;
    id: string;
  }
}

export default function Board({ user }: BoardProps){
  const [input, setInput] = useState('')
  const [taskList, setTaskList] = useState([])

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if(!input) {
      alert('Preencha com alguma tarefa!')
      return
    }

    await addDoc(collection(db, "tarefas"), {
      created: new Date(),
      tarefa: input,
      userId: user.id,
      name: user.name
    })
    .then ((doc) => {
      let data = {
        id: doc.id,
        created: new Date(),
        createdFormated: format(new Date(), 'dd MMMM yyyy'),
        tarefa: input,
        userId: user.id,
        name: user.name
      };

      // ajeitar essa tipagem

      setTaskList([...taskList, data]);
      setInput('')
    }) 
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>

      <main className={styles.container}>
        <section className={styles.containerContent}>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder='Digite sua tarefa.'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
              <button type="submit">
                <FiPlus size={25} color='#17181f'/>
              </button>
          </form>

          <h1>Você tem 2 tarefas!</h1>

          <section>
            <article className={styles.taskList}>
              <p>Aprender criar projetos usando Next JS e aplicando firebase como back.</p>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color='#ffb800'/>
                    <time>24 Abril 2023</time>
                  </div>
                  <button>
                    <FiEdit2 size={20} color='#fff'/>
                    <span>Editar</span>
                  </button>
                </div>

                <button>
                  <FiTrash size={20} color='#ff3636'/>
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          </section>
        </section>

        <article className={styles.vipContainer}>
          <h3>Obrigado por apoiar esse prejeto.</h3>
          <div>
            <FiClock size={28} color='#fff'/>
            <time>
              Última doação foi a 3 dias.
            </time>
          </div>
        </article>
      </main>

      <SupportButton />
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
    name: session?.session?.user?.name,
    id: session?.session?.user?.email,
  }

  return {
    props: {
      user
    }
  }
}