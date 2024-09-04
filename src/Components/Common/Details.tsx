import React from "react"
import XIcon from "@mui/icons-material/X"
import InstagramIcon from "@mui/icons-material/Instagram"
import FacebookIcon from "@mui/icons-material/Facebook"
import Link from "next/link"
export interface DetailProps {
  description: string
  xLink: string
  InstaLink: string
  FaceBookLink: string
}

const Details = ({
  description,
  xLink,
  InstaLink,
  FaceBookLink,
}: DetailProps) => {
  return (
    <div className="flex flex-col w-[80ch]  ">
      <h1 className="text-3xl font-semibold text-[var(--primary)]">
        Desciption
      </h1>

      <p className=" text-[var(--secondary)] w-full   mt-4 leading-7 font-medium">
        {description}
      </p>
      {/* 
      <div className="flex mt-[3rem] w-full justify-end items-center space-x-3">
        <Link href={xLink}>
          <XIcon sx={{ color: "var(--secondary)", fontSize: 35 }} />
        </Link>

        <Link href={InstaLink}>
          <InstagramIcon sx={{ color: "var(--secondary)", fontSize: 35 }} />
        </Link>

        <Link href={FaceBookLink}>
          <FacebookIcon sx={{ color: "var(--secondary)", fontSize: 35 }} />
        </Link>
      </div> */}
    </div>
  )
}

export default Details
