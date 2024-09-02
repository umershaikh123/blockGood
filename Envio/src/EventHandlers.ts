/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */

import {
  Donationtracker,
  Donationtracker_CampaignCreated,
  Donationtracker_CampaignEnded,
  Donationtracker_DonationReceived,
  Donationtracker_ProofUploaded,
  Donationtracker_WithdrawalMade,
  //@ts-ignore
} from "generated"

Donationtracker.CampaignCreated.handler(async ({ event, context }: any) => {
  const entity: Donationtracker_CampaignCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    creator: event.params.creator,
  }

  context.Donationtracker_CampaignCreated.set(entity)
})

Donationtracker.CampaignEnded.handler(async ({ event, context }: any) => {
  const entity: Donationtracker_CampaignEnded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    creator: event.params.creator,
    refundedFee: event.params.refundedFee,
  }

  context.Donationtracker_CampaignEnded.set(entity)
})

Donationtracker.DonationReceived.handler(async ({ event, context }: any) => {
  const entity: Donationtracker_DonationReceived = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    donor: event.params.donor,
    amount: event.params.amount,
  }

  context.Donationtracker_DonationReceived.set(entity)
})

Donationtracker.ProofUploaded.handler(async ({ event, context }: any) => {
  const entity: Donationtracker_ProofUploaded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    withdrawalId: event.params.withdrawalId,
    proofUrl: event.params.proofUrl,
  }

  context.Donationtracker_ProofUploaded.set(entity)
})

Donationtracker.WithdrawalMade.handler(async ({ event, context }: any) => {
  const entity: Donationtracker_WithdrawalMade = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    campaignId: event.params.campaignId,
    admin: event.params.admin,
    amount: event.params.amount,
  }

  context.Donationtracker_WithdrawalMade.set(entity)
})
