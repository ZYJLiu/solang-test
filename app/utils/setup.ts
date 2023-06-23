import { Program, AnchorProvider, Idl, setProvider } from "@coral-xyz/anchor"
import { IDL, Solang } from "../idl/solang"
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js"

const MockWallet = {
  signTransaction: () => Promise.reject(),
  signAllTransactions: () => Promise.reject(),
  publicKey: Keypair.generate().publicKey,
}

export const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

const provider = new AnchorProvider(connection, MockWallet, {})
setProvider(provider)

export const programId = IDL.metadata.address as unknown as PublicKey

export const solangProgram = new Program(
  IDL as Idl,
  programId
) as unknown as Program<Solang>
