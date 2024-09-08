import React from "react"
import { ThreeDots } from "react-loader-spinner"
export interface DetailProps {
  description: string
  isIndividual: boolean
  individualData?: Individual
  OrganizationData?: Organization
  loading: boolean
}

interface Organization {
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

interface Individual {
  fullName: string
  age: number
  addressDetail: string
  goal: string
  required: string
  timeline: string
  email: string
  phoneNumber: string
  campaignId: number
}

const DetailItem = ({
  label,
  value,
  isImage = false,
}: {
  label: string
  value: string
  isImage?: boolean
}) => (
  <div className="mb-2">
    <h3 className="text-lg font-medium text-[var(--primary)]">{label}:</h3>
    {isImage ? (
      <img
        src={value}
        alt={label}
        className="w-full h-auto mt-2 rounded-lg shadow-md cursor-pointer"
      />
    ) : (
      <p className="text-[var(--secondary)]">{value}</p>
    )}
  </div>
)

const Details = ({
  description,
  individualData,
  OrganizationData,
  isIndividual,
  loading,
}: DetailProps) => {
  return (
    <div className="flex flex-col w-[80ch]  ">
      <h1 className="text-3xl font-semibold text-[var(--primary)]">
        Desciption
      </h1>

      <p className=" text-[var(--secondary)] w-full   my-4 leading-7 font-medium">
        {description}
      </p>

      {loading ? (
        <>
          <ThreeDots
            visible={true}
            height="60"
            width="60"
            color="var(--secondary)"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </>
      ) : (
        <>
          {isIndividual && individualData ? (
            <>
              <div className="border-t py-4  ">
                <h2 className="text-2xl font-semibold text-[var(--primary)] mb-4">
                  Individual Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem
                    label="Full Name"
                    value={individualData.fullName}
                  />
                  <DetailItem
                    label="Age"
                    value={individualData.age.toString()}
                  />
                  <DetailItem
                    label="Address"
                    value={individualData.addressDetail}
                  />
                  <DetailItem label="Goal" value={individualData.goal} />
                  <DetailItem
                    label="Required Amount"
                    value={individualData.required}
                  />
                  <DetailItem
                    label="Timeline"
                    value={individualData.timeline}
                  />
                  <DetailItem label="Email" value={individualData.email} />
                  <DetailItem
                    label="Phone Number"
                    value={individualData.phoneNumber}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {OrganizationData && (
                <div className="border-t py-4">
                  <h2 className="text-2xl font-semibold text-[var(--primary)] mb-4">
                    Organization Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Name" value={OrganizationData.name} />
                    <DetailItem label="Tax ID" value={OrganizationData.taxId} />
                    <DetailItem
                      label="Address"
                      value={OrganizationData.physicalAddress}
                    />
                    <DetailItem
                      label="Phone Number"
                      value={OrganizationData.phoneNumber}
                    />
                    <DetailItem label="Email" value={OrganizationData.email} />
                    <DetailItem
                      label="Website"
                      value={OrganizationData.website}
                    />
                    <DetailItem
                      label="Social Media"
                      value={OrganizationData.socialMedia}
                    />

                    <DetailItem
                      label="Registration Status"
                      value={
                        OrganizationData.registered
                          ? "Registered"
                          : "Not Registered"
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Details
