import { useQuery, gql } from "@apollo/client"

export const GET_CAMPAIGN_IDS = gql`
  query MyQuery {
    DonationTracker_CampaignCreated {
      campaignId
      creator
      id
    }
  }
`

export const GET_DONATION_RECIEVED = gql`
  query MyQuery {
    DonationTracker_DonationReceived {
      amount
      campaignId
      db_write_timestamp
      donor
    }
  }
`

export const GET_PROOF_UPLOADED = gql`
  query MyQuery {
    DonationTracker_ProofUploaded {
      campaignId
      id
      proofUrl
      withdrawalId
    }
  }
`
