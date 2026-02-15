import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Loader2Icon } from "lucide-react";
import type { Project } from "../types";
import ProjectPreview from "../components/ProjectPreview";
import api from "@/configs/axios";
import { toast } from "sonner";


const Preview = () => {
  const { projectId, versionId }= useParams()
  const [code,setCode]  = useState('');
  const[loading, setLoading]= useState(true);
  
  const fetchCode = async () =>{
    try {
      const { data } = await api.get(`/api/project/preview/${projectId}`)
      setCode(data.project?.current_code || '')
      setLoading(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load preview')
      setLoading(false)
    }
  }


  useEffect(()=>{
    fetchCode();
  },[projectId])

  if(loading){
    return(
      <div>
        <Loader2Icon className='size-7 animate-spin text-indigo-200'/>
      </div>
    )
  }
  return (
    <div className='w-full h-screen bg-gray-900'>
      {code && <ProjectPreview project={{ current_code: code } as Project} 
      isGenerating={false} showEditorPanel={false} />}
    </div>
  )
}
 

export default Preview