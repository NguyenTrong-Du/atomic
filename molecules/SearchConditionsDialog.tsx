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
  onOverWriteSave: () => void
  onNewSave: () => void
  childrenComponent?: JSX.Element
  title?: string
  open: boolean
  disabledOverWriteSave?: boolean
  disabledNewSave?: boolean
}
function SearchConditionsDialog(props: Props): JSX.Element {
  const {
    onCancel,
    onOverWriteSave,
    onNewSave,
    title,
    open,
    childrenComponent,
    disabledOverWriteSave,
    disabledNewSave
  } = props
  const classes = useStyles()

  const handleCancel = () => {
    onCancel()
  }
  const handleOverWriteSave = async () => {
    await onOverWriteSave()
    onCancel()
  }
  const handleNewSave = async () => {
    await onNewSave()
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
      <DialogContent>{childrenComponent}</DialogContent>
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
          disabled={disabledOverWriteSave}
          onClick={handleOverWriteSave}
          classes={{ root: classes.saveBtn }}
        >
          {Const.BTN_NAME.OVERWRITE_SAVE}
        </Button>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          disabled={disabledNewSave}
          onClick={handleNewSave}
          classes={{ root: classes.saveBtn }}
        >
          {Const.BTN_NAME.NEW_SAVE}
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
export default SearchConditionsDialog
