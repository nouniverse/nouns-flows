import { Schema } from "@/generated"
import { postToEmbeddingsQueueRequest } from "../../queue/queue"
import { JobBody } from "../../queue/job"
import { getNonzeroLowercasedAddresses } from "../../queue/helpers"
import { deleteEmbeddingRequest } from "../../queue/queue"
import { getContentHash } from "../../hash"
import { cleanTextForEmbedding } from "../../clean"

export async function addApplicationEmbedding(grant: Schema["Grant"]) {
  const users = getNonzeroLowercasedAddresses([grant.recipient, grant.submitter])

  const content = getApplicationContent(grant)

  const payload: JobBody = {
    type: "grant-application",
    content,
    groups: ["nouns"],
    users,
    tags: ["flows"],
  }

  await postToEmbeddingsQueueRequest(payload)
}

export async function removeApplicationEmbedding(grant: Schema["Grant"]) {
  const content = getApplicationContent(grant)
  const contentHash = getContentHash(content, "grant-application")
  await deleteEmbeddingRequest(contentHash, "grant-application")
}

const getApplicationContent = (grant: Schema["Grant"]) => {
  const cleanedGrant = cleanTextForEmbedding(JSON.stringify(grant))
  return `this is a grant application submitted by ${grant.submitter.toLowerCase()} for ${grant.recipient.toLowerCase()}. here is the grant application data: ${cleanedGrant}`
}