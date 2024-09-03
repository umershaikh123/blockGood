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
