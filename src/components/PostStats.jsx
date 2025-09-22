import PropTypes from 'prop-types'
import {
  Box,
  Heading,
  Spinner,
  HStack,
  Stat,
  Icon,
  Center,
} from '@chakra-ui/react'
import {
  VictoryChart,
  VictoryTooltip,
  VictoryBar,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory'
import { ImStatsBars, ImStatsDots } from 'react-icons/im'
import { TbSum } from 'react-icons/tb'
import { useQuery } from '@tanstack/react-query'
import { getTotalViews, getDailyDurations, getDailyViews } from '../api/events'

export function PostStats({ postId }) {
  const totalViews = useQuery({
    queryKey: ['totalViews', postId],
    queryFn: () => getTotalViews(postId),
  })

  const dailyViews = useQuery({
    queryKey: ['dailyViews', postId],
    queryFn: () => getDailyViews(postId),
  })

  const dailyDurations = useQuery({
    queryKey: ['dailyDurations', postId],
    queryFn: () => getDailyDurations(postId),
  })

  dailyDurations.data = dailyDurations.data?.filter((d) => d._id !== null)
  // console.log('dailyDurations:', dailyDurations.data)

  if (
    totalViews.isLoading ||
    dailyViews.isLoading ||
    dailyDurations.isLoading
  ) {
    return (
      <Box maxW={'xl'} mx={'auto'}>
        <Spinner
          size={'lg'}
          color='red.500'
          css={{ '--spinner-track-color': 'colors.gray.200' }}
        />
        <Heading as={'h1'} textAlign={'center'}>
          Loading Stats...
        </Heading>
      </Box>
    )
  }

  return (
    <Box>
      <Center mb={'2'} width={'full'}>
        <Stat.Root borderWidth='1px' p='4' rounded='md'>
          <HStack justify='space-between'>
            <Stat.Label>Total Views</Stat.Label>
            <Icon color='olive'>
              <TbSum />
            </Icon>
          </HStack>
          <Stat.ValueText color={'olive'} fontWeight={'bold'}>
            {totalViews.data?.views}
          </Stat.ValueText>
        </Stat.Root>
      </Center>

      {/* daily views */}
      <Box>
        <Stat.Root width={'full'} borderWidth='1px' p='4' rounded='md'>
          <HStack justify='space-between'>
            <Stat.Label>Daily Views</Stat.Label>
            <Icon color='olive'>
              <ImStatsBars />
            </Icon>
          </HStack>
          <Stat.ValueText color={'olive'} fontWeight={'bold'}>
            {/* {totalViews.data?.views} */}
          </Stat.ValueText>

          <VictoryChart domainPadding={16}>
            <VictoryBar
              labelComponent={<VictoryTooltip />}
              data={dailyViews.data?.map((d) => ({
                x: new Date(d._id),
                y: d.views,
                label: `${new Date(d._id).toLocaleDateString()}: ${d.views} views`,
              }))}
            />
          </VictoryChart>
        </Stat.Root>
      </Box>

      {/* daily durations */}
      <Box my={'2'}>
        <Stat.Root borderWidth='1px' p='4' rounded='md'>
          <HStack justify='space-between'>
            <Stat.Label>Daily Average Viewing Duration</Stat.Label>
            <Icon color='olive'>
              <ImStatsDots />
            </Icon>
          </HStack>
          <Stat.ValueText color={'olive'} fontWeight={'bold'}>
            {/* {totalViews.data?.views} */}
          </Stat.ValueText>

          <VictoryChart
            domainPadding={16}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension='x'
                labels={({ datum }) =>
                  `${datum.x.toLocaleDateString()}: ${datum.y.toFixed(2)} minutes`
                }
                labelComponent={<VictoryTooltip />}
              />
            }
          >
            <VictoryLine
              data={dailyDurations.data?.map((d) => ({
                x: new Date(d._id),
                y: d.averageDuration / (60 * 1000),
              }))}
            />
          </VictoryChart>
        </Stat.Root>
      </Box>
    </Box>
  )
}

PostStats.propTypes = {
  postId: PropTypes.string.isRequired,
}
