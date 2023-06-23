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

  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("seed"), wallet.publicKey.toBuffer()],
    program.programId
  )

  it("Is initialized!", async () => {
    const tx = await program.methods
      .new(wallet.publicKey, Array.from(Buffer.from([bump])))
      .accounts({ dataAccount: pda })
      .rpc({ skipPreflight: true })
    console.log("Your transaction signature", tx)

    const val = await program.methods
      .get()
      .accounts({ dataAccount: pda })
      .view()

    console.log("state", val)
  })

  it("Flip", async () => {
    const tx = await program.methods.flip().accounts({ dataAccount: pda }).rpc()
    console.log("Your transaction signature", tx)

    const val = await program.methods
      .get()
      .accounts({ dataAccount: pda })
      .view()

    console.log("state", val)
  })

  it("Increment", async () => {
    const tx = await program.methods
      .increment()
      .accounts({ dataAccount: pda })
      .rpc()
    console.log("Your transaction signature", tx)
  })

  it("Flip and Increment", async () => {
    const tx = await program.methods
      .flipAndIncrement()
      .accounts({ dataAccount: pda })
      .rpc()
    console.log("Your transaction signature", tx)
  })
})
