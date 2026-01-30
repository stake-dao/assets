import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  etherlink,
  fantom,
  fraxtal,
  gnosis,
  hyperEvm,
  linea,
  mainnet,
  optimism,
  polygon,
  sonic,
  zksync,
} from 'viem/chains'
import fs from 'node:fs'

export const usageAndExit = (msg: string, usage: string, code = 1) => {
  console.error(`Error: ${msg}\n`)
  console.error(`Usage: ${usage}\n`)
  process.exit(code)
}

export const readFile = (args: { path: string }) => {
  const { path } = args

  const fileContent = fs.readFileSync(path, 'utf-8')

  return JSON.parse(fileContent)
}

export const writeFile = (args: { path: string; data: any }) => {
  const { path, data } = args

  fs.writeFile(path, data, (err) => {
    if (err) throw err
  })
}

export const RPC = {
  1: 'https://rpc.mevblocker.io/',
  10: 'https://optimism-rpc.publicnode.com',
  56: 'https://bsc-rpc.publicnode.com',
  100: 'https://gnosis-mainnet.public.blastapi.io',
  137: 'https://polygon-rpc.com',
  146: 'https://sonic-rpc.publicnode.com',
  250: 'https://fantom-rpc.publicnode.com',
  252: 'https://rpc.frax.com',
  324: 'https://mainnet.era.zksync.io',
  999: 'https://rpc.hyperliquid.xyz/evm',
  8453: 'https://base-public.nodies.app',
  42161: 'https://arbitrum-one-rpc.publicnode.com',
  42220: 'https://forno.celo.org',
  42793: 'https://node.mainnet.etherlink.com',
  43114: 'https://avalanche-c-chain-rpc.publicnode.com',
  59144: 'https://linea-rpc.publicnode.com',
}

export const getChain = (chainId: number) => {
  if (chainId === 1) return mainnet
  if (chainId === 10) return optimism
  if (chainId === 56) return bsc
  if (chainId === 100) return gnosis
  if (chainId === 137) return polygon
  if (chainId === 146) return sonic
  if (chainId === 250) return fantom
  if (chainId === 252) return fraxtal
  if (chainId === 324) return zksync
  if (chainId === 999) return hyperEvm
  if (chainId === 8453) return base
  if (chainId === 42161) return arbitrum
  if (chainId === 42220) return celo
  if (chainId === 42793) return etherlink
  if (chainId === 43114) return avalanche
  if (chainId === 59144) return linea
}
