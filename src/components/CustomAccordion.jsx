import PropTypes from 'prop-types'
import { Span, Accordion } from '@chakra-ui/react'

import { PostFilter } from './PostFilter'

export function CustomAccordion({ the_key, title, element }) {
  return (
    <Accordion.Root collapsible my={'4'}>
      <Accordion.Item key={the_key} value={the_key}>
        <Accordion.ItemTrigger>
          <Span>{title}</Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>{element}</Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}

CustomAccordion.propTypes = {
  the_key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  element: PropTypes.element.isRequired,
}
