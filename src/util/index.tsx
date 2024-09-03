import { BigNumber } from "ethers"

type CampaignProgressProps = {
  raisedValue: BigNumber
  goalValue: BigNumber
}

export const calculateCampaignProgress = ({
  raisedValue,
  goalValue,
}: CampaignProgressProps): number => {
  // Ensure goalValue is not zero to avoid division by zero
  if (goalValue.isZero()) return 0

  // Calculate progress percentage using BigNumber
  const progress = raisedValue.mul(BigNumber.from(100)).div(goalValue)

  // Convert BigNumber to a regular number
  return progress.toNumber()
}
