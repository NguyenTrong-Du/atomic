import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import {
  Popover,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Grid,
  InputAdornment,
  FormHelperText
} from '@material-ui/core'
import Button from '@components/atoms/Button'
import Const from '@constants/index'
import TextField, { NumberFormatCustom } from '@components/atoms/TextField'

const MODE = {
  QUANTITY: 1,
  RATE: 2
} as const
const SetDesiredPricesButton = (props) => {
  const classes = useStyles()
  const { onSetting } = props
  const [open, setOpen] = useState<null | HTMLElement>(null)
  const [value, setValue] = useState<number>(null)
  const [option, setOption] = useState<string>('recommendedCollectQuantityAll')
  const handleChangeOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(null)
    setOption(event.target.value)
  }
  const handleChangeValue = (val) => {
    setValue(val)
  }
  const handleSetting = async () => {
    await onSetting({ option, value })
    setOpen(null)
  }
  return (
    <>
      <Button
        type="submit"
        variant="contained"
        size="large"
        color="secondary"
        disableElevation
        onClick={(event) => setOpen(event.currentTarget)}
      >
        回収在庫数を一括設定
      </Button>
      <Popover
        id="desirePrice-menu"
        anchorEl={open}
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        classes={{ paper: classes.popoverRoot }}
      >
        <Box m={1}>
          <FormControl component="fieldset">
            <RadioGroup value={option} onChange={handleChangeOption}>
              <Grid container className={classes.gridRow} justify="flex-start">
                <FormControlLabel
                  value="recommendedCollectQuantityAll"
                  label="すべての推奨回収在庫数"
                  control={<Radio />}
                />
              </Grid>
              <Option
                mode={MODE.QUANTITY}
                selectValue={option}
                optionValue="collectQuantity"
                optionLabel="回収在庫数"
                onChange={(event) =>
                  handleChangeValue((event.target as HTMLInputElement).value)
                }
              />
              <Option
                mode={MODE.RATE}
                selectValue={option}
                optionValue="collectRate"
                optionLabel="回収在庫率"
                onChange={(event) =>
                  handleChangeValue((event.target as HTMLInputElement).value)
                }
              />
            </RadioGroup>
          </FormControl>
          <Grid container justify="flex-end" className="mt-4">
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpen(null)}
              >
                {Const.BTN_NAME.CANCEL}
              </Button>
            </Grid>
            <Grid item className="ml-4">
              <Button
                variant="contained"
                size="small"
                color="secondary"
                disabled={!value && option !== 'recommendedCollectQuantityAll'}
                onClick={handleSetting}
              >
                {Const.BTN_NAME.SETTING}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  )
}
export default SetDesiredPricesButton
const Option = (props) => {
  const { mode, selectValue, optionValue, optionLabel, onChange } = props
  const classes = useStyles()
  const [error, setError] = useState<boolean>(false)
  return (
    <Grid
      container
      className={classes.gridRow}
      justify="space-between"
      alignItems="flex-start"
    >
      <FormControlLabel
        value={optionValue}
        label={optionLabel}
        control={<Radio />}
      />
      {selectValue === optionValue && (
        <FormControl>
          <TextField
            onChange={(e) => {
              onChange(e)
              setError(false)
            }}
            error={error}
            onKeyDown={(event) => {
              // 全角文字エラー表示
              if (!/[0-9|Tab|Enter]/.test(event.key)) setError(true)
              // 全角数値もエラー表示
              if (/[0-9]/.test(event.key) && event.keyCode === 229) {
                setError(true)
              }
            }}
            onBlur={() => setError(false)}
            variant="outlined"
            className={classes.text}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {mode === MODE.QUANTITY ? '' : '%'}
                </InputAdornment>
              ),
              inputComponent:
                mode === MODE.QUANTITY ? NumberFormatCustom : RateFormat
            }}
          />
          {error && (
            <FormHelperText className="text-red whitespace-normal">
              半角数値を入力して下さい
            </FormHelperText>
          )}
        </FormControl>
      )}
    </Grid>
  )
}
const RateFormat = (numberFormatProps) => {
  return <NumberFormatCustom {...numberFormatProps} max={100} />
}
const useStyles = makeStyles(() =>
  createStyles({
    popoverRoot: {
      padding: '.5rem',
      marginTop: 35,
      minWidth: 315
    },
    text: {
      width: '7.5rem',
      backgroundColor: '#EBF0FA',
      '& fieldset': {
        borderColor: '#EBF0FA'
      }
    },
    gridRow: {
      height: '2.8rem',
      marginBottom: '.5rem'
    }
  })
)
