import React, { useState, MouseEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectDone, selectInProgress, selectTodos } from '../store/noteTaking/noteTaking.selectors';
import { setDone, setInProgress, setTodos } from '../store/noteTaking/noteTaking.slice';
import Modal from '../components/Modal';

function Dashboard() {
    const dispatch = useDispatch();
    const todos = useSelector(selectTodos);
    const inProgresses = useSelector(selectInProgress);
    const dones = useSelector(selectDone);
    
    const [showModal, setShowModal] = useState(false);
    const [modalValue, setModalValue] = useState("");

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

    const addNewToDoHandler = () => {
        if(newTodo){
            dispatch(setTodos([...todos, newTodo]));
            setNewTodo("");
            setCurrentAdd('');
        }
    }

    const addNewInProgressHandler = () => {
        if(newInProgress){
            dispatch(setInProgress([...inProgresses, newInProgress]));
            setNewInProgress("");
            setCurrentAdd('');
        }
    }
    const addNewDoneHandler = () => {
        if(newDone){
            dispatch(setDone([...dones, newDone]));
            setNewDone("");
            setCurrentAdd('');
        }
        
    }

    const showModalHandler = (val: string) => {
        if(!val || edittingTodoIndex != null || edittingInProgressIndex != null || edittingDoneIndex != null) return;
        setModalValue(val);
        setShowModal(true);
    };

    const closeModalHandler = () => {
        setModalValue('');
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
            dispatch(setTodos(todos.map((todo, index) => index === edittingTodoIndex ? edittingTodo : todo)));
            setEdittingTodo('');
            setEdittingTodoIndex(null);
        }
    }
    
    const saveEdittingInProgressHandler = () => {
        if(edittingInProgress && edittingInProgressIndex != null){
            dispatch(setInProgress(inProgresses.map((inProgress, index) => index === edittingInProgressIndex ? edittingInProgress : inProgress)));
            setEdittingInProgress('');
            setEdittingInProgressIndex(null);
        }else{
            alert(edittingInProgress)
            alert(edittingInProgressIndex)
        }
    }
    
    const saveEdittingDoneHandler = () => {
        if(edittingDone && edittingDoneIndex != null){
            dispatch(setDone(dones.map((done, index) => index === edittingDoneIndex ? edittingDone : done)));
            setEdittingDone('');
            setEdittingDoneIndex(null);
        }
    }
return (
    <div className=' w-screen h-screen flex flex-col items-center gap-3 relative'>
        <h1>Note Taking</h1>
        <div className=' flex flex-col md:flex-row gap-2'>
            <div className=' rounded-lg p-2 bg-black h-fit'>
                <div>ToDo</div>
                <div className=' flex flex-col gap-2 text-sm'>
                    {
                        todos.map((todo, index)=>{
                            return <div className=' relative border-2 border-transparent  hover:rounded border-rounded cursor-pointer' key={index} onClick={()=>showModalHandler(todo)}>
                                <input type="text" value={edittingTodoIndex === index ?  edittingTodo: todo} className={`rounded-lg p-2 w-full cursor-pointer ${edittingTodoIndex===index ? 'pb-8 rounded-sm cursor-text' : ''}`} 
                                    draggable={edittingTodoIndex != index} readOnly={edittingTodoIndex != index} onChange={(e)=>{setEdittingTodo(e.target.value)}}></input>
                                {edittingTodoIndex === index && <div className="flex mt-1 gap-2">
                                    <button className="bg-blue-400 rounded-sm text-black flex items-center h-6" onClick={saveEdittingTodoHandler}>Save</button>
                                    <button className=" rounded-sm text-gray-300 flex items-center h-6" onClick={()=>setEdittingTodoIndex(null)}>Cancel</button>
                                </div>}
                                <span className='absolute top-2 right-1 hover:bg-gray-700 px-2 rounded-full' onClick={(e)=>editTodoHandler(e, index, todo)}>:</span>
                            </div>
                        })
                    }

                    {currentAdd != 'todo' ? <div className=' hover:bg-slate-800 rounded cursor-pointer mr-10 p-1 px-3' onClick={()=>setCurrentAdd('todo')}>
                        + Add a new note
                    </div> : 
                    <div>
                        <div className=' border-transparent rounded'>
                            <input type="text" placeholder="Enter your note here.." className='rounded-lg p-2 pb-6 w-full outline-none' autoFocus draggable value={newTodo} onChange={(e)=>setNewTodo(e.target.value)}></input>
                        </div>
                        <div className='flex gap-3 h-8 mt-1'>
                            <button className=' bg-blue-400 rounded-sm text-black flex items-center' onClick={addNewToDoHandler}>Add card</button>
                            <button className=' bg-transparent hover:bg-gray-700 text-2xl rounded-sm flex items-center w-fit p-1' onClick={()=>setCurrentAdd('')}>&times;</button>
                        </div>
                    </div>
                        }
                </div>
            </div>

            <div className=' rounded-lg p-2 bg-black h-fit'>
                <div>In Progress</div>
                <div className=' flex flex-col gap-2 text-sm'>

                    {
                        inProgresses.map((inProgress, index)=>{
                            return <div className=' relative border-2 border-transparent  hover:rounded border-rounded cursor-pointer' key={index} onClick={()=>showModalHandler(inProgress)}>
                                <input type="text" value={edittingInProgressIndex === index ?  edittingInProgress: inProgress} className={`rounded-lg p-2 w-full cursor-pointer ${edittingInProgressIndex===index ? 'pb-8 rounded-sm cursor-text' : ''}`} 
                                    draggable={edittingInProgressIndex != index} readOnly={edittingInProgressIndex != index} onChange={(e)=>{setEdittingInProgress(e.target.value)}}></input>
                                {edittingInProgressIndex === index && <div className="flex mt-1 gap-2">
                                    <button className="bg-blue-400 rounded-sm text-black flex items-center h-6" onClick={saveEdittingInProgressHandler}>Save</button>
                                    <button className=" rounded-sm text-gray-300 flex items-center h-6" onClick={()=>setEdittingInProgressIndex(null)}>Cancel</button>
                                </div>}
                                <span className='absolute top-2 right-1 hover:bg-gray-700 px-2 rounded-full' onClick={(e)=>editInProgressHandler(e, index, inProgress)}>:</span>
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

            <div className=' rounded-lg p-2 bg-black h-fit'>
                <div>Done</div>
                <div className=' flex flex-col gap-2 text-sm'>

                    {
                        dones.map((done, index)=>{
                            return <div className=' relative border-2 border-transparent  hover:rounded border-rounded cursor-pointer' key={index} onClick={()=>showModalHandler(done)}>
                                <input type="text" value={edittingDoneIndex === index ?  edittingDone: done} className={`rounded-lg p-2 w-full cursor-pointer ${edittingDoneIndex===index ? 'pb-8 rounded-sm cursor-text' : ''}`} 
                                    draggable={edittingDoneIndex != index} readOnly={edittingDoneIndex != index} onChange={(e)=>{setEdittingDone(e.target.value)}}></input>
                                {edittingDoneIndex === index && <div className="flex mt-1 gap-2">
                                    <button className="bg-blue-400 rounded-sm text-black flex items-center h-6" onClick={saveEdittingDoneHandler}>Save</button>
                                    <button className=" rounded-sm text-gray-300 flex items-center h-6" onClick={()=>setEdittingDoneIndex(null)}>Cancel</button>
                                </div>}
                                <span className='absolute top-2 right-1 hover:bg-gray-700 px-2 rounded-full' onClick={(e)=>editDoneHandler(e, index, done)}>:</span>
                            </div>
                        })
                    }
                    {currentAdd != 'done' ? <div className=' hover:bg-slate-800 rounded cursor-pointer mr-10 p-1 px-3' onClick={()=>setCurrentAdd('done')}>
                        + Add a new note
                    </div> : 
                    <div>
                        <div className=' border-transparent rounded'>
                            <input type="text" placeholder="Enter your note here.." className='rounded-lg p-2 pb-6 w-full outline-none' autoFocus draggable value={newDone} onChange={(e)=>setNewDone(e.target.value)}></input>
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
            showModal && <Modal value={modalValue} onClose={closeModalHandler}></Modal>
        }
    </div>
)
}

export default Dashboard;