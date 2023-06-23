import { Button, Text, VStack } from "@chakra-ui/react"
import { PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { solangProgram as program } from "@/utils/setup"
import { useEffect, useState } from "react"

export default function FetchState() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [state, setState] = useState("")
  const [buffer, setBuffer] = useState(new Uint8Array())

  useEffect(() => {
    if (!publicKey) return
    const [pda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("seed"), publicKey.toBuffer()],
      program.programId
    )
    connection.getAccountInfo(pda).then((accountInfo) => {
      if (accountInfo) {
        console.log(accountInfo.data)
        setState(accountInfo.data[16] === 1 ? "True" : "False")
        setBuffer(accountInfo.data)
      }
    })
  }, [publicKey])

  useEffect(() => {
    if (!publicKey) return

    const [pda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("seed"), publicKey.toBuffer()],
      program.programId
    )

    // Subscribe to the games state PDA account change
    const subscriptionId = connection.onAccountChange(pda, (accountInfo) => {
      if (accountInfo) {
        console.log(accountInfo.data)
        setState(accountInfo.data[16] === 1 ? "True" : "False")
        setBuffer(accountInfo.data)
      }
    })

    return () => {
      // Unsubscribe from the account change subscription when the component unmounts
      connection.removeAccountChangeListener(subscriptionId)
    }
  }, [publicKey])

  // const onClick = async () => {
  //   if (!publicKey) return

  //   const [pda, bump] = PublicKey.findProgramAddressSync(
  //     [Buffer.from("seed"), publicKey.toBuffer()],
  //     program.programId
  //   )

  //   // 17 bytes of data, last byte is the flip bool state
  //   connection.getAccountInfo(pda).then((accountInfo) => {
  //     if (accountInfo) {
  //       setState(accountInfo.data[16] === 1 ? "True" : "False")
  //       console.log(accountInfo.data)
  //     }
  //   })

  //   // // Doesn't work in browser
  //   // const val = await program.methods
  //   //   .get()
  //   //   .accounts({ dataAccount: pda })
  //   //   .view()

  //   // console.log("state", val)

  //   // Can't use because not in IDL, and don't know discriminator for account type
  //   // const val = await program.account.dataAccount.fetch(pda)
  // }

  // return <Button onClick={onClick}>Fetch</Button>
  return (
    <VStack>
      <Text>{state}</Text>
      <Text>{buffer}</Text>
    </VStack>
  )
}
