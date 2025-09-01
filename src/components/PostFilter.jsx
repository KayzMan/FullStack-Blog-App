import PropTypes from 'prop-types'
import { Box, Field, Input, HStack, RadioCard } from '@chakra-ui/react'

export function PostFilter({ filterMethod, setFilterMethod, value, onChange }) {
  return (
    <Box>
      <Field.Root>
        <RadioCard.Root
          value={filterMethod}
          onValueChange={(e) => setFilterMethod(e.value)}
        >
          <RadioCard.Label>Select filtering method</RadioCard.Label>
          <HStack align='stretch'>
            <RadioCard.Item key={'author'} value={'author'}>
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <RadioCard.ItemText>{'Author'}</RadioCard.ItemText>
                <RadioCard.ItemIndicator />
              </RadioCard.ItemControl>
            </RadioCard.Item>

            <RadioCard.Item key={'tag'} value={'tag'}>
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <RadioCard.ItemText>{'Tag'}</RadioCard.ItemText>
                <RadioCard.ItemIndicator />
              </RadioCard.ItemControl>
            </RadioCard.Item>
          </HStack>
        </RadioCard.Root>

        <Field.Label>Filter By</Field.Label>
        <Input
          type='text'
          name={`filter-${filterMethod}`}
          id={`filter-${filterMethod}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Field.HelperText>{`filter-${filterMethod}`}</Field.HelperText>
      </Field.Root>
    </Box>
  )
}

PostFilter.propTypes = {
  filterMethod: PropTypes.string.isRequired,
  setFilterMethod: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
