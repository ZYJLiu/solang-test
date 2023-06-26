import * as anchor from "@coral-xyz/anchor"
import { Program, Wallet } from "@coral-xyz/anchor"
import { Solang } from "../target/types/solang"
import { PublicKey, AccountMeta, Keypair } from "@solana/web3.js"
import {
  createMint,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  getMint,
  getMinimumBalanceForRentExemptAccount,
  ACCOUNT_SIZE,
} from "@solana/spl-token"

describe("solang", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const wallet = provider.wallet as Wallet
  const connection = provider.connection
  const program = anchor.workspace.Solang as Program<Solang>

  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("seed"), wallet.publicKey.toBuffer()],
    program.programId
  )

  const mint = Keypair.generate()

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

  // it("CPI Increment Anchor Counter ", async () => {
  //   const counterProgramId = new PublicKey(
  //     "ALeaCzuJpZpoCgTxMjJbNjREVqSwuvYFRZUfc151AKHU"
  //   )

  //   const [counterAccount] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("counter")],
  //     counterProgramId
  //   )

  //   const remainingAccounts: AccountMeta[] = [
  //     {
  //       pubkey: counterProgramId,
  //       isWritable: false,
  //       isSigner: false,
  //     },
  //     {
  //       pubkey: counterAccount,
  //       isWritable: true,
  //       isSigner: false,
  //     },
  //     {
  //       pubkey: wallet.publicKey,
  //       isWritable: true,
  //       isSigner: true,
  //     },
  //   ]

  //   const tx = await program.methods
  //     .cpi(counterAccount, wallet.publicKey)
  //     .accounts({ dataAccount: pda })
  //     .remainingAccounts(remainingAccounts)
  //     .rpc()
  //   console.log("Your transaction signature", tx)
  // })

  it("SPL Token Transfer ", async () => {
    const mint = await createMint(
      connection,
      wallet.payer,
      wallet.publicKey,
      wallet.publicKey,
      0
    )

    const from_token_account = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      mint, // Mint account
      wallet.publicKey // Owner account
    )

    await mintTo(
      connection,
      wallet.payer,
      mint,
      from_token_account.address,
      wallet.publicKey,
      1
    )

    const receiver = Keypair.generate()

    const to_token_account = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      mint, // Mint account
      receiver.publicKey // Owner account
    )

    const remainingAccounts: AccountMeta[] = [
      {
        pubkey: from_token_account.address,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: to_token_account.address,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: wallet.publicKey,
        isWritable: true,
        isSigner: true,
      },
    ]

    const tx = await program.methods
      .splTransfer(from_token_account.address, to_token_account.address)
      .accounts({ dataAccount: pda })
      .remainingAccounts(remainingAccounts)
      .rpc()
    console.log("Your transaction signature", tx)

    const tokenAccount = await getAccount(connection, to_token_account.address)
    // console.log(tokenAccount.amount.toString())
  })

  it("Initialize Mint via CPI in program", async () => {
    const lamport = await getMinimumBalanceForRentExemptMint(connection)
    console.log("Mint Account Space:", MINT_SIZE)
    console.log("Mint Account Lamports:", lamport)

    const lamport2 = await getMinimumBalanceForRentExemptAccount(connection)
    console.log("Token Account Space:", ACCOUNT_SIZE)
    console.log("Token Account Lamports:", lamport2)

    const remainingAccounts: AccountMeta[] = [
      {
        pubkey: mint.publicKey,
        isWritable: true,
        isSigner: true,
      },
      {
        pubkey: wallet.publicKey,
        isWritable: true,
        isSigner: true,
      },
    ]

    const tx = await program.methods
      .initializeMint(
        wallet.publicKey, // payer
        mint.publicKey, // mint address to initialize
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority
        9 // decimals
      )
      .accounts({ dataAccount: pda })
      .remainingAccounts(remainingAccounts)
      .signers([mint])
      .rpc({ skipPreflight: true })
    console.log("Your transaction signature", tx)

    const mintAccount = await getMint(connection, mint.publicKey)
    console.log(mintAccount.mintAuthority.toBase58())
    console.log(mintAccount.supply.toString())
  })

  it("Initialize Mint via CPI in program using PDA", async () => {
    const [mint, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint")],
      program.programId
    )

    const remainingAccounts: AccountMeta[] = [
      {
        pubkey: mint,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: wallet.publicKey,
        isWritable: true,
        isSigner: true,
      },
    ]

    const tx = await program.methods
      .initializeMintPda(
        wallet.publicKey, // payer
        mint, // mint address to initialize
        mint, // mint authority
        mint, // freeze authority
        2, // decimals
        Buffer.from([bump])
      )
      .accounts({ dataAccount: pda })
      .remainingAccounts(remainingAccounts)
      .rpc({ skipPreflight: true })
    console.log("Your transaction signature", tx)

    const mintAccount = await getMint(connection, mint)
    console.log(mintAccount.mintAuthority.toBase58())
    console.log(mintAccount.supply.toString())
  })

  it("Initialize Token Account via CPI in program", async () => {
    const tokenAccount = Keypair.generate()

    const remainingAccounts: AccountMeta[] = [
      {
        pubkey: tokenAccount.publicKey,
        isWritable: true,
        isSigner: true,
      },
      {
        pubkey: mint.publicKey,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: wallet.publicKey,
        isWritable: true,
        isSigner: true,
      },
      {
        pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
        isWritable: false,
        isSigner: false,
      },
    ]

    const tx = await program.methods
      .initializeAccount(
        wallet.publicKey, // payer
        tokenAccount.publicKey, // token account to initialize
        mint.publicKey, // mint address for token account
        wallet.publicKey // owner
      )
      .accounts({ dataAccount: pda })
      .remainingAccounts(remainingAccounts)
      .signers([tokenAccount])
      .rpc({ skipPreflight: true })
    console.log("Your transaction signature", tx)

    const tokenAccountData = await getAccount(
      connection,
      tokenAccount.publicKey
    )
    console.log(tokenAccountData.owner.toBase58())
    console.log(tokenAccountData.amount.toString())
  })

  it("Initialize Token Account via CPI in program using PDA", async () => {
    const [tokenAccount, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("token")],
      program.programId
    )

    const remainingAccounts: AccountMeta[] = [
      {
        pubkey: tokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: mint.publicKey,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: wallet.publicKey,
        isWritable: true,
        isSigner: true,
      },
      {
        pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
        isWritable: false,
        isSigner: false,
      },
    ]

    const tx = await program.methods
      .initializeAccountPda(
        wallet.publicKey, // payer
        tokenAccount, // token account to initialize
        mint.publicKey, // mint address for token account
        tokenAccount, // owner
        Buffer.from([bump])
      )
      .accounts({ dataAccount: pda })
      .remainingAccounts(remainingAccounts)
      .rpc({ skipPreflight: true })
    console.log("Your transaction signature", tx)

    const tokenAccountData = await getAccount(connection, tokenAccount)
    console.log(tokenAccountData.owner.toBase58())
    console.log(tokenAccountData.amount.toString())
  })
})
