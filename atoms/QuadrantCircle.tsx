import * as React from 'react'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import { makeStyles, createStyles } from '@material-ui/core/styles'

interface Props {
  label?: string
  small?: boolean
  disabled?: boolean
}

const QuadrantCircle: React.FC<Props> = (props) => {
  const { label, small, disabled } = props
  const classes = useStyles(disabled)
  switch (label) {
    case 'BEST':
      return (
        <FiberManualRecordIcon
          classes={{ root: classes.best }}
          fontSize={small ? 'small' : 'default'}
        />
      )
    case 'BETTER':
      return (
        <FiberManualRecordIcon
          classes={{ root: classes.better }}
          fontSize={small ? 'small' : 'default'}
        />
      )
    case 'GOOD':
      return (
        <FiberManualRecordIcon
          classes={{ root: classes.good }}
          fontSize={small ? 'small' : 'default'}
        />
      )
    case 'BAD':
      return (
        <FiberManualRecordIcon
          classes={{ root: classes.bad }}
          fontSize={small ? 'small' : 'default'}
        />
      )
    default:
  }
  return (
    <FiberManualRecordIcon
      classes={{ root: classes.outOfAnalysis }}
      fontSize="small"
    />
  )
}
export default QuadrantCircle

const useStyles = makeStyles(() =>
  createStyles({
    best: (disabled) => ({
      color: disabled ? 'lightgray' : '#28B4B4 !important'
    }),
    better: (disabled) => ({
      color: disabled ? 'lightgray' : '#FFB43C !important'
    }),
    good: (disabled) => ({
      color: disabled ? 'lightgray' : '#2D5AF0 !important'
    }),
    bad: (disabled) => ({
      color: disabled ? 'lightgray' : '#F44336 !important'
    }),
    outOfAnalysis: (disabled) => ({
      color: disabled ? 'lightgray' : '#A5A9B1 !important'
    })
  })
)
