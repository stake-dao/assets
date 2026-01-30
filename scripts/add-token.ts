// add-token.ts
/**
 * Usage:
 *   pnpm add-token <chainId> <address>
 *
 * Example:
 *   pnpm add-token 1 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
 */

import { Address, createPublicClient, erc20Abi, http, isAddress } from 'viem'
import { getChain, readFile, RPC, usageAndExit, writeFile } from './utils'
import { writeFileSync } from 'node:fs'

const USAGE = 'pnpm add-token <chainId> <address>'
const TOKENS_FILE_PATH = 'tokens/all.json'

const addToken = async ({ chainId, address }: { chainId: number; address: Address }) => {
  const chain = getChain(chainId)!
  const allTokens = readFile({ path: TOKENS_FILE_PATH })

  //   Check if the token is already added
  const existingToken = allTokens.find((t: any) => t.address[chainId]?.toLowerCase() === address.toLowerCase())

  if (existingToken) {
    console.error(`Error: ${address} already added on ${chain.name}\n`)
    console.error(existingToken)
    process.exit(1)
  }

  //   Fetch data
  const client = createPublicClient({ chain, transport: http(RPC[chain.id]) })
  const res = await client.multicall({
    contracts: [
      { address, functionName: 'name', abi: erc20Abi },
      { address, functionName: 'symbol', abi: erc20Abi },
      { address, functionName: 'decimals', abi: erc20Abi },
    ],
  })

  const name = res[0].result
  const symbol = res[1].result
  const decimals = Number(res[2].result)
  const id = symbol!.toLowerCase()

  //   Check if the token is already added on another chain
  const otherChainTokenIndex = allTokens.findIndex((t: any) => t.id.toLowerCase() === id)

  if (otherChainTokenIndex !== -1) {
    const otherChainToken = allTokens[otherChainTokenIndex]

    allTokens[otherChainTokenIndex] = {
      id: otherChainToken.id,
      name: otherChainToken.name,
      address: { ...otherChainToken.address, [chainId]: address },
      symbol: otherChainToken.symbol,
      decimals: otherChainToken.decimals,
      logoURI: otherChainToken.logoURI,
      tags: otherChainToken.tags,
      extensions: otherChainToken.extensions,
    }
  } else {
    allTokens.push({
      id: symbol!.toLowerCase(),
      name,
      address: { [chainId]: address },
      symbol,
      decimals,
      logoURI: `/assets/${chainId}/${address.toLowerCase()}.svg`,
      tags: [],
      extensions: {},
    })
  }

  try {
    writeFileSync(TOKENS_FILE_PATH, JSON.stringify(allTokens))
    console.info(`Success: Added ${symbol} (${address}) on ${chain.name}\n`)
  } catch (e) {
    console.error(`Error: ${e}`)
    process.exit(1)
  }

  process.exit(0)
}

const args = process.argv.slice(2)
if (args.length !== 2) usageAndExit(`Expected 2 arguments, got ${args.length}`, USAGE)

if (isNaN(Number(args[0])) || Number(args[0]) < 1) usageAndExit(`${args[0]} is not a valid chainId`, USAGE)
if (!isAddress(args[1])) usageAndExit(`${args[1]} is not a valid address`, USAGE)

addToken({ chainId: Number(args[0]), address: args[1] as Address })
