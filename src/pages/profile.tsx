import React from "react"

import { useQuery, gql } from "@apollo/client"

// const GET_LOCATIONS = gql`
//   query MyQuery {
//     Metri_Swap(limit: 10) {
//       buyAmount
//       buyToken
//     }
//   }
// `

const profile = () => {
  // const { loading, error, data } = useQuery(GET_LOCATIONS)

  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Error : {error.message}</p>

  // console.log("Data", data)

  return (
    <div>
      <h1 className="text-3xl font-semibold ml-6 text-[var(--primary)]">
        {" "}
        Profile
      </h1>
      {/* {data} */}
    </div>
  )
}

export default profile
