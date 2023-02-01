import React, { useState } from 'react'
import clsx from 'clsx'
import { withRouter, useRouter } from 'next/router'
import { Box, FormControl, InputLabel } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { signIn, signOut } from '@middleware/auth'
import TextField from '@components/atoms/TextField'
import PasswordField from '@components/atoms/PasswordField'
import { useSnackbar } from '@context/snackbar'
import { cache as swrCache } from 'swr'
import axios from '@lib/axios'
import Const from '@constants'
import { v5 as uuidv5 } from 'uuid'
import Button from '@components/atoms/Button'

interface State {
  email: string
  password: string
}

/**
 * ログインフォーム
 * @param props
 */
const LoginForm = (props) => {
  const classes = useStyles()
  const router = useRouter()
  const { onFirstLogin } = props
  const { onError } = useSnackbar()
  const [formValues, setFormValues] = useState<State>({
    email: '',
    password: ''
  })
  const [inputEmailErrMsg, setInputEmailErrMsg] = useState<string>('')

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({ ...formValues, [prop]: event.target.value })
      // form validation
      switch (prop) {
        case 'email':
          if (event.target.validity.valid) {
            setInputEmailErrMsg('')
            return
          }
          setInputEmailErrMsg(Const.ERR_MSG.EMAIL)
          break
        default:
      }
    }

  const handleLogin = async () => {
    await signIn(formValues)
      .then(async (user) => {
        const hasChallenge = Object.prototype.hasOwnProperty.call(
          user,
          'challengeName'
        )
        // swrキャッシュクリア
        swrCache.clear()

        // サブドメイン取得
        // ※ローカル時、
        //  招待ユーザーの場合は指定されたwebsiteをサブドメインとみなす
        //  新規ユーザーは固定値
        const subdomain =
          process.env.NODE_ENV === 'production'
            ? window.location.host.split('.').shift()
            : user.attributes?.website || 'demo'

        // 通常ログイン時処理
        if (!hasChallenge) {
          if (user.attributes.website !== subdomain) {
            signOut()
            throw Error('メールアドレスもしくはパスワードが正しくありません')
          }
          router.push('/home')
        }

        // 初回ログイン時処理
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          // 招待ユーザーの場合のみサブドメインチェックを行う
          if (
            user.attributes?.website &&
            user.attributes?.website !== subdomain
          ) {
            throw Error('メールアドレスもしくはパスワードが正しくありません')
          }
          onFirstLogin({
            cognitoUser: user,
            requiredAttribute: { website: subdomain }
          })
        }

        // TODO: APP-841
        // // 初回ログイン時処理
        // if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        //   // 招待ユーザーの場合のみサブドメインチェックを行う
        //   if (
        //     user.attributes?.website &&
        //     user.attributes?.website !== subdomain
        //   ) {
        //     throw Error('メールアドレスもしくはパスワードが正しくありません')
        //   }
        //   onFirstLogin({
        //     cognitoUser: user,
        //     requiredAttribute: { website: subdomain }
        //   })
        //   return user
        // }

        // // 該当ドメインにユーザーが存在するか確認
        // const { data } = await axios.post(`/api/settings/user`, {
        //   id: await uuidv5(
        //     user?.attributes?.email ||
        //       user?.challengeParam?.userAttributes?.email,
        //     Const.UUID_V5_FORMAT
        //   )
        // })

        // if (!hasChallenge && data?.enabled) {
        //   // if (user.attributes.website !== subdomain) {
        //   //   signOut()
        //   //   throw Error('メールアドレスもしくはパスワードが正しくありません')
        //   // }
        //   router.push('/home')
        // }

        return user
      })
      .catch((err) => {
        console.error(err)
        switch (err.code) {
          case 'NotAuthorizedException':
            err.message = 'メールアドレスもしくはパスワードが正しくありません'
            break
          default:
            console.error(err)
        }
        onError(err.message)
      })
  }
  return (
    <>
      <FormControl className={clsx(classes.textForm)}>
        <InputLabel classes={{ root: classes.inputLabel }} shrink>
          メールアドレス
        </InputLabel>
        <TextField
          error={!!inputEmailErrMsg}
          name="email"
          variant="outlined"
          onChange={handleChange('email')}
          value={formValues.email}
          inputProps={{
            pattern: Const.VALIDATION_REGS.EMAIL
          }}
          helperText={inputEmailErrMsg}
          FormHelperTextProps={{ classes: { root: classes.formHelperText } }}
        />
      </FormControl>
      <FormControl className={clsx(classes.textForm)}>
        <InputLabel classes={{ root: classes.inputLabel }} shrink>
          パスワード
        </InputLabel>
        <PasswordField
          onChange={handleChange('password')}
          value={formValues.password}
          inputProps={{
            pattern: Const.VALIDATION_REGS.PW
          }}
        />
      </FormControl>
      <Box fontWeight="fontWeightBold" mt={4}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          className={clsx(classes.button)}
          aria-label="ログイン"
          value="legacy"
          disabled={!(formValues.email && formValues.password)}
          onClick={handleLogin}
        >
          ログイン
        </Button>
      </Box>
      <Box mt={3}>
        <Button
          color="primary"
          onClick={() => {
            props.onChangeModeNext()
          }}
        >
          パスワードをお忘れの方
        </Button>
      </Box>
    </>
  )
}
export default withRouter(LoginForm)
const useStyles = makeStyles(() =>
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
