import assert from "assert";
import { 
  TestHelpers,
  Donationtracker_CampaignCreated
} from "generated";
const { MockDb, Donationtracker } = TestHelpers;

describe("Donationtracker contract CampaignCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Donationtracker contract CampaignCreated event
  const event = Donationtracker.CampaignCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Donationtracker_CampaignCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Donationtracker.CampaignCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualDonationtrackerCampaignCreated = mockDbUpdated.entities.Donationtracker_CampaignCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedDonationtrackerCampaignCreated: Donationtracker_CampaignCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      campaignId: event.params.campaignId,
      creator: event.params.creator,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualDonationtrackerCampaignCreated, expectedDonationtrackerCampaignCreated, "Actual DonationtrackerCampaignCreated should be the same as the expectedDonationtrackerCampaignCreated");
  });
});
