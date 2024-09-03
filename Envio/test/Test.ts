import assert from "assert";
import { 
  TestHelpers,
  DonationTracker_CampaignCreated
} from "generated";
const { MockDb, DonationTracker } = TestHelpers;

describe("DonationTracker contract CampaignCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for DonationTracker contract CampaignCreated event
  const event = DonationTracker.CampaignCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("DonationTracker_CampaignCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await DonationTracker.CampaignCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualDonationTrackerCampaignCreated = mockDbUpdated.entities.DonationTracker_CampaignCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedDonationTrackerCampaignCreated: DonationTracker_CampaignCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      campaignId: event.params.campaignId,
      creator: event.params.creator,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualDonationTrackerCampaignCreated, expectedDonationTrackerCampaignCreated, "Actual DonationTrackerCampaignCreated should be the same as the expectedDonationTrackerCampaignCreated");
  });
});
