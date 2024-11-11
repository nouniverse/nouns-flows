import { farcasterDb } from "@/lib/database/farcaster"

export const getFarcasterUserByEthAddress = async (address: `0x${string}`) => {
  try {
    const users = await getFarcasterUsersByEthAddress(address)
    if (!users || users.length === 0) return null

    return users[0]
  } catch (e: any) {
    console.error(e?.message)
    return null
  }
}

export const getFarcasterUsersByEthAddress = async (rawAddress: `0x${string}`) => {
  try {
    const address = rawAddress.toLowerCase()

    const users = await farcasterDb.profile.findMany({
      where: {
        verified_addresses: {
          has: address,
        },
      },
      cacheStrategy: { swr: 3600 },
    })

    return users
  } catch (e: any) {
    console.error(e?.message)
    return []
  }
}

export const getFarcasterUsersByEthAddresses = async (addresses: `0x${string}`[]) => {
  try {
    const lowerAddresses = addresses.map((addr) => addr.toLowerCase())

    const users = await farcasterDb.profile.findMany({
      where: {
        verified_addresses: {
          hasSome: lowerAddresses,
        },
      },
      cacheStrategy: { swr: 3600 },
    })

    return users
  } catch (e: any) {
    console.error(e?.message)
    return []
  }
}

// get by fids
export const getFarcasterUsersByFids = async (fids: bigint[]) => {
  try {
    const users = await farcasterDb.profile.findMany({
      where: { fid: { in: fids } },
      cacheStrategy: { swr: 3600 },
    })

    return users
  } catch (e: any) {
    console.error(e?.message)
    return []
  }
}
