import { Box, Field, Flex, Heading, NativeSelect } from '@chakra-ui/react'
import PropTypes from 'prop-types'

export function PostSorting({
  fields = [],
  value,
  onChange,
  orderValue,
  onOrderChange,
}) {
  return (
    <Box>
      <Flex gap={'4'} direction={{ base: 'column', md: 'row' }}>
        {/* sort by select */}
        <Field.Root>
          <Field.Label>Sort By</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              name='sortBy'
              id='sortBy'
              value={value}
              onChange={(e) => onChange(e.target.value)}
            >
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>

        {/* sort order select */}
        <Field.Root>
          <Field.Label>Sort Order</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              name='sortOrder'
              id='sortOrder'
              value={orderValue}
              onChange={(e) => onOrderChange(e.target.value)}
            >
              <option value={'ascending'}>ascending</option>
              <option value={'descending'}>descending</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
      </Flex>
    </Box>
  )
}

PostSorting.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  orderValue: PropTypes.string.isRequired,
  onOrderChange: PropTypes.func.isRequired,
}
