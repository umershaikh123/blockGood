const AllTabContent = () => <div>All Content Goes Here</div>
const OrganizationsTabContent = () => <div>Organizations Content Goes Here</div>
const IndividualsTabContent = () => <div>Individuals Content Goes Here</div>

export const tabsProps = [
  { label: "All", value: "all", component: <AllTabContent /> },
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
