import "server-only"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserProfile } from "@/components/user-profile/user-profile"
import { getGrantsForCategory } from "@/lib/data/grants"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import { VotingBar } from "./components/voting-bar"
import { VotingInput } from "./components/voting-input"

interface Props {
  params: {
    categoryId: string
  }
}

export default async function CategoryPage(props: Props) {
  const { categoryId } = props.params

  const grants = getGrantsForCategory(categoryId)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[350px]">Name</TableHead>
            <TableHead>Builders</TableHead>
            <TableHead className="text-center">Earned</TableHead>
            <TableHead className="text-center">Budget</TableHead>
            <TableHead className="text-center">Total Votes</TableHead>
            <TableHead className="text-center">Your Vote</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grants.map((grant) => (
            <TableRow key={grant.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-4">
                  <Image
                    alt={`${grant.title} image`}
                    className="rounded-lg object-cover"
                    height="48"
                    src={grant.imageUrl}
                    width="48"
                  />
                  <div className="shrink-0">
                    <h4 className="mb-1 text-[15px]">{grant.title}</h4>
                    {grant.isChallenged && (
                      <HoverCard openDelay={250}>
                        <HoverCardTrigger>
                          <Badge variant="warning">
                            <ExclamationTriangleIcon className="mr-1" />
                            Challenged
                          </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex space-x-1 whitespace-normal">
                            Remaining days + your vote + button
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-0.5">
                  {grant.users.map((user) => (
                    <UserProfile address={user} key={user}>
                      {(profile) => (
                        <Avatar className="size-7 bg-accent text-xs">
                          <AvatarImage
                            src={profile.pfp_url}
                            alt={profile.display_name}
                          />
                          <AvatarFallback>
                            {profile.display_name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </UserProfile>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-center">
                ${grant.earned.toLocaleString("en-US")}
              </TableCell>
              <TableCell className="text-center">
                <Badge>${grant.budget.toLocaleString("en-US")}/mo</Badge>
              </TableCell>
              <TableCell className="text-center">
                {grant.votes.toLocaleString("en-US")}
              </TableCell>

              <TableCell className="w-[100px] max-w-[100px] text-center">
                <VotingInput recipient={grant.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <VotingBar />
    </>
  )
}
