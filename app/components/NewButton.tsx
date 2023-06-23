import { Button } from "@chakra-ui/react"
import { PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { solangProgram as program } from "@/utils/setup"

// Create new account
export default function NewButton() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const onClick = async () => {
    if (!publicKey) return

    const [pda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("seed"), publicKey.toBuffer()],
      program.programId
    )

    const transaction = await program.methods
      .new(publicKey, Array.from(Buffer.from([bump])))
      .accounts({ dataAccount: pda, wallet: publicKey })
      .transaction()

    sendTransaction(transaction, connection)
  }

  return <Button onClick={onClick}>New</Button>
}
