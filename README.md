##DonationTracker with Cross-Chain Support

## Deployed Contract Addresses

| Network          | DonationTracker                          | DonationChainLink                        |
|------------------|------------------------------------------|------------------------------------------|
| Ethereum Sepolia | [0xE35DE3EF40C8E86F1B9D467D76C6DC3408aBCDD0](https://sepolia.etherscan.io/address/0xE35DE3EF40C8E86F1B9D467D76C6DC3408aBCDD0) | [0x6b5862A312DEC4DdADb50fac5B4B06E243F49dE0](https://sepolia.etherscan.io/address/0x6b5862A312DEC4DdADb50fac5B4B06E243F49dE0) |
| Rootstock Testnet      | [0x2345...6789](https://sepolia.etherscan.io/address/0xE35DE3EF40C8E86F1B9D467D76C6DC3408aBCDD0) | [0xbcde...fghi](https://sepolia.etherscan.io/address/0x6b5862A312DEC4DdADb50fac5B4B06E243F49dE0) |
| Morph Testnett   | [0x3456...7890](https://sepolia.etherscan.io/address/0xE35DE3EF40C8E86F1B9D467D76C6DC3408aBCDD0) | [0xcdef...ghij](https://sepolia.etherscan.io/address/0x6b5862A312DEC4DdADb50fac5B4B06E243F49dE0) |

## The Problem

The charitable giving landscape faces critical challenges that hinder its effectiveness and reach:

1. **Transparency Gap**: 73% of donors want to know how their money is used, but only 19% of charities provide easily accessible financial information. (BBB Wise Giving Alliance, 2020)

2. **High Cross-Border Costs**: International donations lose an average of 6.5% to remittance fees. (World Bank, Q4 2022)

3. **Financial Exclusion**: 1.4 billion adults remain unbanked, limiting their participation in traditional donation systems. (World Bank, 2021)

4. **Inefficient Resource Use**: U.S. nonprofits spend 37% of their budget on overhead, reducing funds for beneficiaries. (Urban Institute, 2019)

5. **Trust Deficit**: Only 50% of people trust NGOs, indicating a need for greater accountability. (Edelman Trust Barometer, 2021)

6. **Blockchain Fragmentation**: Despite blockchain's potential, over 100 active public blockchains create new interoperability challenges. (2023)

DonationTracker addresses these issues by leveraging blockchain technology and cross-chain interoperability for a more transparent, efficient, and accessible donation platform.

## Features

- Register as an individual or organization
- Create fundraising campaigns
- Accept donations on the same chain or cross-chain
- Manage campaign withdrawals with proof uploads
- Cross-chain functionality powered by Chainlink CCIP

## Smart Contracts

The project consists of two main smart contracts:

1. `DonationTracker`: Manages campaign creation and donations
2. `DonationChainLink`: Handles cross-chain donation transfers using Chainlink CCIP

## Setup

1. Install dependencies: `npm install`
2. Configure your `.env` file with your private key and RPC URLs. and add [ublic wallet id from wallet dashboard `NEXT_PUBLIC_WALLET_ID=""`
3. RUn the project: `npm run dev`

## How it works?

1. Register as an individual or organization.
2. Create a campaign by specifying details and the destination chain.
3. Donors can contribute to campaigns, even across different chains.
4. Campaign creators can withdraw funds and upload proof of use.
