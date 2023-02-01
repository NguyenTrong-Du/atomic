import React, { useState } from 'react'
import { Button, ButtonProps } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

// ダブルクリックでの2重送信をしないためのButtonコンポーネント
export default function CustomButton(props: ButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { children, onClick, ...elseProps } = props
  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setLoading(true)
    await onClick(event)
    setLoading(false)
  }
  return (
    <Button
      {...elseProps}
      disabled={elseProps.disabled ? elseProps.disabled : loading}
      onClick={handleClick}
    >
      {loading && <CircularProgress className="mr-6" size={20} />}
      {loading && children}
      {!loading && children}
    </Button>
  )
}
