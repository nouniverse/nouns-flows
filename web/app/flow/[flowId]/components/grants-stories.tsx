import "server-only"

import { StoryCard } from "@/app/components/story-card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { DateTime } from "@/components/ui/date-time"
import { UserProfile } from "@/components/user-profile/user-profile"
import database from "@/lib/database/edge"
import { Story } from "@prisma/flows"
import Image from "next/image"
import Link from "next/link"
import { getPinataWithKey } from "@/lib/pinata/url-with-key"

interface Props {
  flowId: string
}

export async function GrantsStories(props: Props) {
  const { flowId } = props

  const stories = await database.story.findMany({
    where: { complete: true, header_image: { not: null }, parent_flow_ids: { has: flowId } },
    orderBy: { updated_at: "desc" },
    take: 11,
  })

  if (stories.length === 0) return null

  const [featuredStory, ...remainingStories] = stories

  return (
    <div className="mt-10 grid grid-cols-1 gap-2.5 md:grid-cols-4">
      {featuredStory && <FeaturedStoryCard story={featuredStory} />}
      {remainingStories.map((story) => (
        <StoryCard story={story} key={story.id} />
      ))}
    </div>
  )
}

function FeaturedStoryCard(props: { story: Story }) {
  const { header_image, title, tagline, updated_at, id, author } = props.story

  return (
    <div className="group relative isolate flex flex-col justify-between overflow-hidden rounded-xl shadow dark:border md:col-span-2">
      {header_image && (
        <div className="pointer-events-none absolute inset-0 -z-10 size-full overflow-hidden">
          <Image
            src={getPinataWithKey(header_image)}
            alt={title}
            className="size-full object-cover transition-transform group-hover:scale-110"
            width={674}
            height={328}
          />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />

      <div className="flex items-center justify-between space-x-1.5 p-4 md:p-6">
        <UserProfile address={author as `0x${string}`}>
          {(profile) => (
            <div className="flex items-center gap-2">
              <Avatar className="size-5">
                <AvatarImage src={profile.pfp_url} alt={profile.display_name} />
              </Avatar>
              <span className="text-sm text-white">{profile.display_name}</span>
            </div>
          )}
        </UserProfile>
        <p className="text-sm text-white">
          <DateTime date={updated_at} relative short />
        </p>
      </div>

      <div className="p-4 pt-32 md:p-6">
        <Link
          href={`/story/${id}`}
          className="text-base font-semibold leading-snug group-hover:text-primary"
        >
          <h3 className="text-lg font-medium leading-tight text-white md:text-xl">{title}</h3>
          <span className="absolute inset-0" />
        </Link>
        <p className="mt-1.5 text-sm text-white/80">{tagline}</p>
      </div>
    </div>
  )
}