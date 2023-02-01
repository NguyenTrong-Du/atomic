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
  onChangeConditionName: () => void
  childrenComponent?: JSX.Element
  title?: string
  open: boolean
  isDisabledButtonChange?: boolean
}
function EditConditionsDialog(props: Props): JSX.Element {
  const {
    onCancel,
    onChangeConditionName,
    title,
    open,
    childrenComponent,
    isDisabledButtonChange
  } = props
  const classes = useStyles()

  const handleCancel = () => {
    onCancel()
  }
  const handleChangeConditionName = async () => {
    await onChangeConditionName()
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
          onClick={handleChangeConditionName}
          classes={{ root: classes.saveBtn }}
          disabled={isDisabledButtonChange}
        >
          {Const.BTN_NAME.CHANGE_CONDITION_NAME}
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
export default EditConditionsDialog
