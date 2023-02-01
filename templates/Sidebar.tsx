import React from 'react'
import { Paper } from '@material-ui/core'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@material-ui/core/styles'

interface Props {
  children: any
  className?: any
  currRef?: any | null
}
const Sidebar: React.FC<Props> = (props: Props) => {
  const { className, children, currRef } = props
  const classes = useStyles()
  return (
    <>
      <Paper ref={currRef} className={clsx(classes.sidebar, className)}>
        {children}
      </Paper>
    </>
  )
}

export default Sidebar

const useStyles = makeStyles(() =>
  createStyles({
    sidebar: {
      width: 280,
      zIndex: 599,
      height: '100%',
      overflow: 'auto',
      position: 'fixed',
      display: 'block'
    }
  })
)
