import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types'
import { ArrowBigDownDashIcon, EyeIcon, EyeOffIcon, FullscreenIcon, Laptop, Loader2Icon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletIcon, XIcon } from 'lucide-react'

import Sidebar from '../components/Slider'
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview'
import api from '@/configs/axios'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

const Projects = () => {
  const {projectId} = useParams()
  const navigate= useNavigate()
  const {data: session , isPending} = authClient.useSession(); 
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile' | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const previewRef = useRef<ProjectPreviewRef>(null)

  const fetchProject = useCallback(async () => {
    try{
        console.log(`Fetching project ${projectId}...`);
        const{data} =  await api.get(`/user/project/${projectId}`);
        console.log('Project data:', data.project);
        setProject(data.project);
        setIsGenerating(!data.project.current_code)
        setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
}, [projectId])
     const saveProject = async () =>{
       try {
         setIsSaving(true)
         const code = previewRef.current?.getCode() || project?.current_code
         if (!code) {
           toast.error('No code to save')
           return
         }
         await api.put(`/api/project/save/${projectId}`, { code })
         toast.success('Project saved successfully')
       } catch (error: any) {
         toast.error(error?.response?.data?.message || 'Failed to save project')
       } finally {
         setIsSaving(false)
       }
     };
     const downloadCode =()=>{
      const code=previewRef.current?.getCode()|| project?.current_code;
      if(!code) {
        if(isGenerating){
          return
        }
        return
      }
      const element= document.createElement('a');
      const file= new Blob([code], {type: 'text/html'});
      element.href= URL.createObjectURL(file);
      element.download ="index.html";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
     }
     const togglePublish =async () =>{
       try {
         const newPublishState = !project?.isPublished
         await api.post(`/user/project-toggle/${projectId}`)
         setProject(prev => prev ? { ...prev, isPublished: newPublishState } : null)
         toast.success(newPublishState ? 'Project published!' : 'Project unpublished')
       } catch (error: any) {
         toast.error(error?.response?.data?.message || 'Failed to update publish status')
       }
     }
     useEffect(() => {
       if(!isPending && session?.user) {
         fetchProject();
       } else if(!isPending && !session?.user) {
         navigate("/");
         toast("Please login to view your projects");
       }
     }, [isPending, session?.user, projectId, navigate])

     useEffect(()=>{
       if(project && !project.current_code){
         const intervalId = setInterval(() => {
           fetchProject();
         }, 3000); // Poll every 3 seconds for faster feedback
         return ()=> clearInterval(intervalId);
       }
     }, [project, fetchProject])
     if(loading){
      return (
        <>
          <div className="flex items-center justify-center h-screen">

            <Loader2Icon className="size-7 animate-spin text-violet-200" />
          </div>

        </>
      )
     }

  function updateDevice(arg0: string): void {
    throw new Error('Funplemented.')
  }

  return project ?(
    <div className='flex flex-col h-screen w-full bg-gray-900 text-white'>
      {/* build navbar  */}
    <div className='flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar'>
    {/* leftt */}
    <div className='flex items-center gap-2 sm:min-w-90 text-nowrap'>
      <img src="/favicon.svg"  className="h-6 cursor-pointer" onClick={() => navigate('/')} />
      <div className='max-w-64 sm:max-w-xs'>
        <p className='text-sm text-medium capitalize truncate'>{project.name}</p>
        <p className='text-xs text-gray-400 -mt-0.5'>Previewing last save version</p>
      </div>
      <div className='sm:hidden flex-1  flex justify-end '>
      {isMenuOpen ?
       <MessageSquareIcon onClick={()=> setIsMenuOpen(false)} className="size-6 cursor-pointer"/>:<XIcon className="size-6 cursor-pointer" onClick={()=> setIsMenuOpen(true)}/>}
      </div>
    </div>
    {/* middle */}
    <div  className='hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md'>
     <SmartphoneIcon onClick={()=> setDevice('mobile')} className={`size-6 p-1 rounded cursor-pointer ${device === 'mobile' ? "bg-gray-700" : ""}`}/>
      <TabletIcon onClick={()=> setDevice('tablet')} className={`size-6 p-1 rounded cursor-pointer ${device === 'tablet' ? "bg-gray-700" : ""}`}/>
        <Laptop  onClick={()=> setDevice('desktop')}className={`size-6 p-1 rounded cursor-pointer ${device === 'desktop' ? "bg-gray-700" : ""}`}/>
    </div>
    {/* right */}
    <div className='flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm '>
     <button onClick={saveProject} disabled={isSaving} className='max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded-sm transistion-colors border-gray-700'>
      {isSaving ? <Loader2Icon className="animate-spin" size={16}/> : <SaveIcon size={16} />}
      Save
   </button>
     <Link target='_blank' to={`/preview/${project.id}`} className='flex items-center gap-2 px-4 py-1 rounded sm: rounded-sm border border-gray-700 hover:bg-gray-800 transistion-colors'>
     <FullscreenIcon size={16} />
     Preview
     </Link>
     <button onClick={downloadCode} className='bg-linear-to-br from-blue-700 to-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transistion-colors'>
      <ArrowBigDownDashIcon size={16} />
      Download
     </button>
     <button onClick={togglePublish} className='bg-linear-to-br from-blue-700 to-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transistion-colors' >
      {project.isPublished ? 
      <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
   {project.isPublished ? 'Unpublish' : 'Publish'}
       </button>
    </div>
    </div>
    <div className='flex-1 flex overflow-auto'>
      <div>
     <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p) => setProject(p)} isGenerating={isGenerating} setIsGenerating={setIsGenerating}/>
      
      </div>
      <div className='flex-1 p-2 pl-0'>
        <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} />
        project preview
      </div>
    </div>
    </div>
  )
  :
 ( 
<div className='flex items-center justify-center h-screen'>
<p className='text-2xl font-medium text-wgray-200'>
  Unable to load
</p>
</div>
  )
}

export default Projects