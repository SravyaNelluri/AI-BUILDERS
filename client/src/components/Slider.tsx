import React, { useEffect, useRef, useState } from 'react'
import type { Project } from '../assets';
import type { Message, Version } from '../types';
import { BotIcon, Eye, EyeIcon, Loader2Icon, SendIcon, UserIcon, ExternalLinkIcon } from 'lucide-react';
import api from '@/configs/axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface SidebarProps {
    isMenuOpen: boolean;
    project: Project,
    setProject: (project: Project)=>void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean)=>void;
}

const Slider = ({isMenuOpen, project, setProject, isGenerating,setIsGenerating}: SidebarProps) => {
  const messageRef= useRef<HTMLDivElement>(null)
  const[input, setInput] = useState('')

  const handleRollBack = async (versionId: string) => {
    try {
      await api.post(`/api/project/rollback/${project.id}`, { versionId })
      toast.success('Rolled back to previous version')
      // Refresh project data
      const { data } = await api.get(`/api/user/project/${project.id}`)
      setProject(data.project)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to rollback')
    }
  }

  const handleRevisions = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) {
      toast.error('Please enter a message')
      return
    }

    try {
      setIsGenerating(true)
      
      // Add user message to conversation optimistically
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
        timestamp: new Date().toISOString()
      }
      setProject({
        ...project,
        conversation: [...project.conversation, userMessage]
      })
      
      const currentInput = input
      setInput('')

      await api.post(`/api/project/revision/${project.id}`, { message: currentInput })
      toast.success('Revision request sent')
      
      // Poll for updates - the parent View component will handle refreshing
      // Just keep isGenerating true until parent detects completion
      
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to make revision')
      setIsGenerating(false)
    }
  }
  useEffect(()=>{
    if(messageRef.current){
      messageRef.current.scrollIntoView({behavior:'smooth'});
    }
  },[project.conversation.length,isGenerating]
)

  return (
    <div className={`h-full sm:max-w-sm rounded-xl bg-gray-900 border border-gray-800 transition-all ${isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'}`}>
      <div className='flex flex-col h-full'>
       {/*Message container */}
<div className='flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4'>
    {[...project.conversation, ...project.versions]
    .sort((a,b)=> new Date(a.timestamp).getTime()- new Date(b.timestamp).getTime()).map((message)=>{
      const isMessage ='content' in message;

       if(isMessage){
        const msg= message as Message;
        const isUser = msg.role === 'user';
        return(
          <div key={msg.id} className={`flex items-start gap-3 $
          {isUser ? " justify-end" : "justify-start"}`}>
            {!isUser && (
              <div className='w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center'>
                <BotIcon className='size-5 text-white'/>
                </div>
            )}
            <div className={`max-w-[80%] p-2 px-3 rounded-2xl shadow-sm mt-5 leading-relaxed ${isUser ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-tr-none" : "rounded-tl-none bg-gray-800 text-gray-100"}`}>
              {msg.content}
              </div>
              {isUser && (
                <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center'>
                  <UserIcon className='size-5 text-gray-200'/>
                  </div>

              )}
            </div>
        )
       }
       else{
        const ver = message as Version;
        return(
          <div key={ver.id} className='w-4/5 mx-auto my-2 p-3 rounded-xl bg-gray-800 text-gray-100 shadow flex flex-col gap-2'>
            <div className='text-xs font-medium'>
              code updated <br/>
              <span  className='text-gray-500 text-xs font-normal'>
                
                  {new Date(ver.timestamp).toLocaleString()}
                
              </span>
              </div>
              <div className='flex items-center justify-between'>
                {project.current_version_index === ver.id? (
                  <button className='px-3 py-1 rounded-md text-xs bg-gray-700'>Current Version </button>
                ) :(
                  <button onClick={() => handleRollBack(ver.id)} className='px-3 py-1 rounded-md text-xs bg-violet-600 hover:bg-violet-700'> Roll back to this version</button>
                )}
                <Link target='_blank' to={`/preview/${project.id}/${ver.id}`}>
                  <EyeIcon className='size-6  p-1 bg-gray-700 hover:bg-violet-600 transition-colors rounded'/>
                </Link>
              
                </div>
            </div>
        )
       }
    })}
    {
      isGenerating &&(
        <div className='flex items-start gap-3 justify-start'>
          <div className='w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center'>
          <BotIcon className='size-5 text-white'/>gradient
          </div>
          {/*three dot loader */}
          <div className='flex gap-1.5 h-full items-end'>
            <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{animationDelay :'0s'}} />
            <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{animationDelay :'0.2s'}} />
            <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{animationDelay :'0.4s'}} />
            </div>
        </div>
      )
    }
    <div ref={messageRef}/>
</div>
{/*Input area*/}
<form onSubmit={handleRevisions} className='m-3 relative'>
<div className='flex items-center gap-2'>
  <textarea onChange={(e=>setInput(e.target.value))} value={input} rows={4} placeholder='Describe your website or request changes...' className='flex-1 p-3 rounded-xl resize-none text-sm outline-none ring-gray-700 focus:ring-amber-500 bg-gray-800 text-gray-100 placeholder-gray-400 transition-all' disabled={isGenerating}/>
    <div className='absolute bottom-2.5 right-2.5 flex items-center gap-2'>
      <Link to={`/preview/${project.id}`} target='_blank' className='rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-colors p-1.5'>
        <EyeIcon className='size-5'/>
      </Link>
      <button disabled={isGenerating || input.trim() === ''} className='rounded-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white transition-colors disabled:opacity-60'>
        {isGenerating ? <Loader2Icon className='size-7 p-1.5 animate-spin text-white'/> 
        : <SendIcon className='size-7 p-1.5'/> }
      </button>
    </div>
</div>
</form>
</div>
</div>
  )
}

export default Slider
