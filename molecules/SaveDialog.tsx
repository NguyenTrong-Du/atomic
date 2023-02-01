import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core'
import Button from '@components/atoms/Button'
import Const from '@constants/index'
import { createStyles, makeStyles } from '@material-ui/core/styles'

interface Props {
  onCancel: () => void
  onSave: () => void
  children: JSX.Element
  title: string
  open: boolean
  disabled?: boolean
}
function SaveDialog(props: Props): JSX.Element {
  const { onCancel, onSave, title, open, children, disabled } = props
  const classes = useStyles()

  const handleCancel = () => {
    onCancel()
  }
  const handleSave = async () => {
    await onSave()
    // NOTE::この実装だとキャンセルをクリックした時のみの動作を親で実装する時には注意が必要
    onCancel()
  }
  return (
    <Dialog
      onClose={onCancel}
      aria-labelledby="simple-dialog-title"
      maxWidth="sm"
      open={open}
      fullWidth
      classes={{ paper: classes.dialogRoot }}
    >
      <DialogTitle classes={{ root: classes.title }} id="simple-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions classes={{ root: classes.root }} disableSpacing>
        <Button
          variant="outlined"
          size="small"
          classes={{ root: classes.cancelBtn }}
          onClick={handleCancel}
        >
          {Const.BTN_NAME.CANCEL}
        </Button>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          disabled={disabled}
          onClick={handleSave}
          classes={{ root: classes.saveBtn }}
        >
          {Const.BTN_NAME.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      paddingBottom: 0
    },
    root: {
      paddingBottom: 16,
      paddingRight: 24,
      paddingLeft: 24
    },
    saveBtn: {
      marginLeft: 15,
      padding: 9
    },
    cancelBtn: {
      padding: 9
    },
    dialogRoot: {
      width: '100%'
    }
  })
)
export default SaveDialog
