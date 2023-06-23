import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { Solang } from "../target/types/solang"
import { PublicKey } from "@solana/web3.js"

describe("solang", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const wallet = provider.wallet

  const program = anchor.workspace.Solang as Program<Solang>

  it("Is initialized!", async () => {
    let [pda, bump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("seed"), wallet.publicKey.toBuffer()],
      program.programId
    )

    const tx = await program.methods
      .new(wallet.publicKey, Array.from(Buffer.from([bump])))
      .accounts({ dataAccount: pda })
      .rpc({ skipPreflight: true })
    console.log("Your transaction signature", tx)

    const val1 = await program.methods
      .get()
      .accounts({ dataAccount: pda })
      .view()

    console.log("state", val1)

    const tx2 = await program.methods
      .flip()
      .accounts({ dataAccount: pda })
      .rpc()
    console.log("Your transaction signature", tx2)

    const val2 = await program.methods
      .get()
      .accounts({ dataAccount: pda })
      .view()

    console.log("state", val2)
  })
})
