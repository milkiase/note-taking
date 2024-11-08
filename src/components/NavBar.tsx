import { useDispatch, useSelector } from 'react-redux'
import { signOut } from '../store/auth/auth.slice';
import { selectEmail } from '../store/auth/auth.selectors';

function NavBar() {
    const dispatch = useDispatch();
    const email = useSelector(selectEmail);
    const signOutHandler = () => {
        // Add your Firebase sign-out logic here
        dispatch(signOut());
    };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-800  p-6 w-full">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-semibold text-xl tracking-tight">Collaborative Note Taking</span>
        </div>
        <div className="block lg:hidden">
            <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
            </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
            {/* <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                Docs
            </a>
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                Examples
            </a>
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                Blog
            </a> */}
            </div>
            <div>
            <div className='flex gap-2 items-center'>
                <div>
                    {email}
                </div>
                <button onClick={signOutHandler} 
                    className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
                    Sign Out</button>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default NavBar