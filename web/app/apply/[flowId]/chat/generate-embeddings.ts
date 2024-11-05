"use server"

import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
})

export async function generateEmbedding(content: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content.replace("\n", " "),
    })

    return response.data[0].embedding
  } catch (error) {
    console.error(error)
    throw new Error((error as Error).message || "Failed to generate embedding")
  }
}
