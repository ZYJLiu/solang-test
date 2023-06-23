import { Button, Text, VStack } from "@chakra-ui/react"
import { AccountInfo, PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { solangProgram as program } from "@/utils/setup"
import { useEffect, useState } from "react"

// Fetch the account state
export default function FetchState() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [bool, setBool] = useState("")
  const [number, setNumber] = useState(0)
  const [address, setAddress] = useState("")
  const [buffer, setBuffer] = useState("")

  useEffect(() => {
    if (!publicKey) return

    const [pda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("seed"), publicKey.toBuffer()],
      program.programId
    )

    const updateState = (accountInfo: AccountInfo<Buffer>) => {
      const dataBuffer = accountInfo.data.buffer
      const dataView = new DataView(dataBuffer)
      const uint8Array = new Uint8Array(dataBuffer)

      console.log(accountInfo.data)
      setBool(dataView.getUint8(17) === 1 ? "True" : "False")
      setNumber(dataView.getUint8(20))
      setAddress(new PublicKey(uint8Array.slice(24)).toBase58())
      setBuffer(Array.from(accountInfo.data).join(", "))
    }

    const fetchAccountData = async () => {
      const accountInfo = await connection.getAccountInfo(pda)
      if (accountInfo) {
        updateState(accountInfo)
      }
    }

    // Subscribe to the games state PDA account change
    const subscriptionId = connection.onAccountChange(pda, updateState)

    fetchAccountData()

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
      <Text>{bool}</Text>
      <Text>{number}</Text>
      <Text>{address}</Text>
      <Text>{buffer}</Text>
    </VStack>
  )
}
