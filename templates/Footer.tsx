import React from 'react'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const Footer = (props) => {
  const { green, children, subContent } = props
  const style = subContent
    ? {
        width: 'calc(100% - 280px)',
        left: 280
      }
    : {
        width: '100%'
      }
  const classes = useStyles(style)
  return (
    <div
      className={clsx(classes.root, 'flex items-center')}
      style={green ? { backgroundColor: '#28B4B4' } : null}
    >
      {children}
    </div>
  )
}
export default Footer
const useStyles = makeStyles(() =>
  createStyles({
    root: (props: any) => ({
      height: 60,
      position: 'fixed',
      bottom: 0,
      zIndex: 499,
      // opacity: 0.9,
      backgroundColor: '#4B5363',
      textAlign: 'center',
      padding: 15,
      '& .MuiFormControlLabel-root': {
        color: '#ffffff'
      },
      width: props.width,
      left: props.left
    })
  })
)
