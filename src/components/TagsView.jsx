import PropTypes from 'prop-types'
import { Flex, Badge, ScrollArea } from '@chakra-ui/react'
import { CiHashtag } from 'react-icons/ci'

export function TagsView({ tags = [] }) {
  return (
    tags.length > 0 && (
      <ScrollArea.Root flex={'1'}>
        <ScrollArea.Viewport>
          <ScrollArea.Content py={'4'}>
            <Flex gap={'4'} flexWrap={'nowrap'}>
              {tags.map((tag) => (
                <Badge variant={'solid'} bg={'olive'} key={tag}>
                  <CiHashtag /> {tag}
                </Badge>
              ))}
            </Flex>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    )
  )
}

TagsView.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
}
