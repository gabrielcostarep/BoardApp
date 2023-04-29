import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

import { useState, FormEvent } from 'react'
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX} from 'react-icons/fi'

import { db } from '@/services/firebaseConnection'
import { collection, addDoc, getDocs, query, orderBy, where, doc, deleteDoc, updateDoc } from 'firebase/firestore'

import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR';

import styles from './board.module.scss'

import { SupportButton } from '../../components/SupportButton'

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
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if(!input) {
      alert('Preencha com alguma tarefa!');
      return;
    }

    if(taskEdit) {
      await updateDoc(doc(db, "tarefas", taskEdit.id), {
        tarefa: input
      })
      .then(() => {
        let data = taskList;
        let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
        data[taskIndex].tarefa = input;

        setTaskList(data);
        setTaskEdit(null);
        setInput('');
      })

      return;
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
      setInput('');
    })
    .catch ((err) => {
      alert("Houve um erro, tente novamente mais tarde");
    })
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "tarefas", id))
    .then(() => {
      let taskDeleted = taskList.filter(item => item.id !== id);
      setTaskList(taskDeleted)
    })
    .catch((err) => {
      alert("Houve um erro, tente novamente mais tarde")
    })
  }

  function handleEditTask(task: TaskList) {
    setTaskEdit(task);
    setInput(task.tarefa);
  }

  function handleCancelEdit() {
    setTaskEdit(null);
    setInput('');
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>

      <main className={styles.container}>
        <section className={styles.containerContent}>

          {taskEdit && (
            <span className={styles.warnText}>
              <button onClick={handleCancelEdit}>
                <FiX size={30} color='#ff3636' />
              </button>
              Você está editando uma tarefa!
            </span>
          )}

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
              let dateNow;
              task.created.seconds * 1e3 + task.created.nanoseconds / 1e6
              ? dateNow = format(new Date(task.created.seconds * 1e3 + task.created.nanoseconds / 1e6), 'PPPP', {locale: ptBR})
              : dateNow = format(new Date(), 'PPPP', {locale: ptBR})

              return (
                <article className={styles.taskList} key={task.id}>
                  <Link href={`/board/${task.id}`}><p>{task.tarefa}</p></Link>
                  <div className={styles.actions}>
                    <div>
                      <div>
                        <FiCalendar size={20} color='#ffb800'/>
                        <time>{dateNow}</time>
                      </div>
                      <button onClick={() => handleEditTask(task)}>
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