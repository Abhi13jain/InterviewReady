import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import React, { Suspense } from 'react'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import { getCurrentUser } from '@/lib/actions/auth.action'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorBoundary from '@/components/ErrorBoundary'
import { redirect } from 'next/navigation'

const DashboardPage = async () => {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect('/sign-up');
  }

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user.id).catch(() => []),
    getLatestInterviews({ userId: user.id }).catch(() => [])
  ]);

  const hasPastInterviews = userInterviews && userInterviews.length > 0;
  const hasUpcomingInterviews = latestInterviews && latestInterviews.length > 0;
  return (
    <ErrorBoundary>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">Practice on real Interview questions & get instant feedback</p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
          priority
          sizes="(max-width: 768px) 0px, 400px"
        />
      </section>

      <Suspense fallback={
        <section className="flex flex-col gap-6 mt-8">
          <h2>Your Interviews</h2>
          <div className="flex items-center justify-center min-h-32">
            <LoadingSpinner size="lg" />
          </div>
        </section>
      }>
        <section className="flex flex-col gap-6 mt-8">
          <h2>Your Interviews</h2>
          <div className="interviews-section">
            {
              hasPastInterviews ? (
                userInterviews?.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    id={interview.id}
                    userId={interview.userId}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (<p>No past interviews found</p>)
            }
          </div>
        </section>
      </Suspense>

      <Suspense fallback={
        <section className="flex flex-col gap-6 mt-8">
          <h2>Take an Interview</h2>
          <div className="flex items-center justify-center min-h-32">
            <LoadingSpinner size="lg" />
          </div>
        </section>
      }>
        <section className="flex flex-col gap-6 mt-8">
          <h2>Take an Interview</h2>
          <div className="interviews-section">
            {
              hasUpcomingInterviews ? (
                latestInterviews?.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    id={interview.id}
                    userId={interview.userId}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (<p>There are no upcoming interviews available</p>)
            }
          </div>
        </section>
      </Suspense>
    </ErrorBoundary>
  )
}
export default DashboardPage