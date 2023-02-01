import React from 'react'
import {
  createStyles,
  makeStyles,
  Theme,
  createMuiTheme
} from '@material-ui/core/styles'
import { MenuItem } from '@material-ui/core'

interface Props {
  level: number
  selected?: boolean
  label?: string
  onClick: (any) => void
}
export default function NestList({
  level,
  selected,
  label,
  onClick
}: Props): JSX.Element {
  const theme = createMuiTheme()
  const classes = useStyles({
    paddingLeft: theme.spacing(2 * (level - 1))
  })
  return (
    <MenuItem
      button
      dense
      disableGutters
      selected={selected}
      onClick={onClick}
      className={classes.nested}
    >
      {`- ${label}`}
    </MenuItem>
  )
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: (props: any) => ({
      paddingLeft: props.paddingLeft
    })
  })
)
