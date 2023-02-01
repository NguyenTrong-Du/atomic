import React, { useState } from 'react'
import { Box, FormControl, InputLabel } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { forgetPassword } from '@middleware/auth'
import { useSnackbar } from '@context/snackbar'
import TextField from '@components/atoms/TextField'
import Const from '@constants/index'
import Button from '@components/atoms/Button'

/**
 * 確認コード送信フォーム
 * @param props
 */
const SendEmailForm = (props) => {
  const classes = useStyles()
  const { onSuccess, onError } = useSnackbar()
  const [email, setEmail] = useState('')
  const [inputEmailErrMsg, setInputEmailErrMsg] = useState<string>('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    if (event.target.validity.valid) {
      setInputEmailErrMsg('')
      return
    }
    setInputEmailErrMsg(Const.ERR_MSG.EMAIL)
  }
  const handleSendEmail = async () => {
    await forgetPassword(email)
      .then(() => {
        onSuccess('メールアドレスに確認コードを送信しました')
        props.onSendEmail(email)
        props.onChangeModeNext()
      })
      .catch((err) => {
        switch (err.code) {
          case 'LimitExceededException':
            err.message =
              'パスワード再設定回数の上限に達しました\nしばらくしてからもう一度お試し下さい'
            break
          case 'UserNotFoundException':
            err.message = '入力されたメールアドレスは登録されていません'
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
      <Box mb={3} fontWeight={100}>
        パスワード再設定用の確認コードをお送りします。
      </Box>
      <FormControl className={classes.textForm}>
        <InputLabel classes={{ root: classes.inputLabel }} shrink>
          メールアドレス
        </InputLabel>
        <TextField
          error={!!inputEmailErrMsg}
          name="email"
          variant="outlined"
          onChange={handleChange}
          value={email}
          inputProps={{
            pattern: Const.VALIDATION_REGS.EMAIL
          }}
          helperText={inputEmailErrMsg}
          FormHelperTextProps={{ classes: { root: classes.formHelperText } }}
        />
      </FormControl>
      <Box fontWeight="fontWeightBold" mt={4}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          className={classes.button}
          aria-label="送信"
          value="legacy"
          disabled={!email}
          onClick={handleSendEmail}
        >
          送信
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

export default SendEmailForm
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
    inputLabel: {
      marginBottom: '.5em'
    },
    formHelperText: {
      marginRight: 0,
      marginLeft: '.1rem',
      marginTop: '.4rem'
    }
  })
)
