import * as React from 'react'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

interface AlertExtendProps extends AlertProps {
  visible?: boolean
  children: React.ReactNode
}

const Alert: React.FC<AlertExtendProps> = ({ visible, children, ...props }) => {
  if (!visible) return null

  return <MuiAlert {...props}>{children}</MuiAlert>
}

export default Alert
