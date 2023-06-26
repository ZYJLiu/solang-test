import { Button, Text, VStack } from "@chakra-ui/react"
import { AccountInfo, PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { solangProgram as program } from "@/utils/setup"
import { useEffect, useState } from "react"
import { struct, bool, u32, publicKey } from "@coral-xyz/borsh"

// This is the schema for the account data is incorrect
// Should be 38 bytes, but accountInfo.data is 56 bytes
class MyBufferSchema {
  isInitialized: boolean
  value: boolean
  number: number
  creator: Uint8Array

  constructor(
    isInitialized: boolean,
    value: boolean,
    number: number,
    creator: Uint8Array
  ) {
    this.isInitialized = isInitialized
    this.value = value
    this.number = number
    this.creator = creator
  }

  static borshAccountSchema = struct([
    bool("isInitialized"),
    bool("value"),
    u32("number"),
    publicKey("creator"),
  ])

  static deserialize(buffer?: Buffer): MyBufferSchema | null {
    if (!buffer) {
      return null
    }

    try {
      const { isInitialized, value, number, creator } =
        this.borshAccountSchema.decode(buffer)
      return new MyBufferSchema(isInitialized, value, number, creator)
    } catch (error) {
      console.log("Deserialization error:", error)
      return null
    }
  }
}
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
      // console.log(accountInfo.data)
      const offsetBuffer = accountInfo.data.slice(18)
      const myBuffer = MyBufferSchema.deserialize(offsetBuffer)

      setBool(myBuffer?.value ? "True" : "False")
      setNumber(myBuffer?.number || 0)
      setAddress(myBuffer?.creator.toString() || "")
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

  useEffect(() => {
    const listenerId = program.addEventListener(
      "Flipped",
      async (event, slot, signature) => {
        console.log(event)
      }
    )

    return () => {
      program.removeEventListener(listenerId)
    }
  }, [publicKey])

  // const onClick = async () => {
  //   if (!publicKey) return

  //   const [pda, bump] = PublicKey.findProgramAddressSync(
  //     [Buffer.from("seed"), publicKey.toBuffer()],
  //     program.programId
  //   )

  //   // // 17 bytes of data, last byte is the flip bool state
  //   // connection.getAccountInfo(pda).then((accountInfo) => {
  //   //   if (accountInfo) {
  //   //     setBool(accountInfo.data[16] === 1 ? "True" : "False")
  //   //     console.log(accountInfo.data)
  //   //   }
  //   // })

  //   // Doesn't work in browser
  //   const val = await program.methods
  //     .get()
  //     .accounts({ dataAccount: pda })
  //     .view()

  //   console.log("state", val)

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
