import React, { useState } from 'react'
import clsx from 'clsx'
import { Box, FormControl, InputLabel } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { completeNewPassword } from '@middleware/auth'
import { useSnackbar } from '@context/snackbar'
import PasswordField from '@components/atoms/PasswordField'
import Const from '@constants'
import Button from '@components/atoms/Button'

/**
 * 初回ログイン時パスワード更新
 * @param props
 */
const ForceUpdatePassForm = (props) => {
  const { user } = props
  const { onSuccess, onError } = useSnackbar()
  const classes = useStyles()
  const [newPassword, setNewPassword] = useState('')
  const [inputPwErrMsg, setInputPwErrMsg] = useState<string>('')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value)
    setInputPwErrMsg(event.target.validity.valid ? '' : Const.ERR_MSG.PW8)
  }
  const handleForceUpdate = async () => {
    const { cognitoUser, requiredAttribute } = user
    await completeNewPassword({ cognitoUser, requiredAttribute, newPassword })
      .then(() => {
        onSuccess('パスワードを更新しました')
        props.onChangeModeLogin()
      })
      .catch((err) => {
        console.error(err)
        switch (err.code) {
          case 'InvalidParameterException':
          case 'InvalidPasswordException':
            if (
              err.message ===
              'Provided password cannot be used for security reasons.'
            ) {
              // cognito特有のエラー
              err.message = Const.ERR_MSG.PW_SEC
            } else {
              // それ以外はパスワードのフォーマットエラーとする
              err.message = Const.ERR_MSG.PW8
            }
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
        初めてログインされる方
      </Box>
      <Box mb={3} fontWeight={100}>
        新しいパスワードを設定してください。
      </Box>
      <FormControl className={classes.textForm}>
        <InputLabel shrink>新しいパスワード</InputLabel>
        <PasswordField
          name="password"
          onChange={handleChange}
          value={newPassword}
          error={!!inputPwErrMsg}
          inputProps={{
            pattern: Const.VALIDATION_REGS.PW
          }}
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
          disabled={Boolean(!newPassword || inputPwErrMsg)}
          onClick={handleForceUpdate}
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
export default ForceUpdatePassForm
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
