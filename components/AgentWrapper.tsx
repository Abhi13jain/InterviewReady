'use client';

import React, { Suspense, lazy } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const Agent = lazy(() => import('@/components/Agent'));

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
