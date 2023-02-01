import React, { useState } from 'react'
import clsx from 'clsx'
import { Box, FormControl, InputLabel } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { forgotPasswordSubmit } from '@middleware/auth'
import { useSnackbar } from '@context/snackbar'
import TextField from '@components/atoms/TextField'
import PasswordField from '@components/atoms/PasswordField'
import Const from '@constants'
import Button from '@components/atoms/Button'

interface ResetState {
  email: string
  code: string
  newPassword: string
}

/**
 * パスワード更新
 * @param props
 */
const SetNewPassForm = (props) => {
  const { resetEmail } = props
  const { onSuccess, onError } = useSnackbar()
  const classes = useStyles()
  const [resetValues, setResetValues] = useState<ResetState>({
    email: resetEmail,
    code: '',
    newPassword: ''
  })
  const [inputPwErrMsg, setInputPwErrMsg] = useState<string>('')
  const handleResetChange =
    (prop: keyof ResetState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setResetValues({ ...resetValues, [prop]: event.target.value })
      // form validation
      switch (prop) {
        case 'newPassword':
          if (event.target.validity.valid) {
            setInputPwErrMsg('')
            return
          }
          setInputPwErrMsg(Const.ERR_MSG.PW8)
          break
        default:
      }
    }
  const handleResetPassword = async () => {
    await forgotPasswordSubmit(resetValues)
      .then(() => {
        onSuccess('パスワードを更新しました')
        props.onChangeModeLogin()
      })
      .catch((err) => {
        switch (err.code) {
          case 'CodeMismatchException':
            err.message = '確認コードが正しくありません'
            break
          case 'ExpiredCodeException':
            err.message = '確認コードの有効期限が切れています'
            break
          default:
            console.error(err)
        }
        onError(err.message)
      })
  }
  return (
    <>
      <Box mb={5} fontWeight="fontWeightBold">
        パスワードをお忘れの方
      </Box>
      <Box fontWeight={100}>
        送信されたメールに記載されている確認コードを入力し、新しいパスワードを設定して下さい。
      </Box>
      <FormControl className={classes.textForm}>
        <InputLabel shrink>確認コード</InputLabel>
        <TextField
          name="code"
          variant="outlined"
          onChange={handleResetChange('code')}
          value={resetValues.code}
        />
      </FormControl>
      <FormControl className={classes.textForm}>
        <InputLabel shrink>新しいパスワード</InputLabel>
        <PasswordField
          name="password"
          error={!!inputPwErrMsg}
          onChange={handleResetChange('newPassword')}
          inputProps={{
            pattern: Const.VALIDATION_REGS.PW
          }}
          value={resetValues.newPassword}
          helperText={inputPwErrMsg}
          FormHelperTextProps={{ classes: { root: classes.formHelperText } }}
        />
      </FormControl>
      <Box fontWeight="fontWeightBold" mt={4}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          className={clsx(classes.button)}
          aria-label="パスワードを更新"
          value="legacy"
          disabled={
            !(
              resetValues.email &&
              resetValues.code &&
              resetValues.newPassword &&
              inputPwErrMsg.length === 0
            )
          }
          onClick={handleResetPassword}
        >
          パスワードを更新
        </Button>
      </Box>
      <Box mt={4}>
        <Button
          color="primary"
          onClick={() => {
            props.onChangeModeLogin()
          }}
        >
          ログインへ戻る
        </Button>
      </Box>
    </>
  )
}
export default SetNewPassForm
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      width: '100%',
      backgroundColor: '#2D5AF0',
      boxShadow: '0 2px 4px 0 rgba(30, 60, 140, 0.3)',
      borderRaidus: 4,
      color: 'white',
      '&:hover': {
        backgroundColor: '#14285a'
      }
    },
    textForm: {
      width: '100%',
      textAlign: 'left',
      marginBottom: '1rem',
      '& label': {
        position: 'relative'
      }
      // marginBottom: theme.spacing(2)
    },
    formHelperText: {
      marginRight: 0,
      marginLeft: '.1rem',
      marginTop: '.4rem'
    }
  })
)
