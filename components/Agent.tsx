// 'use client'
// import React, { use, useEffect } from 'react'
// import Image from 'next/image';
// import { cn } from '@/lib/utils';
// import { useRouter } from 'next/navigation';
// import { vapi } from '@/lib/vapi.sdk';
// enum CallStatus {
//     INACTIVE = 'INACTIVE',
//     CONNECTING = 'CONNECTING',
//     ACTIVE = 'ACTIVE',
//     FINISHED = 'FINISHED',
// }
// interface SavedMessage {
//     role: 'user' | 'system' | 'assistant';
//     content: string;
// }
// interface AgentProps {
//     userName: string;
//     userId: string;
//     type: string;
//     questions?: string[];
//     interviewer?: string;
// }

// const Agent = ({ userName, userId, type, questions, interviewer }: AgentProps) => {
//     const router = useRouter();
//     const [isSpeaking, setIsSpeaking] = React.useState(false);
//     const [callStatus, setCallStatus] = React.useState<CallStatus>(CallStatus.INACTIVE);

//     const [messages, setMessages] = React.useState<SavedMessage[]>([]);

//     useEffect(() => {
//         const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
//         const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

//         const onMessage = (message: Message) => {
//             if (message.type === 'transcript' && message.transcriptType === 'final') {

//                 const newMessage = { role: message.role, content: message.transcript }
//                 setMessages((prev) => [...prev, newMessage]);
//             }
//         }
//         const onSpeechStart = () => setIsSpeaking(true);
//         const onSpeechEnd = () => setIsSpeaking(false);

//         const onError = (error: Error) => {
//             console.error('Error occurred:', error);
//         }

//         vapi.on('call-start', onCallStart);
//         vapi.on('call-end', onCallEnd);
//         vapi.on('message', onMessage);
//         vapi.on('speech-start', onSpeechStart);
//         vapi.on('speech-end', onSpeechEnd);
//         vapi.on('error', onError);
//         return () => {
//             vapi.off('call-start', onCallStart);
//             vapi.off('call-end', onCallEnd);
//             vapi.off('message', onMessage);
//             vapi.off('speech-start', onSpeechStart);
//             vapi.off('speech-end', onSpeechEnd);
//             vapi.off('error', onError);
//         }
//     }, []);
//     useEffect(() => {
//         if (callStatus === CallStatus.FINISHED) router.push('/');
//     }, [messages, callStatus, type, userId]);

//     const handleCall = async () => {
//         setCallStatus(CallStatus.CONNECTING);

//         if (type === "generate") {
//             await vapi.start(
//                 process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
//                 {
//                     variableValues: {
//                         username: userName,
//                         userid: userId,
//                     },
//                     clientMessages: [],
//                     serverMessages: [],
//                 }
//             );
//         } else {
//             let formattedQuestions = "";
//             if (questions) {
//                 formattedQuestions = questions
//                     .map((question) => `- ${question}`)
//                     .join("\n");
//             }

//             await vapi.start(interviewer, {
//                 variableValues: {
//                     questions: formattedQuestions,
//                 },
//                 clientMessages: [],
//                 serverMessages: [],
//             });
//         }
//     };
//     const handleDisconnect = async () => {
//         setCallStatus(CallStatus.FINISHED);
//         vapi.stop();
//     }
//     const latestMessage = messages[messages.length - 1]?.content;
//     const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
//     return (
//         <>
//             <div className="call-view">
//                 <div className="card-interviewer">
//                     <div className="avatar">
//                         <Image src="/ai-avatar.png" alt="vapi" width={65}
//                             height={54} className="object-cover" />
//                         {isSpeaking && <span className="animate-speak" />}
//                     </div>
//                     <h3>AI Interviewer</h3>
//                 </div>
//                 <div className="card-border">
//                     <div className="card-content">
//                         <Image src="/user-avatar.png" alt="user avatar" width={540} height={540} className="rounded-full object-cover size-[120px]" />
//                         <h3>{userName}</h3>
//                     </div>
//                 </div>
//             </div>
//             {messages.length > 0 && (
//                 <div className="transcript-border">
//                     <div className="transcript">
//                         {messages.map((msg, idx) => (
//                             <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
//                                 {latestMessage}
//                             </p>
//                         ))}
//                     </div>
//                 </div>
//             )}
//             <div className="w-full flex justify-center">
//                 {callStatus !== 'ACTIVE' ? (
//                     <button className="relative btn-call" onClick={handleCall}>
//                         <span className={cn('absolute animate-ping rouded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')} />
//                         <span>
//                             {isCallInactiveOrFinished ? 'Call' : '. . .'}
//                         </span>
//                     </button>
//                 ) : (
//                     <button className="btn-disconnect" onClick={handleDisconnect}>
//                         End
//                     </button>
//                 )}
//             </div>
//         </>
//     )
// }
// export default Agent;


'use client'
import React, { use, useEffect } from 'react'
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

// Add the Message type definition
interface Message {
    type: string;
    transcriptType?: string;
    role: 'user' | 'system' | 'assistant';
    transcript: string;
}

interface AgentProps {
    userName: string;
    userId: string;
    type: string;
    questions?: string[];
    interviewer?: string;
}

const Agent = ({ userName, userId, type, questions, interviewer }: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = React.useState(false);
    const [callStatus, setCallStatus] = React.useState<CallStatus>(CallStatus.INACTIVE);

    const [messages, setMessages] = React.useState<SavedMessage[]>([]);

    // Debug: Log messages state changes
    useEffect(() => {
        console.log('🔄 Messages state updated:', messages);
    }, [messages]);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: any) => {
            console.log('📨 Received message:', message);
            console.log('📨 Message type:', message.type);
            console.log('📨 Message transcript type:', message.transcriptType);

            // Handle different message types that VAPI might send
            if (message.type === 'transcript') {
                if (message.transcriptType === 'final') {
                    console.log('✅ Adding final transcript:', message.transcript);
                    const newMessage = { role: message.role as 'user' | 'system' | 'assistant', content: message.transcript }
                    setMessages((prev) => {
                        const updated = [...prev, newMessage];
                        console.log('💾 Updated messages:', updated);
                        return updated;
                    });
                } else if (message.transcriptType === 'partial') {
                    console.log('⏳ Partial transcript (not adding):', message.transcript);
                }
            }

            // Also check for other possible message structures
            if (message.transcript && !message.type) {
                console.log('📝 Direct transcript message:', message.transcript);
                const newMessage = { role: (message.role === 'user' || message.role === 'system' || message.role === 'assistant' ? message.role : 'user') as 'user' | 'system' | 'assistant', content: message.transcript }
                setMessages((prev) => [
                    ...prev,
                    {
                        role: (message.role === 'user' || message.role === 'system' || message.role === 'assistant'
                            ? message.role
                            : 'user') as 'user' | 'system' | 'assistant',
                        content: message.transcript
                    }
                ]);
            }

            // Check if it's a different structure
            if (message.body && typeof message.body === 'string') {
                console.log('📄 Body message:', message.body);
                const newMessage = { role: 'assistant', content: message.body }
                setMessages((prev) => [
                    ...prev,
                    {
                        role: (message.role === 'user' || message.role === 'system' || message.role === 'assistant'
                            ? message.role
                            : 'user') as 'user' | 'system' | 'assistant',
                        content: message.transcript
                    }
                ]);
            }
        }
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => {
            console.error('Error occurred:', error);
        }

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);
        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        }
    }, []);

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) router.push('/');
    }, [messages, callStatus, type, userId, router]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === "generate") {
            await vapi.start(
                process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
                {
                    variableValues: {
                        username: userName,
                        userid: userId,
                    },

                }
            );
        } else {
            let formattedQuestions = "";
            if (questions) {
                formattedQuestions = questions
                    .map((question) => `- ${question}`)
                    .join("\n");
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions,
                },

            });
        }
    };

    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }

    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src="/ai-avatar.png" alt="vapi" width={65}
                            height={54} className="object-cover" />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className="card-border">
                    <div className="card-content">
                        <Image src="/user-avatar.png" alt="user avatar" width={540} height={540} className="rounded-full object-cover size-[120px]" />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                                <strong>{msg.role === 'assistant' ? 'AI: ' : 'You: '}</strong>
                                {msg.content}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="w-full flex justify-center">
                {callStatus !== 'ACTIVE' ? (
                    <button className="relative btn-call" onClick={handleCall}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')} />
                        <span>
                            {isCallInactiveOrFinished ? 'Call' : '. . .'}
                        </span>
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent;

