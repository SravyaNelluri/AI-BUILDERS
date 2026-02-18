import { Request, Response } from 'express'
import { prisma } from '../lib/prisma';
import openai from '../configs/openai';
import Stripe from 'stripe';
// Single model (configure via .env). Default to a broadly available tier.
const MODEL = process.env.AI_MODEL || 'openai/gpt-4o-mini';
const MAX_TOKENS_DEFAULT = Number(process.env.AI_MAX_TOKENS || '2000');

async function runCompletion(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, maxTokens: number = MAX_TOKENS_DEFAULT) {
  return await openai.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages,
  });
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Get user credits
export const getUserCredits = async (req: Request, res: Response) => {
try{
    const userId= req.userId;
    if(!userId){
        return res.status(401).json({message: 'Unauthorized'});    
    }
    const user = await prisma.user.findUnique({
        where:{id: userId}, 
    });
      if(!user){
        return res.status(404).json({message:'User not found'});
      }

      return res.json({credits: user.credits});
}
catch(error: any){
   console.log(error.code|| error.message);
   res.status(500).json({message: error.message}) ;
}
}

// controller function to create new project
export const createUserProject = async (req: Request, res: Response) => {
const userId= req.userId;
  try{
    
    if(!userId){
        return res.status(401).json({message: 'Unauthorized'});    
    }
    const user = await prisma.user.findUnique({
        where:{id: userId}, 
    })

    if(user && user.credits <5){
        return res.status(403).json({message: 'add credits to create new project'}); 
    }

    //create a new project
    const { initial_prompt } = req.body;
    const project = await prisma.websiteProject.create({
        data:{
          name: initial_prompt.length>50 ? initial_prompt.substring(0,47)+'...' : initial_prompt,
          initial_prompt,
          userId,
          
        }
    });
    //updates users total creation
    await prisma.user.update({
        where:{id: userId},
        data:{  totalCreation: { increment: 1 }}
    })

    await prisma.conversation.create({
        data:{
          role:'user',
          content: initial_prompt,
          projectId: project.id,
        }
    });
    await prisma.user.update({
        where:{id: userId},
        data:{ credits: { decrement: 5 }}
    });
     res.json({projectId: project.id} );
     
     // Generate in background (don't await)
     (async () => {
       try{
         console.log(`[${new Date().toISOString()}] Starting generation for project ${project.id}`);
         //Enhance user prompt
         const promptEnhanceResponse= await runCompletion([
            {
              role: 'system',
              content:`Enhance this website request with specific design details. Be concise (2-3 sentences max).`
            } ,
            {
              role: 'user',
              content: initial_prompt
            }
          ], 300)
          const enhancedPrompt = promptEnhanceResponse.choices[0].message.content || initial_prompt; 
          console.log(`[${new Date().toISOString()}] Enhanced prompt for project ${project.id}`);
          
          await prisma.conversation.create({
            data:{
              role:'assistant',
              content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
               projectId: project.id,
            }
        });
        //Generate website code
           const codeGenenratorResponse= await runCompletion([
            {
              role: 'system',
              content:
           `Expert web developer. Return ONLY complete HTML with Tailwind CSS. Include JS in <script> before </body>. No markdown.
           IMPORTANT: For images, use placeholder services like:
           - https://picsum.photos/WIDTH/HEIGHT for random photos
           - https://placehold.co/WIDTHxHEIGHT for colored placeholders
           - https://via.placeholder.com/WIDTHxHEIGHT for simple placeholders
           Always include real-looking images - never use broken or missing image sources.`
            },
            {
              role: 'user',
              content: enhancedPrompt
            }
          ], 2000)
           const code = codeGenenratorResponse.choices[0].message.content || '';
           console.log(`[${new Date().toISOString()}] Generated code for project ${project.id}, length: ${code.length}`);
           if(!code){
    await prisma.conversation.create({
    data: {
    role: 'assistant',
    content: "Unable to generate the code, please try again",
    projectId: project.id
    }
    })
    await prisma.user.update({
    where: {id: userId},
    data: {credits: {increment: 5}}
    })
    return;
          }
     // create version for the project
     const version = await prisma.version.create({
        data:{
    code: code.replace(/```[a-z]*\n?/gi, '')
    .replace(/```$/gi, '')
    .trim(),
    description:'Inital version',
    projectId: project.id,
   }
    
  })
  await prisma.conversation.create({
    data:{
      role: 'assistant',
      content: `Generated initial version of the website request any changes.`,
      projectId: project.id,
    }
  })
  await prisma.websiteProject.update({
    where:{id: project.id},
    data:{ 
    current_code: code.replace(/```[a-z]*\n?/gi, '')
    .replace(/```$/gi, '')
    .trim(),
    current_version_index: version.id,
    }
  })
  console.log(`[${new Date().toISOString()}] Completed generation for project ${project.id}`);

       } catch(error: any) {
         console.error('Error generating website:', error?.message || error);
         console.error('Error status:', error?.status);
         console.error('Error response:', error?.response?.data);
         await prisma.user.update({
           where:{id: userId},
           data:{ credits: { increment: 5 }}
         });
         await prisma.conversation.create({
           data: {
             role: 'assistant',
             content: `Error generating website: ${error.message}`,
             projectId: project.id
           }
         });
       }
     })();
  } catch(error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({message: error.message});
  }
}
// controller function to get a single user project
export const getUserProject = async (req: Request, res: Response) => {
try{
    const userId= req.userId;
    if(!userId){
        return res.status(401).json({message: 'Unauthorized'});    
    }

  const projectId = req.params.projectId as string;
  

  const project= await prisma.websiteProject.findUnique({
   where: { id: projectId },
      include:{
        conversation:{
          orderBy:{timestamp:'asc'}
        },
        versions:{
          orderBy:{timestamp:'asc'}
        }
      }
    })
   
   if(!project || project.userId !== userId){
      return res.status(404).json({message: 'Project not found'});
   }
   
   res.json({ project} );
}
catch(error: any){
   console.log(error.code|| error.message);
   res.status(500).json({message: error.message}) ;
}
}
// controller function to get all user projects
export const getUserProjects = async (req: Request, res: Response) => {
try{
    const userId= req.userId;
    if(!userId){
        return res.status(401).json({message: 'Unauthorized'});    
    }
const projects = await prisma.websiteProject.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
})
    res.json({ projects} );
}
catch(error: any){
   console.log(error.code|| error.message);
   res.status(500).json({message: error.message}) ;
}
}
// controller function to toggle project publish
export const togglePublish = async (req: Request, res: Response) => {
try{
    const userId= req.userId;
    if(!userId){
        return res.status(401).json({message: 'Unauthorized'});    
    }
  const projectId = req.params.projectId as string;
   const project = await prisma.websiteProject.findUnique({
    where:{id: projectId, userId}
   });
   if(!project){
    return res.status(404).json({message: 'Project not found'});
   }
   const updatedProject = await prisma.websiteProject.update({
    where:{id: projectId, userId},
    data:{ isPublished: !project.isPublished }
   });
    res.json({message: project.isPublished ? 'project Unpublished' : 'project Published'} )
}
catch(error: any){
   console.log(error.code|| error.message);
   res.status(500).json({message: error.message}) ;
}
}


//contoller  topublish credits
export const publishCredits = async (req: Request, res: Response) => {
try{
  const userId= req.userId;
    if(!userId){
        return res.status(401).json({message: 'Unauthorized'});    
    }
    const projectId = req.params.projectId as string;
    const project = await prisma.websiteProject.findUnique({
    where:{id: projectId, userId}
    });
    if(!project){
    return res.status(404).json({message: 'Project not found'});
    }
    await prisma.websiteProject.update({
    where:{id: projectId, userId},
    data:{ isPublished: true }
   });
   if(!project){
    return res.status(404).json({message: 'Project not found'});
   }
   await prisma.websiteProject.update({
    where:{id: projectId},
    data:{ isPublished: !project.isPublished }
   });
    res.json({message: project.isPublished? 'project Unpublished' : 'project Published'} )

}  catch(error: any){
   console.log(error.code|| error.message);
   res.status(500).json({message: error.message}) ;
}
}

export const purchaseCredits = async (req: Request, res: Response) => {
  try {
    interface Plan {
      credits: number;
      amount: number;
    }
    const plans = {
      basic: { credits: 100, amount: 5 },
      pro: { credits: 400, amount: 19 },
      enterprise: { credits: 1000, amount: 49 },
    };

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[Stripe] STRIPE_SECRET_KEY not configured');
      return res.status(500).json({ message: 'Payment system not configured' });
    }

    const { planId } = req.body as { planId: keyof typeof plans };
    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || process.env.BETTER_AUTH_URL?.replace('/api', '').replace(':3000', '') || 'https://ai-builderss.netlify.app';

    const plan: Plan = plans[planId];
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        planId,
        amount: plan.amount,
        credits: plan.credits,
      },
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    console.log(`[Stripe] Creating checkout session for user ${userId}, plan: ${planId}, origin: ${origin}`);

    try {
      const session = await stripe.checkout.sessions.create({
        success_url: `${origin}/loading`,
        cancel_url: `${origin}/pricing`,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `AISiteBuilder- ${plan.credits} credits`,
              },
              unit_amount: Math.floor(transaction.amount) * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          transactionId: transaction.id,
          appId: 'ai-site-builder',
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      });

      if (!session.url) {
        console.error('[Stripe] Session created but no URL returned');
        return res.status(500).json({ message: 'Stripe session URL not created' });
      }

      console.log(`[Stripe] Checkout session created successfully: ${session.id}`);
      return res.json({ payment_link: session.url });
    } catch (stripeError: any) {
      console.error('[Stripe] Stripe API Error:', {
        type: stripeError.type,
        message: stripeError.message,
        code: stripeError.code,
        statusCode: stripeError.statusCode,
        raw: stripeError.raw
      });
      return res.status(500).json({ 
        message: `Stripe Error: ${stripeError.message || 'Failed to create checkout session'}` 
      });
    }
  } catch (error: any) {
    console.error('[Stripe] Error creating checkout session:', error.message);
    return res.status(500).json({ message: error.message });
  }
};
