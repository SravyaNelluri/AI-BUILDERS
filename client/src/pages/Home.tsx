import api from '@/configs/axios';
import { authClient } from '@/lib/auth-client';
import { Loader2Icon } from 'lucide-react';
import React from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Home = () => {
  const {data: session} = authClient.useSession();
   const navigate = useNavigate();

  const [input, setInput] = React.useState('');
  const[loading,setLoading]= useState(false);
  
  const onSubmitHandler= async (e: React.FormEvent) => {
    e.preventDefault();
    try{
       if(!session?.user){
        return toast.error('You must be logged in to create a project');
       }else if(!input.trim()){
        return toast.error('Please provide a valid prompt');
       }
       setLoading(true);
      const {data} = await api.post('/user/project', {initial_prompt: input.trim()});
       setLoading(false);
       navigate(`/projects/${data.projectId}`)
    } catch(error: any){
setLoading(false);
toast.error(error ?.response?.data?.message||error.message);
console.log(error);
    }
  
  }

  return (
    <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
          Turn thoughts into websites instantly, with AI.
        </h1>

        <p className="text-center text-base max-w-md mt-2">
          Create, customize and present faster than ever with intelligent design powered by AI.
        </p>

        <form onSubmit={onSubmitHandler} className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all">
          <textarea value={input} onChange={e => setInput(e.target.value)} 
          className="bg-transparent outline-none text-gray-300 resize-none w-full" rows={4} placeholder="Describe your presentation in details" required />
          <button className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#CB52D4] to-indigo-600 rounded-md px-4 py-2">
            {!loading ? ' ' :(
              <>
              Create <Loader2Icon className='animate-spin size-4 text-white'/>
              </>
            )}
           Create AI Website
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-16 md:gap-20 mx-auto mt-16">
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/framer.svg" alt="" />
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg" alt="" />
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg" alt="" />
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg" alt="" />
          <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg" alt="" />
        </div>
      </section>
    )
}

export default Home
