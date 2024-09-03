/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  DonationTracker,
  DonationTracker_CampaignCreated,
  DonationTracker_CampaignEnded,
  DonationTracker_DonationReceived,
  DonationTracker_ProofUploaded,
  DonationTracker_WithdrawalMade,
} from "generated";

DonationTracker.CampaignCreated.handler(async ({ event, context }) => {
  const entity: DonationTracker_CampaignCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    creator: event.params.creator,
  };

  context.DonationTracker_CampaignCreated.set(entity);
});


DonationTracker.CampaignEnded.handler(async ({ event, context }) => {
  const entity: DonationTracker_CampaignEnded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    creator: event.params.creator,
    refundedFee: event.params.refundedFee,
  };

  context.DonationTracker_CampaignEnded.set(entity);
});


DonationTracker.DonationReceived.handler(async ({ event, context }) => {
  const entity: DonationTracker_DonationReceived = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    donor: event.params.donor,
    amount: event.params.amount,
  };

  context.DonationTracker_DonationReceived.set(entity);
});


DonationTracker.ProofUploaded.handler(async ({ event, context }) => {
  const entity: DonationTracker_ProofUploaded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    withdrawalId: event.params.withdrawalId,
    proofUrl: event.params.proofUrl,
  };

  context.DonationTracker_ProofUploaded.set(entity);
});


DonationTracker.WithdrawalMade.handler(async ({ event, context }) => {
  const entity: DonationTracker_WithdrawalMade = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    admin: event.params.admin,
    amount: event.params.amount,
  };

  context.DonationTracker_WithdrawalMade.set(entity);
});

