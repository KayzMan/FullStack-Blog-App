import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import { BsChevronLeft } from 'react-icons/bs'

export function BackButton({ title, destination }) {
  return (
    <Link
      as={RouterLink}
      to={destination}
      color={'olive'}
      _hover={{ textDecor: 'none' }}
      display={'flex'}
      alignItems={'center'}
    >
      <BsChevronLeft /> {title}
    </Link>
  )
}

BackButton.propTypes = {
  title: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
}
