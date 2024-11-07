import { useState } from "react";
import { Link } from "react-router-dom"
import { signUpUser } from "../utils/firebase/firebase.utils";

function SingUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const signUpHanlder = async (e: SubmitEvent) => {
        e.preventDefault();
        if(email && password && confirmPassword){
            if(password != confirmPassword) {
                return alert("Passwords din't match.")
            }
            try{
                const response = await signUpUser(email, password);
                console.log("sing up response", response)
            }catch(error){
                console.log({error})
            }
        }
    };

    return (
        <section className="w-screen ">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0  w-full">
              <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                  Collaborative Note Taking    
              </a>
              <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                          Create a new account
                      </h1>
                      <form className="space-y-4 md:space-y-6" onSubmit={signUpHanlder}>
                          <div>
                              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                              <input className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                type="email" name="email" id="email" placeholder="name@company.com" required value={email} onChange={(e)=>setEmail(e.target.value)}/>
                          </div>
                          <div>
                              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                              <input type="password" name="password" id="password" placeholder="••••••••"  required value={password} onChange={(e)=> setPassword(e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                          </div>
                          <div>
                              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                              <input type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••"  required value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                          </div>
                          <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >Sign up</button>
                          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                              Already have an account. <Link to="/sign-in" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</Link>
                          </p>
                      </form>
                  </div>
              </div>
          </div>
          </section>
    )
  }
  
  export default SingUp
  