import { cn, getTechLogos } from '@/lib/utils'
import React from 'react'
import Image from 'next/image'
import { cache } from 'react'

const getCachedTechLogos = cache(async (techStack: string[]) => {
    return await getTechLogos(techStack);
});

const DisplayTechnicalIcons = async ({ techStack }: TechIconProps) => {
    const techIcons = await getCachedTechLogos(techStack);
    return (
        <div className="flex flex-row">{techIcons.slice(0, 3).map(({ tech, url }, index) => (
            <div key={tech} className={cn("relative group bg-dark-300 rounded-full p-2 flex-center", index >= 1 && 'ml-0')}>
                <span className="tech-tooltip">{tech}</span>
                <Image
                    src={url}
                    alt={tech}
                    width={20}
                    height={20}
                    className="size-5"
                    sizes="20px"
                />
            </div>
        ))}</div>
    )
}
export default DisplayTechnicalIcons