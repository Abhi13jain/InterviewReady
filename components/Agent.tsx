

'use client'
import React, { use, useEffect } from 'react'
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';
import { toast } from 'sonner';
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
    interviewId?: string;
    questions?: string[];
    interviewer?: string;
}

const Agent = ({ userName, userId, type, interviewId, questions, interviewer }: AgentProps) => {
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

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        // Implement your feedback generation logic here
        console.log('Generate feedback here.');

        const { success, feedbackId } = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages,
        })
        if (success && feedbackId) {
            router.push(`/interview/${interviewId}/feedback`);
        }
        else {
            console.log('Error saving feedback');
        }
    }

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            if (type === 'generate') {
                router.push('/dashboard');
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [callStatus, type, messages, router]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        // Clear previous messages when starting a new call
        setMessages([]);

        // Check if VAPI token is available
        if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
            console.error("VAPI token not found");
            toast.error("VAPI configuration error. Please contact support.");
            setCallStatus(CallStatus.INACTIVE);
            return;
        }

        try {
            if (type === "generate") {
                await vapi.start(
                    process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
                    {
                        variableValues: {
                            username: userName,
                            userid: userId,
                        },
                        clientMessages: [],
                        serverMessages: [],
                    }
                );
            } else {
                let formattedQuestions = "";
                if (questions && questions.length > 0) {
                    formattedQuestions = questions
                        .map((question) => `- ${question}`)
                        .join("\n");
                    console.log("Formatted questions for VAPI:", formattedQuestions);
                } else {
                    console.error("No questions provided for interview");
                    toast.error("No interview questions available");
                    setCallStatus(CallStatus.INACTIVE);
                    return;
                }

                // Create a custom assistant with the questions embedded
                const customAssistant = {
                    name: "Interviewer",
                    firstMessage: "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
                    transcriber: {
                        provider: "deepgram",
                        model: "nova-2",
                        language: "en",
                    },
                    voice: {
                        provider: "11labs",
                        voiceId: "sarah",
                        stability: 0.4,
                        similarityBoost: 0.8,
                        speed: 0.9,
                        style: 0.5,
                        useSpeakerBoost: true,
                    },
                    model: {
                        provider: "openai",
                        model: "gpt-4",
                        messages: [
                            {
                                role: "system",
                                content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
${formattedQuestions}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate's questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.

- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`
                            }
                        ]
                    }
                };

                console.log("Starting VAPI with custom assistant");
                console.log("Questions embedded:", formattedQuestions);

                await vapi.start(customAssistant);
            }
        } catch (error) {
            console.error("VAPI start error:", error);
            toast.error("Failed to start interview. Please try again.");
            setCallStatus(CallStatus.INACTIVE);
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
                        <Image
                            src="/ai-avatar.png"
                            alt="AI Interviewer"
                            width={65}
                            height={54}
                            className="object-cover"
                            sizes="65px"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src="/user-avatar.png"
                            alt="User Avatar"
                            width={120}
                            height={120}
                            className="rounded-full object-cover size-[120px]"
                            sizes="120px"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript max-h-40 overflow-y-auto">
                        {messages.slice(-3).map((msg, idx) => (
                            <div key={`${msg.role}-${idx}-${Date.now()}`} className={cn('mb-2 p-2 rounded-lg',
                                msg.role === 'assistant' ? 'bg-blue-900/20' : 'bg-green-900/20',
                                'animate-fadeIn'
                            )}>
                                <strong className={cn(
                                    msg.role === 'assistant' ? 'text-blue-300' : 'text-green-300'
                                )}>
                                    {msg.role === 'assistant' ? 'AI: ' : 'You: '}
                                </strong>
                                <span className="text-white">{msg.content}</span>
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

