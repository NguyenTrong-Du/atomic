import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'

const CustomizedSwitch = (props) => {
  return <CustomSwhich {...props} />
}
export default CustomizedSwitch

const CustomSwhich = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      marginRight: 8,
      display: 'flex'
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main
        }
      },
      '&$disabled': {
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: '#dadada !important',
          borderColor: '#dadada!important'
        }
      }
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none'
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white
    },
    checked: {},
    disabled: {}
  })
)(Switch)
