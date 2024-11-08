type CommentProps = {
    username: string;
    date: string;
    content: string;
}
function Comment({username, date, content}:CommentProps) {
  return (
    <div className=' flex items-center text-xs gap-2 bg-black bg-opacity-20 pl-2 pr-10 py-1 rounded-sm w-full md:w-5/6'>
        <div className=' bg-blue-800 rounded-full p-2 text-lg w-7 h-7 flex justify-center items-center'>
            {username.split(' ').map(name => name[0].toUpperCase()).join('')}
        </div>
        <div className=' flex flex-col items-start'>
            <div className=' flex justify-start gap-2'>
                <span className=' font-bold'>{username}</span>
                <span  dangerouslySetInnerHTML={{__html: content}}></span>
            </div>
            <div className=' font-thin text-[10px]'> {date} </div>
        </div>

    </div>
  )
}

export default Comment;