import { useEffect, useState } from 'react'
import type { Project } from '../types'
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/configs/axios'
import { toast } from 'sonner'
import Footer from '../components/Footer'
import { authClient } from '@/lib/auth-client'

const MyProjects = () => {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/user/projects')
      setProjects(data.projects || [])
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      await api.delete(`/project/${projectId}`)
      toast.success('Project deleted successfully')
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete project')
    }
  }

  useEffect(() => {
    if (!isPending && session?.user) {
      fetchProjects()
    } else if (!isPending && !session?.user) {
      navigate("/")
      toast("Please login to view your projects")
    }
  }, [isPending, session?.user])
 

  return (
    <>
      <div className="px-4 md:px-16 lg:px-24 xl:px-32">
        {loading ? (
          <div className="flex justify-center items-center h-[800px]">
            <Loader2Icon className="size-7 animate-spin text-amber-200" />
          </div>
        ) : projects.length > 0 ? (
          <div className="py-10 min-h-[80vh]">
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-2xl font-medium text-white">My Projects</h1>
            </div>

            <div className="flex flex-wrap gap-3.5">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/view/${project.id}`}
                  target="_blank"
                  className="relative w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 
                  border border-gray-700 rounded-lg overflow-hidden group
                  hover:border-violet-700/80 transition-all duration-300"
                >
                  {/* Trash icon in top-right of card */}
                  <button
                    className="absolute top-3 right-3 z-10 bg-white p-2 rounded-md shadow 
                    text-red-500 opacity-0 group-hover:opacity-100 hover:scale-105 transition-all"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      deleteProject(project.id)
                    }}
                    aria-label="Delete project"
                  >
                    <TrashIcon className="size-5" />
                  </button>

                
                  {/* Desktop-like Mini Preview */}
                 
                  <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
                    {project.current_code ? (
                      <iframe
                        srcDoc={project.current_code}
                        className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none"
                        sandbox="allow-scripts"
                        style={{ transform: 'scale(0.25)' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No Preview</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 text-white bg-gradient-to-t from-transparent group-hover:from-violet-950 to-transparent transition-colors">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium line-clamp-2">
                        {project.name}
                      </h2>
                      <button className="px-2.5 py-0.5 mt-1 ml-2 text-xs bg-gray-800 border border-gray-700">
                        Website
                      </button>
                    </div>

                    <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                      {project.initial_prompt}
                    </p>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex justify-between items-center mt-6"
                    >
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex gap-3 text-white text-sm">
                        <button
                          onClick={() =>
                            navigate(`/preview/${project.id}`)
                          }
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-all"
                        >
                          Preview
                        </button>
                        <button  onClick={() =>
                            navigate(`/preview/${project.id}`)
                          }className='px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-colors'>Open</button>
                      </div>
                    </div>
                  </div>
                

                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[800px]">
            <h1 className="text-3xl font-semibold text-gray-300">
              No projects found
            </h1>
            <button
              onClick={() => navigate('/')}
              className="text-white px-5 py-2 mt-5 rounded-md bg-amber-600 hover:bg-amber-700 active:scale-95 transition-all"
            >
              Create New
            </button>
          </div>
        )}
        
      <Footer />
      </div>
    </>
  )
}

export default MyProjects
