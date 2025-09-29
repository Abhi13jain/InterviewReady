import { getInterviewById } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Image from "next/image";
import DisplayTechnicalIcons from "@/components/DisplayTechnicalIcons";
import { getCurrentUser } from "@/lib/actions/auth.action";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import AgentWrapper from "@/components/AgentWrapper";
const Page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();
    const interview = await getInterviewById(id);
    
    if (!interview) redirect('/dashboard');
    
    // Debug logging
    console.log("Interview data:", interview);
    console.log("Interview questions:", interview.questions);
    return (
        <ErrorBoundary>
            <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className="flex flex-row gap-4 items-center">
                        <Image
                            src={getRandomInterviewCover()}
                            alt="Interview cover"
                            width={40}
                            height={40}
                            className="rounded-full object-cover size-[40px]"
                            sizes="40px"
                        />
                        <h3 className="capitalize">{interview.role} Interview</h3>
                    </div>
                    <Suspense fallback={<LoadingSpinner size="sm" />}>
                        <DisplayTechnicalIcons techStack={interview.techstack} />
                    </Suspense>
                </div>
                <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">{interview.type}</p>
            </div>
            <AgentWrapper userName={user?.name ?? ""} userId={user?.id ?? ""} interviewId={id} type="interview" questions={interview.questions} />
        </ErrorBoundary>
    )

}
export default Page;