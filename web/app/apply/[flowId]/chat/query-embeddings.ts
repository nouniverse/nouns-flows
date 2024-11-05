"use server"

import { validTypes } from "@/lib/types/job"
import { z } from "zod"
import { generateEmbedding } from "./generate-embeddings"
import { embeddingsDb } from "@/lib/embedding-db/db"
import { embeddings } from "@/lib/embedding-db/schema"
import { sql, desc, cosineDistance, gt } from "drizzle-orm"

const embeddingQuerySchema = z.object({
  type: z.enum(validTypes as [string, ...string[]]),
  query: z.string().trim().min(10, "Substantial query is required"),
  groups: z.array(z.string().trim()),
  users: z.array(
    z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid user address"),
  ),
  tags: z.array(z.string().trim()),
})

export async function queryEmbeddings({
  type,
  query,
  groups,
  users,
  tags,
}: z.infer<typeof embeddingQuerySchema>) {
  try {
    const validation = embeddingQuerySchema.safeParse({
      type,
      query,
      groups,
      users,
      tags,
    })

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      throw new Error(Object.values(errors).flat().join(", "))
    }

    const embedding = await generateEmbedding(query)
    const vectorQuery = `[${embedding.join(",")}]`

    const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, vectorQuery)})`

    const results = await embeddingsDb
      .select({
        id: embeddings.id,
        content: embeddings.content,
        similarity,
      })
      .from(embeddings)
      .where(
        sql`${embeddings.type} = ${type} AND
        ${embeddings.groups} @> ${groups}::text[] AND
        ${embeddings.users} @> ${users}::text[] AND
        ${embeddings.tags} @> ${tags}::text[] AND
        ${gt(similarity, 0.5)}`,
      )
      .orderBy(desc(similarity))
      .limit(5)

    return results
  } catch (error) {
    console.error(error)
    return (error as Error).message
  }
}