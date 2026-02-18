import React from 'react'
import { appPlans } from '../assets/assets';
import Footer from '../components/Footer';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import api from '@/configs/axios';
interface Plan{
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}
const Pricing = () => {

  const {data: session} =  authClient.useSession()
  const [plans]=React.useState<Plan[]>(appPlans)
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null)
  
  const handlePurchase= async (planId: string) =>{
   try{
    if(!session?.user) {
      toast.error('Please login to purchase credits')
      return
    }
    
    setLoadingPlan(planId)
    
    console.log('[Purchase] Starting purchase for plan:', planId);
    
    // Create Stripe checkout session
    const {data} = await api.post('/user/purchase-credits',{planId})
    
    console.log('[Purchase] Response received:', data);
    
    // Redirect to Stripe checkout
    if(data.payment_link){
      toast.success('Redirecting to payment...')
      console.log('[Purchase] Redirecting to:', data.payment_link);
      window.location.href = data.payment_link
    } else {
      console.error('[Purchase] No payment link in response:', data);
      toast.error('Failed to create payment session')
      setLoadingPlan(null)
    }
    
   }catch(error: any){
     console.error('[Purchase] Full error:', error);
     console.error('[Purchase] Error response:', error?.response);
     console.error('[Purchase] Error data:', error?.response?.data);
     const errorMessage = error?.response?.data?.message || error.message || 'Something went wrong';
     toast.error(errorMessage)
     console.error('Payment error:', errorMessage);
     setLoadingPlan(null)
  }

  }
  return (
    <>
    <div className="w-full max-w-5xl mx-auto z-20 px-4 min-h-[80vh]">
      <div className='text-center mt-16'>
        <h2 className='text-gray-100 text-3xl font-medium'>
         Choose Your Plan
        </h2>
        <p className='text-gray-400  text-sm max-w-md mx-auto mt-2'>
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>
      <div>
         <div className='pt-14 py-4 px-4 '>
                    <div className='grid grid-cols-1 md:grid-cols-3 flex-wrap gap-4'>
                        {plans.map((plan, idx) => (
                            <div key={idx} className="p-6 bg-black/20 ring ring-indigo-950 mx-auto w-full max-w-sm rounded-lg text-white shadow-lg hover:ring-indigo-500 transition-all duration-400">
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <div className="my-2">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-gray-300"> / {plan.credits} credits</span>
                                </div>

                                <p className="text-gray-300 mb-6">{plan.description}</p>

                                <ul className="space-y-1.5 mb-6 text-sm">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <svg className="h-5 w-5 text-indigo-300 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-400">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={() => handlePurchase(plan.id)} 
                                    disabled={loadingPlan === plan.id}
                                    className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-sm rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loadingPlan === plan.id ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Buy Now'
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <p className='mx-auto text-center text-sm max-w-md mt-10 text-white/60 font-light'>
                  Project <span className='text-white'>
                    Creation /Revision
                      </span > 
                       Consume
                    <span className='text-white '>
                    5 credits.</span> you can purchasse more credits to create more projects.
                </p>
      </div>
      <Footer />
    </div>
    </>
  )
}

export default Pricing