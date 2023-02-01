import React from 'react'
import { Select } from '@material-ui/core'
import clsx from 'clsx'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const CustomSelect = (props) => {
  const { className, children } = props
  const classes = useStyles()
  return (
    <Select
      variant="outlined"
      {...props}
      className={clsx(classes.root, className)}
    >
      {children}
    </Select>
  )
}
export default CustomSelect
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: 'white',
      '& div': {
        paddingTop: '0.5rem !important',
        paddingBottom: '0.5rem !important'
      }
    }
  })
)
