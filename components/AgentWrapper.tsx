'use client';

import dynamic from "next/dynamic";
import LoadingSpinner from '@/components/LoadingSpinner';

const Agent = dynamic(() => import("@/components/Agent"), {
    loading: () => <div className="flex items-center justify-center min-h-96"><LoadingSpinner size="lg" /></div>,
    ssr: false
});

interface AgentWrapperProps {
    userName: string;
    userId: string;
    interviewId: string;
    type: string;
    questions: string[];
}

export default function AgentWrapper(props: AgentWrapperProps) {
    return <Agent {...props} />;
}
