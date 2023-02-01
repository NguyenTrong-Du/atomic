import { useState } from 'react'

// eslint-disable-next-line import/prefer-default-export
export const useColumnChooser = (): [
  React.MouseEvent,
  (event: React.MouseEvent | null) => void,
  () => void
] => {
  const [state, setState] = useState(null)
  const handleOpen = (event) => {
    setState(event.currentTarget)
  }
  const handleClose = () => {
    setState(null)
  }
  return [state, handleOpen, handleClose]
}
