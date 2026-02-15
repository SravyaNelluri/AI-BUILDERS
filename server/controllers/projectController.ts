import  prisma from '../lib/prisma';
import openai from '../configs/openai';
import { Request, Response } from 'express';
import { version } from 'better-auth';

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

//controller function to make revision
export const makeRevision = async (req: Request, res: Response) => {
    const userId = req.userId;
try{
    const {projectId} = req.params as { projectId: string };
    const {message}= req.body;

       const user = await prisma.user.findUnique({
        where:{id: userId}, 
    });

    if(!userId || !user){
        return res.status(401).json({message: 'Unauthorized'});    
    }
    if(user.credits < 5){
    return res.status(403).json({message: 'add more credits to make changes'});
    }
    if(!message  || message.trim().length === 0){
    return res.status(403).json({message: ' please enter  a valid message'});
    }

    const currentProject = await prisma.websiteProject.findUnique({
        where:{id: projectId, userId},
        include: {versions: true}
    })
    if(!currentProject){
        return res.status(404).json({message: 'Project not found'});
    }

    await prisma.conversation.create({
      data:{
        role: 'user',
        content: message,
        projectId
      }
    });
    await prisma.user.update({
        where:{id: userId},
        data:{
            credits: { decrement: 5}
        }
    });

    //Enhance user prompt
        const promptEnhanceResponse = await runCompletion([
            {
                role:'system',
                content:`Enhance this website change request with specific design details. Be concise (1-2 sentences).`
            },
            {
                role:'user',
                content: `User's request: "${message}"`
            }
        ], 200)
    const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;
    await prisma.conversation.create({
        data:{
            role: 'assistant',
            content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
            projectId
        }
    })
    //Generate website code
    const codeGenerationResponse = await runCompletion([
            {
                role:'system',
                content:`Expert web developer. Update HTML with Tailwind CSS. Return complete HTML only.`
            },{
                role:'user',
                content:
`Here is the current website code: "${currentProject.
current_code}" The user wants this change: "${enhancedPrompt}"`
            }
        ], 2000) 
    const code = codeGenerationResponse.choices[0].message.content|| '';
if(!code){
await prisma.conversation.create({
data: {
role: 'assistant',
content: "Unable to generate the code",
projectId
}
})
await prisma.user.update({
where: {id: userId},
data: {credits: {increment: 5}}
})
return res.status(500).json({message: 'Unable to generate code, no changes made'});
}
    const version = await prisma.version.create({
       data:{ 
   code: code.replace(/```[a-z]*\n?/gi, '')
    .replace(/```$/gi, '')
    .trim(),
    description: 'Change made',
    projectId: currentProject.id
    }
    });
    await prisma.conversation.create({
       data: {
     role: 'assistant',
     content: 'Changes made successfully',
     projectId: currentProject.id
       }
    })
  await prisma.websiteProject.update({
where: {id: projectId as string},
data: {
current_code: code.replace(/```[a-z]*\n?/gi, '')
.replace(/```$/gi, '')
.trim(),
current_version_index: version.id

}
  })
    res.json({'message': 'Changes made successfully'} );
} catch (error :any )
 {
 await prisma.user.update({
where: {id: userId},
data: {credits: {increment: 5}}
})
console.log(error.code || error.message);
res.status(500).json({ message: error.message });
 }

}
//Controller Function to rollback to a  specific version
export const rollbackToVersion = async (req: Request, res: Response) => {
try {
const userId = req.userId;
const { projectId } = req.params as { projectId: string };
const { versionId } = req.body;

if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
}

const version = await prisma.version.findUnique({
    where: { id: versionId }
});

if (!version) {
    return res.status(404).json({ message: 'Version not found' });
}

await prisma.websiteProject.update({
    where: { id: projectId, userId },
    data: {
        current_code: version.code,
        current_version_index: version.id
    }
});

await prisma.conversation.create({
    data: {
        role: 'assistant',
        content: "I've rolled back your website to selected version. You can now preview it",
        projectId
    }
});

res.json({ message: 'Version rollback successful' });
} catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
}
}
  // Controller Function to Delete a Project
export const deleteProject = async (req: Request, res: Response) => {
try {
const userId = req.userId;
const { projectId } = req.params as { projectId: string };

await prisma.websiteProject.delete({
where: {id: projectId, userId},
})

res.json({ message: 'Project deleted successfully' });
} catch (error : any) {
console.log(error.code || error.message);
res.status(500).json({ message: error.message });
}
}
//Controller for getting project codefor preview

export const getProjectPreview = async (req: Request, res: Response) => {
try {
const userId = req.userId;
const { projectId } = req.params;
if(!userId){
    return res.status(401).json({message: 'Unauthorized'});
}
const project = await prisma.websiteProject.findFirst({
where: {id: projectId as string, userId},
include: {versions: true}
})
if(!project){
    return res.status(404).json({message: 'Project not found'});
}

res.json({ project });
} catch (error : any) {
console.log(error.code || error.message);
res.status(500).json({ message: error.message });
}
}
// Get published projects
export const getPublishedProjects = async (req: Request, res: Response) => {
try {

const projects = await prisma.websiteProject.findMany({
where: {isPublished: true},
include: {user: true}

})

res.json({ projects });
} catch (error : any) {
console.log(error.code || error.message);
res.status(500).json({ message: error.message });

}

}
// Get a single project by id
export const getProjectById = async (req: Request, res: Response) => {
try {
const { projectId } = req.params;

const project = await prisma.websiteProject.findFirst({
where: {id: projectId as string},

})
if(!project || project.isPublished === false || !project ?. current_code){
return res.status(404). json({ message: 'Project not found' });

}
res.json({code: project.current_code });
} catch (error : any) {
console.log(error.code || error.message);
res.status(500).json({ message: error.message });

}

}


// Controller to save project code
export const saveProjectCode = async (req: Request, res: Response) => {
try {
const userId = req.userId;
const { projectId } = req.params;
const {code} = req.body;

if(!userId){
return res.status(401).json({ message: 'Unauthorized' });
}
if(!code){
    return res.status(400).json({ message: 'Code is required' });
}
if(!projectId){
    return res.status(400).json({ message: 'Project not found' });
}
await prisma.websiteProject.update({
where: {id: projectId as string, userId},
data: {current_code: code}
})
res.json({message:'Project saved successfully' });
} catch (error : any) {
console.log(error.code || error.message);
res.status(500).json({ message: error.message });

}
}