import { Box, Flex, Spacer, VStack } from "@chakra-ui/react"
import WalletMultiButton from "@/components/WalletMultiButton"
import FlipButton from "@/components/FlipButton"
import NewButton from "@/components/NewButton"
import IncrementButton from "@/components/IncrementButton"
import FlipAndIncrementButton from "@/components/FlipAndIncrementButton"
import FetchState from "@/components/FetchState"

export default function Home() {
  return (
    <Box>
      <Flex px={4} py={4}>
        <Spacer />
        <WalletMultiButton />
      </Flex>
      <VStack justifyContent="center">
        <NewButton />
        <FlipButton />
        <IncrementButton />
        <FlipAndIncrementButton />
        <FetchState />
      </VStack>
    </Box>
  )
}
