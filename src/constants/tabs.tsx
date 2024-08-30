import { CampaignCard } from "../Components/Common/Card"
import { CampaignCardContainer } from "../Components/Common/Card"
import { campaignsList } from "./campaigns"
const OrganizationsTabContent = () => <div>Organizations Content Goes Here</div>
const IndividualsTabContent = () => <div>Individuals Content Goes Here</div>

export const tabsProps = [
  {
    label: "All",
    value: "all",
    component: <CampaignCardContainer campaignsList={campaignsList} />,
  },
  {
    label: "Organizations",
    value: "organizations",
    component: <OrganizationsTabContent />,
  },
  {
    label: "Individuals",
    value: "individuals",
    component: <IndividualsTabContent />,
  },
]
