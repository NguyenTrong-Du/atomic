import React, { useState } from 'react'
import {
  InputAdornment,
  IconButton,
  TextFieldProps,
  TextField
} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { createStyles, makeStyles } from '@material-ui/core/styles'

export default function PasswordField(props: TextFieldProps): JSX.Element {
  const classes = useStyles()
  const [show, setShow] = useState<boolean>(false)
  return (
    <TextField
      {...props}
      className={classes.field}
      variant="outlined"
      type={show ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShow(!show)}
              onMouseDown={(event) => event.preventDefault()}
            >
              {show ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}
const useStyles = makeStyles(() =>
  createStyles({
    field: {
      backgroundColor: 'white',
      '& input': {
        padding: '0.5rem'
      }
    }
  })
)
