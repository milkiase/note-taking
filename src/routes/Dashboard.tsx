import React, { useState, MouseEvent, DragEvent, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectDone, selectInProgress, selectTodos } from '../store/noteTaking/noteTaking.selectors';
import { setDone, setInProgress, setTodos } from '../store/noteTaking/noteTaking.slice';
import Modal from '../components/Modal';
import { Note, NoteTypes } from '../types';

const  Dashboard = () => {
    const dispatch = useDispatch();
    const todos = useSelector(selectTodos);
    const inProgresses = useSelector(selectInProgress);
    const dones = useSelector(selectDone);
    
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
    
    const [dragTarget, setDragTarget] = useState("");

    const addNewToDoHandler = () => {
        if(newTodo){
            dispatch(setTodos([...todos, {title: newTodo}]));
            setNewTodo("");
            setCurrentAdd('');
        }
    }

    const addNewInProgressHandler = () => {
        if(newInProgress){
            dispatch(setInProgress([...inProgresses, {title: newInProgress}]));
            setNewInProgress("");
            setCurrentAdd('');
        }
    }
    const addNewDoneHandler = () => {
        if(newDone){
            dispatch(setDone([...dones, {title: newDone}]));
            setNewDone("");
            setCurrentAdd('');
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

    const editTodoHandler = (e: MouseEvent<HTMLSpanElement, MouseEvent>, index: number, todo: string) => {
        e.stopPropagation();
        setEdittingTodoIndex(index);
        setEdittingTodo(todo);
    };

    const editInProgressHandler = (e: MouseEvent<HTMLSpanElement, MouseEvent>, index: number, inProgress: string) => {
        e.stopPropagation();
        setEdittingInProgressIndex(index);
        setEdittingInProgress(inProgress);
    };
    
    const editDoneHandler = (e: MouseEvent<HTMLSpanElement, MouseEvent>, index: number, done: string) => {
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

    const onDragEnterHandler = (e: any, target: string) => {
        setDragTarget(target)
        // setDragSource(target)
    }
    const onDropHandler = (e: DragEvent<HTMLInputElement>, source: string, sourceValue: Note) => {
        if(dragTarget != source){
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
    <div className=' w-screen h-screen flex flex-col items-center gap-3 relative'>
        <h1>Note Taking</h1>
        <div className=' flex flex-col md:flex-row gap-2'>
            <div className={` rounded-lg p-2 bg-black h-fit ${dragTarget === 'todo' ? 'border-blue-300 border-dotted border-2' : ''}`}
                onDragEnter={(e) => onDragEnterHandler(e, 'todo')}>
                <div>ToDo</div>
                <div className=' flex flex-col gap-2 text-sm' >
                    {
                        todos.map((todo, index)=>{
                            return <div className=' relative border-2 border-transparent  hover:rounded border-rounded cursor-pointer' key={index} onClick={()=>showModalHandler(todo, 'todo')}>
                                <input type="text" value={edittingTodoIndex === index ?  edittingTodo: todo.title} className={`rounded-lg p-2 w-full cursor-pointer ${edittingTodoIndex===index ? 'pb-8 rounded-sm cursor-text' : ''}`} 
                                    draggable={edittingTodoIndex != index} 
                                    onDragEnd={(e) => onDropHandler(e, 'todo', todo)}
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
                            <button className=' bg-blue-400 rounded-sm text-black flex items-center' onClick={addNewToDoHandler}>Add card</button>
                            <button className=' bg-transparent hover:bg-gray-700 text-2xl rounded-sm flex items-center w-fit p-1' onClick={()=>setCurrentAdd('')}>&times;</button>
                        </div>
                    </div>
                        }
                </div>
            </div>

            <div className={` rounded-lg p-2 bg-black h-fit ${dragTarget === 'inProgress' ? 'border-blue-300 border-dotted border-2' : ''}`}>
                <div>In Progress</div>
                <div className=' flex flex-col gap-2 text-sm' onDragEnter={(e) => onDragEnterHandler(e, 'inProgress')}>
                    {
                        inProgresses.map((inProgress, index)=>{
                            return <div className=' relative border-2 border-transparent  hover:rounded border-rounded cursor-pointer' key={index} onClick={()=>showModalHandler(inProgress, "inProgress")}>
                                <input type="text" value={edittingInProgressIndex === index ?  edittingInProgress: inProgress.title} 
                                    className={`rounded-lg p-2 w-full cursor-pointer ${edittingInProgressIndex===index ? 'pb-8 rounded-sm cursor-text' : ''}`} 
                                    draggable={edittingInProgressIndex != index} readOnly={edittingInProgressIndex != index} onChange={(e)=>{setEdittingInProgress(e.target.value)}}
                                    onDragEnd={(e) => onDropHandler(e, 'inProgress', inProgress)}
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
                            <button className=' bg-blue-400 rounded-sm text-black flex items-center' onClick={addNewInProgressHandler}>Add card</button>
                            <button className=' bg-transparent hover:bg-gray-700 text-2xl rounded-sm flex items-center w-fit p-1' onClick={()=>setCurrentAdd('')}>&times;</button>
                        </div>
                    </div>
                        }
                </div>
            </div>

            <div className={` rounded-lg p-2 bg-black h-fit ${dragTarget === 'done' ? 'border-blue-300 border-dotted border-2' : ''}`} onDragEnter={(e) => onDragEnterHandler(e, 'done')}>
                <div>Done</div>
                <div className=' flex flex-col gap-2 text-sm'>

                    {
                        dones.map((done, index)=>{
                            return <div className=' relative border-2 border-transparent  hover:rounded border-rounded cursor-pointer' key={index} onClick={()=>showModalHandler(done, "done")}>
                                <input type="text" value={edittingDoneIndex === index ?  edittingDone: done.title} 
                                    className={`rounded-lg p-2 w-full cursor-pointer ${edittingDoneIndex===index ? 'pb-8 rounded-sm cursor-text' : ''}`} 
                                    draggable={edittingDoneIndex != index} readOnly={edittingDoneIndex != index} onChange={(e)=>{setEdittingDone(e.target.value)}}
                                    onDragEnd={(e) => onDropHandler(e, 'done', done)}
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
                            <button className=' bg-blue-400 rounded-sm text-black flex items-center' onClick={addNewDoneHandler}>Add card</button>
                            <button className=' bg-transparent hover:bg-gray-700 text-2xl rounded-sm flex items-center w-fit p-1' onClick={()=>setCurrentAdd('')}>&times;</button>
                        </div>
                    </div>
                        }
                </div>
            </div>
        </div>

        {
            showModal && modalValue && modalNote && <Modal value={modalNote} type={modalValue.type} onClose={closeModalHandler}></Modal>
        }
    </div>
)
}

export default Dashboard;