import { Button } from "@chakra-ui/react"
import { PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { solangProgram as program } from "@/utils/setup"

// Update account state
export default function IncrementButton() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const onClick = async () => {
    if (!publicKey) return

    const [pda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("seed"), publicKey.toBuffer()],
      program.programId
    )

    const transaction = await program.methods
      .increment()
      .accounts({ dataAccount: pda })
      .transaction()

    sendTransaction(transaction, connection)
  }

  return <Button onClick={onClick}>Increment</Button>
}
