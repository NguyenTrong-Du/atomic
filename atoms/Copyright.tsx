import React from 'react'
import { Typography } from '@material-ui/core'

const Copyright = () => {
  return (
    <Typography variant="body2" align="center">
      {'© '}
      {new Date().getFullYear()} FULL KAITEN Inc.
    </Typography>
  )
}
export default Copyright
