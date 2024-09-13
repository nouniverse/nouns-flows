import { ponder, type Context, type Event } from "@/generated";

ponder.on("NounsFlow:VoteCast", handleVoteCast);
ponder.on("NounsFlowChildren:VoteCast", handleVoteCast);

async function handleVoteCast(params: {
  event: Event<"NounsFlow:VoteCast">;
  context: Context<"NounsFlow:VoteCast">;
}) {
  const { event, context } = params;
  const { Vote } = context.db;
  const { recipientId, tokenId, bps, totalUnits } = event.args;

  const blockNumber = event.block.number.toString();
  const voter = event.transaction.from.toLowerCase();
  const contract = event.log.address.toLowerCase();
  // const votesCount = totalUnits / bps;

  await Vote.create({
    id: `${contract}_${recipientId}_${voter}_${blockNumber}`,
    data: {
      contract,
      recipientId: recipientId.toString(),
      tokenId: tokenId.toString(),
      bps: bps.toString(),
      totalUnits: totalUnits.toString(),
      voter,
      blockNumber,
    },
  });
}
