import {
  Flex,
  Skeleton,
  SimpleGrid,
  Stack,
  Box,
  Spacer,
} from '@chakra-ui/react'

export function AllPostsSkeleton() {
  return (
    <SimpleGrid columns={[1, 1, 2, 3]} gap={'4'}>
      <GridItem />
      <GridItem />
      <GridItem />
      <GridItem />
    </SimpleGrid>
  )
}

function GridItem() {
  return (
    <Stack
      border={'1px solid'}
      borderColor={'gray.300'}
      borderRadius={'lg'}
      flex={'1'}
    >
      <Skeleton height={'250px'} />

      <Box m={'4'}>
        <Skeleton height={'10'} width={'70%'} mb={'2'} />
        <Skeleton height={'10'} width={'50%'} />
      </Box>

      <Flex gap={'2'} m={'4'}>
        <Spacer />
        <Skeleton height={'48px'} width={'48px'} />
        <Skeleton height={'48px'} width={'48px'} />
      </Flex>
    </Stack>
  )
}
