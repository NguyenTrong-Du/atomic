import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

interface Props {
  label?: string
  icon?: JSX.Element
  disabled?: boolean
  children: JSX.Element
}
export default function ExpandList({
  label = '',
  icon = null,
  disabled,
  children
}: Props): JSX.Element {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (disabled) {
      setOpen(false)
    }
  }, [disabled])
  return (
    <>
      <ListItem
        disabled={disabled}
        button
        onClick={() => setOpen(!open)}
        className={classes.item}
      >
        <ListItemIcon classes={{ root: classes.listItemIcon }}>
          {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </ListItemIcon>
        <ListItemText primary={label} />
        {icon}
      </ListItem>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        className={classes.colleapse}
      >
        {children}
      </Collapse>
    </>
  )
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      padding: 0,
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    },
    colleapse: {
      padding: theme.spacing(1)
    },
    listItemIcon: {
      minWidth: '.2rem'
    }
  })
)
