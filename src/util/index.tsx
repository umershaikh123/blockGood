import { BigNumber } from "ethers"

type CampaignProgressProps = {
  raisedValue: BigNumber
  goalValue: BigNumber
}

export const calculateCampaignProgress = ({
  raisedValue,
  goalValue,
}: CampaignProgressProps): number => {
  if (goalValue.isZero()) return 0

  const progress = raisedValue.mul(BigNumber.from(100)).div(goalValue)

  return progress.toNumber()
}
