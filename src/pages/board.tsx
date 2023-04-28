import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

import { useState, FormEvent } from 'react'
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock} from 'react-icons/fi'

import styles from '../styles/board.module.scss'

import { SupportButton } from '../components/SupportButton'

import { db } from '@/services/firebaseConnection'
import { collection, addDoc, getDocs, query, orderBy, where, doc, deleteDoc } from 'firebase/firestore'

import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR';

type TaskList = {
  id: string;
  created: string | Date;
  tarefa: string;
  userId: string;
  name: string;
}

interface BoardProps {
  user: {
    name: string;
    id: string;
  }
  data: string;
}

export default function Board({ user, data }: BoardProps){
  const [input, setInput] = useState('')
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data))

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
        tarefa: input,
        userId: user.id,
        name: user.name
      };

      setTaskList([...taskList, data]);
      setInput('')
    })
    .catch ((err) => {
      console.log('Erro ao cadastrar: ' + err)
    })
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "tarefas", id))
    .then(() => {
      console.log('Deletado com Sucesso')
      let taskDeleted = taskList.filter(item => item.id !== id);
      setTaskList(taskDeleted)
    })
    .catch((err) => {
      console.log(err)
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

          <h1>Você tem {taskList.length} {taskList.length === 1 ? 'tarefa!' : 'tarefas!'}</h1>

          <section>
            {taskList.map(task => {
              return (
                <article className={styles.taskList} key={task.id}>
                  <Link href={`/board/${task.id}`}><p>{task.tarefa}</p></Link>
                  <div className={styles.actions}>
                    <div>
                      <div>
                        <FiCalendar size={20} color='#ffb800'/>
                        <time>{format(new Date(task.created.seconds * 1e3 + task.created.nanoseconds / 1e6), 'PPPP', {locale: ptBR})}</time>
                      </div>
                      <button>
                        <FiEdit2 size={20} color='#fff'/>
                        <span>Editar</span>
                      </button>
                    </div>
    
                    <button onClick={() => handleDelete(task.id)}>
                      <FiTrash size={20} color='#ff3636'/>
                      <span>Excluir</span>
                    </button>
                  </div>
                </article>
            )})}
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

  const q = query(collection(db, "tarefas"), where("userId", "==", session?.session.user.email), orderBy('created', 'asc'));
  const tasks = await getDocs(q);
  const data: any = []

  tasks.forEach((doc) => {
    data.push({...doc.data(), id: doc.id})
  });

  const user = {
    name: session?.session.user.name,
    id: session?.session.user.email,
  }

  return {
    props: {
      user,
      data: JSON.stringify(data)
    }
  }
}