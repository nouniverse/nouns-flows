import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Currency } from "@/components/ui/currency"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Markdown } from "@/components/ui/markdown"
import { FlowWithGrants } from "@/lib/database/queries/flow"
import { cn, explorerUrl, getEthAddress, getIpfsUrl } from "@/lib/utils"
import Image from "next/image"
import { FlowHeaderUserVotes } from "./flow-header-user-votes"
import { GrantStatusCountBadges } from "@/components/ui/grant-status-count-badges"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { base } from "viem/chains"

interface Props {
  flow: FlowWithGrants
}

export const FlowHeader = (props: Props) => {
  const { flow } = props

  return (
    <Card>
      <CardContent className="flex flex-col items-start justify-between space-y-4 p-4 md:flex-row md:items-center md:space-x-4 md:space-y-0 md:p-6">
        <div className="flex flex-col text-left md:flex-row md:items-center md:space-x-4">
          <Image
            src={getIpfsUrl(flow.image)}
            alt={flow.title}
            className="mb-2 size-16 rounded-lg object-cover md:mb-0 md:size-20"
            height="80"
            width="80"
          />
          <div>
            <CardTitle className="text-base font-bold md:text-xl">{flow.title}</CardTitle>
            <CardDescription className="text-sm">{flow.tagline}</CardDescription>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" size="sm" className="p-0">
                  Read more
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-screen-sm">
                <DialogHeader>
                  <DialogTitle>{flow.title}</DialogTitle>
                  <DialogDescription>{flow.tagline}</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4 text-sm text-muted-foreground md:text-base">
                  <Markdown>{flow.description}</Markdown>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div
          className={cn("grid w-full gap-x-4 gap-y-8 text-sm md:w-auto md:shrink-0", {
            "grid-cols-2 md:grid-cols-2": flow.isTopLevel,
            "grid-cols-2 md:grid-cols-4": !flow.isTopLevel,
          })}
        >
          <div className="md:text-center">
            <p className="mb-1.5 text-muted-foreground">Flows</p>
            <GrantStatusCountBadges
              challengedCount={flow.subgrants.filter((g) => g.isDisputed && !g.isActive).length}
              awaitingCount={
                flow.subgrants.filter((g) => !g.isActive && !g.isDisputed && !g.isResolved).length
              }
              approvedCount={flow.subgrants.filter((g) => g.isActive).length}
            />
          </div>
          <div className="md:text-center">
            <p className="mb-1.5 text-muted-foreground">Budget</p>
            <Popover>
              <PopoverTrigger asChild>
                <Badge className="cursor-help">
                  <Currency>
                    {/* If flow is paying grants, show payment amount. If no grants, flow hasn't been spent, and should show incoming flow rate. */}
                    {flow.subgrants.length > 0
                      ? flow.monthlyOutgoingFlowRate
                      : flow.monthlyIncomingFlowRate}
                  </Currency>{" "}
                  /mo
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2">
                {!flow.isTopLevel && (
                  <p className="text-sm">
                    <Currency>{flow.monthlyIncomingFlowRate || 0}</Currency>/month incoming flow.
                  </p>
                )}
                <p className="text-sm">
                  <Currency>{flow.monthlyOutgoingFlowRate || 0}</Currency>/month outgoing flow.
                </p>
                <p className="text-sm">
                  <Currency>{flow.monthlyRewardPoolFlowRate || 0}</Currency>/month goes to curators
                  ({flow.managerRewardPoolFlowRatePercent / 1e4}%)
                </p>
                <Link
                  className="text-sm underline"
                  href={explorerUrl(flow.recipient, base.id, "address")}
                  target="_blank"
                >
                  View on Etherscan
                </Link>
              </PopoverContent>
            </Popover>
          </div>
          {!flow.isTopLevel && (
            <>
              <div className="md:text-center">
                <p className="mb-1.5 text-muted-foreground">Total Votes</p>
                <p className="font-medium">{flow.votesCount} </p>
              </div>

              <FlowHeaderUserVotes
                parent={getEthAddress(flow.parentContract)}
                recipientId={flow.id}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
