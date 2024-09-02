export const organizationData: Record<
  string,
  {
    name: string
    taxId: string
    physicalAddress: string
    phoneNumber: string
    email: string
    website: string
    socialMedia: string
    registrationProof: string
    registered: boolean
    campaignIds: number[]
  }
> = {
  "0x8a770B7700f941Bb2E6Dd023AD3B22c2c41C5901": {
    name: "Umer",
    taxId: "",
    physicalAddress: "",
    phoneNumber: "",
    email: "",
    website: "",
    socialMedia: "",
    registrationProof: "",
    registered: false,
    campaignIds: [1, 2, 3],
  },

  "0xE4Cb6F91Cf8748F3FD0c9D281157b276DD437609": {
    name: "Ritik",
    taxId: "",
    physicalAddress: "",
    phoneNumber: "",
    email: "",
    website: "",
    socialMedia: "",
    registrationProof: "",
    registered: false,
    campaignIds: [4],
  },
}

export const IndividualData: Record<
  string,
  {
    fullName: string
    age: number
    addressDetail: string
    medicalCondition: string
    requiredTreatment: string
    timeline: string
    email: string
    phoneNumber: string
    campaignId: number
  }
> = {
  "0x8a770B7700f941Bb2E6Dd023AD3B22c2c41C5901": {
    fullName: "",
    age: 22,
    addressDetail: "",
    medicalCondition: "",
    requiredTreatment: "",
    timeline: "",
    email: "",
    phoneNumber: "",
    campaignId: 1,
  },

  "0xE4Cb6F91Cf8748F3FD0c9D281157b276DD437609": {
    fullName: "",
    age: 20,
    addressDetail: "",
    medicalCondition: "",
    requiredTreatment: "",
    timeline: "",
    email: "",
    phoneNumber: "",
    campaignId: 3,
  },
}
// struct Withdrawal {
//     uint256 amount;
//     address admin;
//     string reason;
//     uint256 timestamp;
//     string proofUrl;
//     bool proofUploaded;
// }
