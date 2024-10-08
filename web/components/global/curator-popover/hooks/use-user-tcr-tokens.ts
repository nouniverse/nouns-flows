"use client"

import { getEthAddress } from "@/lib/utils"
import useSWR from "swr"
import { getUserTcrTokens } from "./get-user-tcr-tokens"
import { useUserTotalRewardsBalance } from "./use-user-total-rewards-balance"

export function useUserTcrTokens(address: string | undefined) {
  const { data, ...rest } = useSWR(address ? `${address}_tcr_tokens` : null, () =>
    getUserTcrTokens(getEthAddress(address!!.toLowerCase())),
  )

  const { totalRewardsBalance } = useUserTotalRewardsBalance(
    data?.map((token) => token.flow.managerRewardPool) || [],
    address,
  )

  return {
    tokens: data || [],
    totalBalance: data?.reduce((acc, token) => acc + BigInt(token.amount), BigInt(0)),
    totalRewardsBalance,
    ...rest,
  }
}