import React from 'react'

type ModalProps = {
    value: string;
    onClose: ()=> void;
}
function Modal({value, onClose}:ModalProps) {
  return (
    <div className="absolute h-screen w-screen bg-black bg-opacity-60 flex items-center justify-center">
        <div className="w-10/12 md:w-8/12 lg:w-1/2 h-fit py-2 bg-gray-600 relative flex flex-col items-center">
            <span className="absolute right-1 top-1 text-2xl cursor-pointer hover:bg-gray-500 rounded-full px-2" onClick={onClose}>&times;</span>
            <p className="text-white">{value}</p>
        </div>
    </div>
  )
}

export default Modal