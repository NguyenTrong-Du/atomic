import React from 'react'
import {
  TextField,
  TextFieldProps as MuiTextFieldProps
} from '@material-ui/core'
import NumberFormat from 'react-number-format'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@material-ui/core/styles'

type TextFieldProps = Omit<MuiTextFieldProps, 'InputProps'> & {
  InputProps?: Omit<
    MuiTextFieldProps['InputProps'],
    'inputComponent' | 'rowsMax'
  > & {
    // TODO: NumberFormatCustomPropsと型が合わないのでanyで逃げる
    inputComponent?: any
  }
  // v5でrowsMax->maxRowsに変わるらしい?
  maxRows?: MuiTextFieldProps['rowsMax']
}
const CustomText = (props: TextFieldProps): JSX.Element => {
  const { children, className, variant, maxRows, ...restProps } = props
  const classes = useStyles()
  return (
    <TextField
      {...restProps}
      // 型が合わないのを強引に
      // https://github.com/mui/material-ui/issues/15697
      variant={variant as any}
      className={clsx(classes.root, className)}
      rowsMax={maxRows}
    >
      {children}
    </TextField>
  )
}
export default CustomText

// Number Format
export interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  min?: number
  max?: number
  decimalScale?: number
}
export function NumberFormatCustom(
  props: NumberFormatCustomProps
): JSX.Element {
  const { inputRef, onChange, min, max, decimalScale, ...other } = props
  const withValueLimit = (inputObj) => {
    const { value } = inputObj
    if (value === '') return true
    const intValue =
      decimalScale && decimalScale > 0 ? parseFloat(value) : parseInt(value, 10)
    if (min !== undefined && intValue < min) {
      return false
    }
    if (max !== undefined && max < intValue) {
      return false
    }
    return true
  }
  return (
    <NumberFormat
      {...other}
      decimalScale={decimalScale}
      getInputRef={inputRef}
      isAllowed={withValueLimit}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        })
      }}
      allowNegative={false}
      thousandSeparator
      isNumericString
    />
  )
}
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: 'white',
      '& input': {
        paddingTop: '0.5rem !important',
        paddingBottom: '0.5rem !important'
      }
    }
  })
)
