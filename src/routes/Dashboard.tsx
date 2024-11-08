import { useState, MouseEvent, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectDone, selectInProgress, selectTodos } from '../store/noteTaking/noteTaking.selectors';
import { addDone, addInProgress, addTodo, removeDone, removeInProgress, removeTodo, setDone, setInProgress, setTodos, updateDone, updateInProgress, updateTodo } from '../store/noteTaking/noteTaking.slice';
import Modal from '../components/Modal';
import { Note, NoteTypes } from '../types';
import { changeNoteType, createNote, getNotesAndDocuments, listenForDonesUpdates, listenForInProgressesUpdates, listenForTodosUpdates } from '../utils/firebase/firebase.utils';
import { selectEmail } from '../store/auth/auth.selectors';
import { getDateStringFromSeconds } from '../utils/noteTaking';

const  Dashboard = () => {
    const dispatch = useDispatch();
    const todos = useSelector(selectTodos);
    const inProgresses = useSelector(selectInProgress);
    const dones = useSelector(selectDone);
    const email = useSelector(selectEmail);
    
    const [showModal, setShowModal] = useState(false);
    const [modalValue, setModalValue] = useState<{type: NoteTypes, note: Note} | null>(null);

    const [edittingTodoIndex, setEdittingTodoIndex] = useState<number | null>(null);
    const [edittingTodo, setEdittingTodo] = useState("");
    const [newTodo, setNewTodo] = useState("");

    const [edittingInProgressIndex, setEdittingInProgressIndex] = useState<number | null>(null);
    const [edittingInProgress, setEdittingInProgress] = useState("");
    const [newInProgress, setNewInProgress] = useState("");

    const [edittingDoneIndex, setEdittingDoneIndex] = useState<number | null>(null);
    const [edittingDone, setEdittingDone] = useState("");
    const [newDone, setNewDone] = useState("");

    const [currentAdd, setCurrentAdd] = useState<"todo" | "inprogress" | "done" | "">("");
    const [isAdding, setIsAdding] = useState(false);

    const [dragTarget, setDragTarget] = useState<NoteTypes | "">("");
    
    useEffect(()=>{
        const unsubscribe = listenForTodosUpdates(dispatch, addTodo, updateTodo, removeTodo, email as string);
        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(()=>{
        const unsubscribe = listenForInProgressesUpdates(dispatch, addInProgress, updateInProgress, removeInProgress, email as string);
        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(()=>{
        const unsubscribe = listenForDonesUpdates(dispatch, addDone, updateDone, removeDone, email as string);
        return () => {
            unsubscribe();
        }
    }, []);

    const fetchTodos = async () => {
        const response = await getNotesAndDocuments('todo');
        dispatch(setTodos(response.docs.map((doc) => ({...doc.data(), 
            updatedAt: getDateStringFromSeconds(doc.data().updatedAt.seconds) , 
            createdAt: getDateStringFromSeconds(doc.data().createdAt.seconds)
        } as Note))))
    };

    useEffect(()=>{
        fetchTodos()
    }, []);

    const fetchInProgresses = async () => {
        const response = await getNotesAndDocuments('inProgress');
        dispatch(setInProgress(response.docs.map((doc) => ({...doc.data(),
            updatedAt: getDateStringFromSeconds(doc.data().updatedAt.seconds) , 
            createdAt: getDateStringFromSeconds(doc.data().createdAt.seconds)
        } as Note))))
    };
    useEffect(()=>{
        fetchInProgresses()
    }, []);

    const fetchDones = async () => {
        const response = await getNotesAndDocuments('done');
        dispatch(setDone(response.docs.map((doc) => ({...doc.data(),
            updatedAt: getDateStringFromSeconds(doc.data().updatedAt.seconds) , 
            createdAt: getDateStringFromSeconds(doc.data().createdAt.seconds)
        } as Note))))
    };
    useEffect(()=>{
        fetchDones();
    }, []);

    const addNewToDoHandler = async() => {
        if(!newTodo) return;
        setIsAdding(true);
        try{
            const response = await createNote({title: newTodo}, email as string, 'todo');
            console.log(" add Todo response: ", response)
            await fetchTodos()
            setCurrentAdd("")
            setNewTodo("");
        }catch(error){
            console.log("Error Adding a Todo: ", error)
        }
        setIsAdding(false);
    }

    const addNewInProgressHandler = async() => {
        if(newInProgress){
            setIsAdding(true);
            try{
                const response = await createNote({title: newInProgress}, email as string, 'inProgress');
                console.log(" add inProgress response: ", response)
                await fetchInProgresses()
                setCurrentAdd("")
                setNewInProgress("")
            }catch(error){
                console.log("Error Adding a InProgress: ", error)
            }
            setIsAdding(false);
        }
    }
    const addNewDoneHandler = async() => {
        if(newDone){
            setIsAdding(true);
            try{
                const response = await createNote({title: newDone}, email as string, 'done');
                console.log(" add done response: ", response)
                await fetchDones()
                setCurrentAdd("")
                setNewDone("")
            }catch(error){
                console.log("Error Adding a Done: ", error)
            }
            setIsAdding(false);
        }
        
    }

    const showModalHandler = (val: Note, type: NoteTypes) => {
        if(!val || edittingTodoIndex != null || edittingInProgressIndex != null || edittingDoneIndex != null) return;
        setModalValue({type, note: val});
        setShowModal(true);
    };

    const closeModalHandler = () => {
        setModalValue(null);
        setShowModal(false);
    }

    const editTodoHandler = (e: MouseEvent<HTMLSpanElement>, index: number, todo: string) => {
        e.stopPropagation();
        setEdittingTodoIndex(index);
        setEdittingTodo(todo);
    };

    const editInProgressHandler = (e: MouseEvent<HTMLSpanElement>, index: number, inProgress: string) => {
        e.stopPropagation();
        setEdittingInProgressIndex(index);
        setEdittingInProgress(inProgress);
    };
    
    const editDoneHandler = (e: MouseEvent<HTMLSpanElement>, index: number, done: string) => {
        e.stopPropagation();
        setEdittingDoneIndex(index);
        setEdittingDone(done);
    };

    const saveEdittingTodoHandler = () => {
        if(edittingTodo && edittingTodoIndex != null){
            dispatch(setTodos(todos.map((todo, index) => index === edittingTodoIndex ? {...todo, title: edittingTodo} : todo)));
            setEdittingTodo('');
            setEdittingTodoIndex(null);
        }
    }
    
    const saveEdittingInProgressHandler = () => {
        if(edittingInProgress && edittingInProgressIndex != null){
            dispatch(setInProgress(inProgresses.map((inProgress, index) => index === edittingInProgressIndex ? {...inProgress, title: edittingInProgress} : inProgress)));
            setEdittingInProgress('');
            setEdittingInProgressIndex(null);
        }else{
            alert(edittingInProgress)
            alert(edittingInProgressIndex)
        }
    }
    
    const saveEdittingDoneHandler = () => {
        if(edittingDone && edittingDoneIndex != null){
            dispatch(setDone(dones.map((done, index) => index === edittingDoneIndex ? {...done, title: edittingDone} : done)));
            setEdittingDone('');
            setEdittingDoneIndex(null);
        }
    }

    const onDragEnterHandler = (target: NoteTypes) => {
        setDragTarget(target)
        // setDragSource(target)
    };

    const onDropHandler = async(source: NoteTypes, sourceValue: Note) => {
        if(dragTarget != source && dragTarget){
            switch(dragTarget){
                case 'todo':
                    dispatch(setTodos([...todos, sourceValue]));
                    break;
                case 'inProgress':
                    dispatch(setInProgress([...inProgresses, sourceValue]));
                    break;
                    case 'done':
                    dispatch(setDone([...dones, sourceValue]));
                    break;
            }
    
            switch(source){
                case 'todo':
                    dispatch(setTodos(todos.filter((todo) => todo != sourceValue)));
                    break;
                case 'inProgress':
                    dispatch(setInProgress(inProgresses.filter((inprogress) => inprogress != sourceValue)));
                    break;
                case 'done':
                    dispatch(setDone(dones.filter((done) => done != sourceValue)));
                    break;
            }
            try {
                await changeNoteType(source, dragTarget, sourceValue, email as string);
            } catch (error) {
                fetchTodos()
                fetchInProgresses()
                fetchDones()
            }
        }
        setDragTarget("")
        // alert(document.)
    };

    const modalNote = useMemo(()=>{
        if(modalValue && modalValue.type === 'todo'){
            return todos.find((todo) => todo.title === modalValue.note.title)
        }else if(modalValue && modalValue.type === 'inProgress'){
            return inProgresses.find((inProgress) => inProgress.title === modalValue.note.title)
        }else if(modalValue && modalValue.type === 'done'){
            return dones.find((done) => done.title === modalValue.note.title)
        }
        return null
    }, [modalValue, todos, inProgresses, dones])

return (
    <div className=' w-screen  flex flex-col items-center gap-3 relative pt-10'>
        {/* <h1>Note Taking</h1> */}
        <div className=' flex flex-col md:flex-row gap-2'>
            <div className={` rounded-lg p-2  bg-black h-fit ${dragTarget === 'todo' ? 'border-blue-300 border-dotted border-2' : ''}`}
                onDragEnter={() => onDragEnterHandler('todo')}>
                <div>ToDo</div>
                <div className=' flex flex-col gap-2 text-sm' >
                    {
                        [...todos].map((todo, index)=>{
                            return <div className=' relative border-2 border-transparent  hover:rounded border-rounded cursor-pointer' key={index} onClick={()=>showModalHandler(todo, 'todo')}>
                                <input type="text" value={edittingTodoIndex === index ?  edittingTodo: todo.title} className={`rounded-lg p-2 w-full cursor-pointer ${edittingTodoIndex===index ? 'pb-8 rounded-sm cursor-text' : ''}`} 
                                    draggable={edittingTodoIndex != index} 
                                    onDragEnd={() => onDropHandler('todo', todo)}
                                    readOnly={edittingTodoIndex != index} onChange={(e)=>{setEdittingTodo(e.target.value)}}></input>
                                {edittingTodoIndex === index && <div className="flex mt-1 gap-2">
                                    <button className="bg-blue-400 rounded-sm text-black flex items-center h-6" onClick={saveEdittingTodoHandler}>Save</button>
                                    <button className=" rounded-sm text-gray-300 flex items-center h-6" onClick={()=>setEdittingTodoIndex(null)}>Cancel</button>
                                </div>}
                                <span className='absolute top-2 right-1 hover:bg-gray-700 px-2 rounded-full' onClick={(e)=>editTodoHandler(e, index, todo.title)}>:</span>
                            </div>
                        })
                    }

                    {currentAdd != 'todo' ? <div className=' hover:bg-slate-800 rounded cursor-pointer mr-10 p-1 px-3' onClick={()=>setCurrentAdd('todo')}>
                        + Add a new note
                    </div> : 
                    <div>
                        <div className=' border-transparent rounded'>
                            <input type="text" placeholder="Enter your note here.." className='rounded-lg p-2 pb-6 w-full outline-none' autoFocus value={newTodo} onChange={(e)=>setNewTodo(e.target.value)}></input>
                        </div>
                        <div className='flex gap-3 h-8 mt-1'>
                            <button className=' bg-blue-400 rounded-sm text-black flex items-center disabled:bg-blue-900 ' onClick={addNewToDoHandler} disabled={isAdding}>Add card</button>
                            <button className=' bg-transparent hover:bg-gray-700 text-2xl rounded-sm flex items-center w-fit p-1' onClick={()=>setCurrentAdd('')}>&times;</button>
                        </div>
                    </div>
                        }
                </div>
            </div>

            <div className={` rounded-lg p-2 bg-black h-fit ${dragTarget === 'inProgress' ? 'border-blue-300 border-dotted border-2' : ''}`}>
                <div>In Progress</div>
                <div className=' flex flex-col gap-2 text-sm' onDragEnter={() => onDragEnterHandler('inProgress')}>
                    {
                        [...inProgresses].map((inProgress, index)=>{
                            return <div className=' relative border-2 border-transparent  hover:rounded border-rounded cursor-pointer' key={index} onClick={()=>showModalHandler(inProgress, "inProgress")}>
                                <input type="text" value={edittingInProgressIndex === index ?  edittingInProgress: inProgress.title} 
                                    className={`rounded-lg p-2 w-full cursor-pointer ${edittingInProgressIndex===index ? 'pb-8 rounded-sm cursor-text' : ''}`} 
                                    draggable={edittingInProgressIndex != index} readOnly={edittingInProgressIndex != index} onChange={(e)=>{setEdittingInProgress(e.target.value)}}
                                    onDragEnd={() => onDropHandler('inProgress', inProgress)}
                                    ></input>
                                {edittingInProgressIndex === index && <div className="flex mt-1 gap-2">
                                    <button className="bg-blue-400 rounded-sm text-black flex items-center h-6" onClick={saveEdittingInProgressHandler}>Save</button>
                                    <button className=" rounded-sm text-gray-300 flex items-center h-6" onClick={()=>setEdittingInProgressIndex(null)}>Cancel</button>
                                </div>}
                                <span className='absolute top-2 right-1 hover:bg-gray-700 px-2 rounded-full' onClick={(e)=>editInProgressHandler(e, index, inProgress.title)}>:</span>
                            </div>
                        })
                    }
                    {currentAdd !='inprogress' ? <div className=' hover:bg-slate-800 rounded cursor-pointer mr-10 p-1 px-3' onClick={()=>setCurrentAdd('inprogress')}>
                        + Add a new note
                    </div> : 
                    <div>
                        <div className=' border-transparent rounded'>
                            <input type="text" placeholder="Enter your note here.." className='rounded-lg p-2 pb-6 w-full outline-none' autoFocus draggable value={newInProgress} onChange={(e)=>setNewInProgress(e.target.value)}></input>
                        </div>
                        <div className='flex gap-3 h-8 mt-1'>
                            <button className=' bg-blue-400 rounded-sm text-black flex items-center disabled:bg-blue-900 ' onClick={addNewInProgressHandler} disabled={isAdding}>Add card</button>
                            <button className=' bg-transparent hover:bg-gray-700 text-2xl rounded-sm flex items-center w-fit p-1' onClick={()=>setCurrentAdd('')}>&times;</button>
                        </div>
                    </div>
                        }
                </div>
            </div>

            <div className={` rounded-lg p-2 bg-black h-fit ${dragTarget === 'done' ? 'border-blue-300 border-dotted border-2' : ''}`} onDragEnter={() => onDragEnterHandler('done')}>
                <div>Done</div>
                <div className=' flex flex-col gap-2 text-sm'>

                    {
                        [...dones].map((done, index)=>{
                            return <div className=' relative border-2 border-transparent  hover:rounded border-rounded cursor-pointer' key={index} onClick={()=>showModalHandler(done, "done")}>
                                <input type="text" value={edittingDoneIndex === index ?  edittingDone: done.title} 
                                    className={`rounded-lg p-2 w-full cursor-pointer ${edittingDoneIndex===index ? 'pb-8 rounded-sm cursor-text' : ''}`} 
                                    draggable={edittingDoneIndex != index} readOnly={edittingDoneIndex != index} onChange={(e)=>{setEdittingDone(e.target.value)}}
                                    onDragEnd={() => onDropHandler('done', done)}
                                    ></input>
                                {edittingDoneIndex === index && <div className="flex mt-1 gap-2">
                                    <button className="bg-blue-400 rounded-sm text-black flex items-center h-6" onClick={saveEdittingDoneHandler}>Save</button>
                                    <button className=" rounded-sm text-gray-300 flex items-center h-6" onClick={()=>setEdittingDoneIndex(null)}>Cancel</button>
                                </div>}
                                <span className='absolute top-2 right-1 hover:bg-gray-700 px-2 rounded-full' onClick={(e)=>editDoneHandler(e, index, done.title)}>:</span>
                            </div>
                        })
                    }
                    {currentAdd != 'done' ? <div className=' hover:bg-slate-800 rounded cursor-pointer mr-10 p-1 px-3' onClick={()=>setCurrentAdd('done')}>
                        + Add a new note
                    </div> : 
                    <div>
                        <div className=' border-transparent rounded'>
                            <input type="text" placeholder="Enter your note here.." className='rounded-lg p-2 pb-6 w-full outline-none' autoFocus draggable 
                                value={newDone} onChange={(e)=>setNewDone(e.target.value)}></input>
                        </div>
                        <div className='flex gap-3 h-8 mt-1'>
                            <button className=' bg-blue-400 rounded-sm text-black flex items-center disabled:bg-blue-900 ' onClick={addNewDoneHandler} disabled={isAdding}>Add card</button>
                            <button className=' bg-transparent hover:bg-gray-700 text-2xl rounded-sm flex items-center w-fit p-1' onClick={()=>setCurrentAdd('')}>&times;</button>
                        </div>
                    </div>
                        }
                </div>
            </div>
        </div>
        {
            showModal && modalValue && modalNote && <Modal value={modalNote} type={modalValue.type} onClose={closeModalHandler} key={JSON.stringify(modalNote)}></Modal>
        }
    </div>
)
}

export default Dashboard;