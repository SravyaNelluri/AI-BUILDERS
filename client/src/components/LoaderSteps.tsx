import { ScanLineIcon } from "lucide-react"
import { useEffect, useState } from "react"

const steps = [
    {icon: ScanLineIcon, label: "Analysizing your request..."},
    {icon: ScanLineIcon, label: "Generating layout structure..."},
    {icon: ScanLineIcon, label: "Assembling UI components..."},
    {icon: ScanLineIcon, label: "Finalizing the Website..."},
    
]
const STEP_DURATION = 45000

const LoaderSteps = () => {
  const [current, setCurrent]= useState(0)
  useEffect(()=>{
    const interval= setInterval(()=>{
      setCurrent((s)=> (s+1) % steps.length )
    }, STEP_DURATION);
    return ()=> clearInterval(interval);
  },[])
  const Icon=steps[current].icon;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 relative overflow-hidden text-white">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950 to-gray-950 opacity-70 animate-pulse-slow"></div>
<div className="relative z-10 w-32 h-32 flex items-center justify-center">
<div className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-30"/>
<div className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-30"/>
<Icon className="w-8 h-8 text-white opacity-80 animate-bounce"/>


</div>
{/* Step label - fade using transition only (no invisisble start)*/}
<p key={current} className="mt-8 text-lg font-light text-white/90 tracking-wide transition-all duration-700 ease-in-out opacity-100">{steps[current].label}</p>
<p className="text-xs text-gray-400 mt-2 transition-opacity duration-700 opacity-100">This may take around 2-3 minitues...</p>
</div>
   
  )
}

export default LoaderSteps