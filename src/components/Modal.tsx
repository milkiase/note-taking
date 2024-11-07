import {useEffect, useRef, useState} from 'react'
import { createPortal } from 'react-dom';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Note, NoteTypes } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { updateDone, updateInProgress, updateTodo } from '../store/noteTaking/noteTaking.slice';
import Comment from './Comment';
import { selectEmail } from '../store/auth/auth.selectors';

type ModalProps = {
    value: Note;
    onClose: ()=> void;
    type: NoteTypes;
};

const  Modal = ({value, onClose, type}:ModalProps) => {
  const dispatch = useDispatch();
  const email = useSelector(selectEmail);
  const [quillValue, setQuillValue] = useState(value.description);
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const commentRef = useRef<ReactQuill | null>(null);

  useEffect(()=>{
    switch(type){
      case 'todo':
        dispatch(updateTodo({id: value.id as string, value: {...value, description: quillValue}}));
        break;
      case 'inProgress':
        dispatch(updateInProgress({id: value.id as string, value: {...value, description: quillValue}}));
        break;
      case 'done':
          dispatch(updateDone({id: value.id as string, value: {...value, description: quillValue}}));
          break;
      default:
        break;
    }
  }, [quillValue]);

  const saveCommentHanlder = () => {
    if(isCommenting && newComment) {
      switch(type){
        case 'todo':
          dispatch(updateTodo({id: value.id as string, value: {...value, comments: [...(value?.comments || []), {author: email as string, content: newComment, date: Date.now().toString()}]}}));
          break;
        case 'inProgress':
          dispatch(updateInProgress({id: value.id as string, value: {...value, comments: [...(value?.comments || []), {author: email as string, content: newComment, date: Date.now().toString()}]}}));
          break;
        case 'done':
            dispatch(updateDone({id: value.id as string, value: {...value, comments: [...(value?.comments || []), {author: email as string, content: newComment, date: Date.now().toString()}]}}));
            break;
        default:
          break;
      }
      setIsCommenting(false);
      setNewComment("");
      // onClose();
    }
  };

  const toggleCommentHandler = () => {
    if(!isCommenting) commentRef.current?.focus();
    setIsCommenting(!isCommenting);
  };

  return createPortal((
    <div className="absolute h-screen w-screen bg-black bg-opacity-60 flex flex-col items-center justify-center text-gray-300">
        <div className="w-10/12 md:w-8/12 lg:w-1/2 h-fit py-2 bg-gray-800 rounded-lg relative flex flex-col items-start pl-5">
            <span className="absolute right-1 top-1 text-2xl cursor-pointer hover:bg-gray-500 rounded-full px-2" onClick={onClose}>&times;</span>
            <p className="text-white">{value.title}</p>
            <div>
              <h4 className="py-2 mt-2 font-semibold">Description</h4>
              <ReactQuill theme="snow" value={quillValue}
                onChange={setQuillValue}></ReactQuill>
            </div>

            <div className="w-full">
              <h4 className="py-2 mt-2 font-semibold">Comments</h4>
              <div className="w-full flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className=' bg-blue-800 rounded-full text-base w-6 h-6 flex justify-center items-center'>
                      {email?.split(' ').map(name => name[0].toUpperCase()).join('')}
                  </div>
                  {!isCommenting ? <div className="bg-black bg-opacity-60 hover:bg-opacity-30 cursor-pointer w-5/6 rounded px-2 py-1 text-sm font-thin"
                      onClick={toggleCommentHandler}>Write a comment...</div>
                  :
                  <div>
                    <ReactQuill theme="snow" value={newComment} ref={commentRef}
                      onChange={setNewComment}></ReactQuill>
                      <div className="flex mt-1 gap-2">
                        <button className="bg-blue-400 rounded-sm text-black flex items-center h-6" onClick={saveCommentHanlder}>Save</button>
                        <button className=" rounded-sm text-gray-300 flex items-center h-6" onClick={()=>setIsCommenting(false)}>Cancel</button>
                      </div>
                  </div>}
                </div>
                {value?.comments &&
                  [...value?.comments]?.reverse().map((comment, index) => {
                    return <Comment username={comment.author} date="Today at 10:30 AM" content={comment.content} key={index}/>
                  })
                }
              </div>
            </div>
        </div>
    </div>
  ), document.getElementById("portal") as HTMLDivElement, null)
}

export default Modal;