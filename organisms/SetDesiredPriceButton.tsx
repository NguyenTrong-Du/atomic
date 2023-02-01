import React, { useState, useEffect } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import {
  Popover,
  ListItemText,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Box,
  Grid,
  InputAdornment,
  FormHelperText
} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import Button from '@components/atoms/Button'
import Const from '@constants/index'
import TextField, { NumberFormatCustom } from '@components/atoms/TextField'

const MODE = {
  RETAIL: 1, // 定価
  WHOLESALE: 2, // 卸価格
  COST: 3, // 商品原価
  SPECIFIED: 9 // 任意
} as const
const VALUE_TYPE = {
  AMOUNT: 1, // 円
  RATE: 2 // %
} as const
interface Props {
  onSetting: (value: { option: string; value: number | null }) => void
}
const SetDesiredPriceButton = ({ onSetting }: Props): JSX.Element => {
  const [open, setOpen] = useState<null | HTMLElement>(null)
  const [openSetting, setOpenSetting] = useState<null | HTMLElement>(null)
  const [mode, setMode] = useState<number>(null)
  const classes = useStyles()
  const closeAll = () => {
    setOpen(null)
    setOpenSetting(null)
  }
  const handleClick = (anchorEl, type) => {
    setMode(type)
    setOpenSetting(anchorEl)
  }
  const handleSetting = async ({ option, value }) => {
    await onSetting({ option, value })
    closeAll()
  }
  return (
    <>
      <Button
        type="submit"
        variant="contained"
        size="large"
        color="secondary"
        aria-label="予定売価を一括設定"
        value="legacy"
        disableElevation
        onClick={(event) => setOpen(event.currentTarget)}
      >
        予定売価を一括設定
      </Button>
      <Popover
        id="desiredPrice-menu"
        anchorEl={open}
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        classes={{ paper: classes.popoverRoot }}
      >
        <MenuItem
          onClick={(event) => handleClick(event.currentTarget, MODE.RETAIL)}
        >
          <ListItemText primary="基準：定価" />
          <NavigateNextIcon fontSize="small" />
        </MenuItem>
        <MenuItem
          onClick={(event) => handleClick(event.currentTarget, MODE.WHOLESALE)}
        >
          <ListItemText primary="基準：卸価格" />
          <NavigateNextIcon fontSize="small" />
        </MenuItem>
        <MenuItem
          onClick={(event) => handleClick(event.currentTarget, MODE.COST)}
        >
          <ListItemText primary="基準：商品原価" />
          <NavigateNextIcon fontSize="small" />
        </MenuItem>
        <MenuItem
          onClick={(event) => handleClick(event.currentTarget, MODE.SPECIFIED)}
        >
          任意の売価
        </MenuItem>
      </Popover>
      <DesiredPriceMenu
        mode={mode}
        open={openSetting}
        onClose={closeAll}
        onSetting={handleSetting}
      />
    </>
  )
}
export default SetDesiredPriceButton
const DesiredPriceMenu = (props) => {
  const { mode, open, onClose, onSetting } = props
  const classes = useStyles()
  const [option, setOption] = useState<string>(null)
  const [value, setValue] = useState<number>(null)
  const [valid, setValid] = useState<boolean>(false)

  // 設定ボタン活性判定
  useEffect(() => {
    const bool =
      !!value ||
      option === 'RETAIL_PRICE' ||
      option === 'WHOLESALE_PRICE' ||
      option === 'COST_PRICE'
    setValid(bool)
  }, [value, option])

  // ラジオ変更時は値を初期化
  useEffect(() => {
    setValue(null)
  }, [option])

  return (
    <Popover
      id="desiredPrice-amount-menu"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      anchorEl={open}
      open={Boolean(open)}
      onClose={() => onClose()}
      classes={{ paper: classes.optionPopoverRoot }}
    >
      <Box m={1}>
        <FormControl component="fieldset">
          <RadioGroup
            value={option}
            onChange={(event) => setOption(event.target.value)}
          >
            {mode === MODE.RETAIL && (
              <>
                <Option optionValue="RETAIL_PRICE" optionLabel="定価" />
                <Option
                  type={VALUE_TYPE.AMOUNT}
                  selectValue={option}
                  optionValue="RETAIL_DISCOUNT_PRICE"
                  optionLabel="値引額"
                  onChange={(event) => setValue(event.target.value)}
                />
                <Option
                  type={VALUE_TYPE.RATE}
                  selectValue={option}
                  optionValue="RETAIL_DISCOUNT_RATE"
                  optionLabel="値引率"
                  onChange={(event) => setValue(event.target.value)}
                />
              </>
            )}
            {mode === MODE.WHOLESALE && (
              <>
                <Option optionValue="WHOLESALE_PRICE" optionLabel="卸価格" />
                <Option
                  type={VALUE_TYPE.AMOUNT}
                  selectValue={option}
                  optionValue="WHOLESALE_DISCOUNT_PRICE"
                  optionLabel="値引額"
                  onChange={(event) => setValue(event.target.value)}
                />
                <Option
                  type={VALUE_TYPE.RATE}
                  selectValue={option}
                  optionValue="WHOLESALE_DISCOUNT_RATE"
                  optionLabel="値引率"
                  onChange={(event) => setValue(event.target.value)}
                />
              </>
            )}
            {mode === MODE.COST && (
              <>
                <Option optionValue="COST_PRICE" optionLabel="商品原価" />
                <Option
                  type={VALUE_TYPE.AMOUNT}
                  selectValue={option}
                  optionValue="GROSS_PROFIT_PRICE"
                  optionLabel="粗利額"
                  onChange={(event) => setValue(event.target.value)}
                />
                <Option
                  type={VALUE_TYPE.RATE}
                  selectValue={option}
                  optionValue="GROSS_PROFIT_RATE"
                  optionLabel="粗利率"
                  onChange={(event) => setValue(event.target.value)}
                />
              </>
            )}
            {mode === MODE.SPECIFIED && (
              <Option
                type={VALUE_TYPE.AMOUNT}
                selectValue={option}
                optionValue="SPECIFIED_PRICE"
                optionLabel="売価"
                onChange={(event) => setValue(event.target.value)}
              />
            )}
          </RadioGroup>
        </FormControl>
        <Grid container justify="flex-end" className="mt-12 mb-8">
          <Grid item>
            <Button variant="outlined" size="small" onClick={onClose}>
              {Const.BTN_NAME.CANCEL}
            </Button>
          </Grid>
          <Grid item className="ml-4">
            <Button
              variant="contained"
              size="small"
              color="secondary"
              disabled={!valid}
              onClick={async () => onSetting({ option, value })}
            >
              {Const.BTN_NAME.SETTING}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Popover>
  )
}
const Option = (props) => {
  const { type, selectValue, optionValue, optionLabel, onChange } = props
  const classes = useStyles()
  const [error, setError] = useState<boolean>(false)
  return (
    <Grid
      container
      justify="space-between"
      alignItems="flex-start"
      classes={{ root: classes.gridRow }}
    >
      <FormControlLabel
        value={optionValue}
        label={optionLabel}
        control={<Radio />}
      />
      {onChange && selectValue === optionValue && (
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
                  {type === VALUE_TYPE.AMOUNT ? '円' : '%'}
                </InputAdornment>
              ),
              inputComponent:
                type === VALUE_TYPE.AMOUNT ? NumberFormatCustom : RateFormat
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
      width: '11rem'
    },
    optionPopoverRoot: {
      width: '17rem'
    },
    gridRow: {
      padding: '.5rem',
      height: '2.8rem'
    },
    text: {
      width: '120px',
      backgroundColor: '#EBF0FA',
      '& fieldset': {
        borderColor: '#EBF0FA'
      }
    }
  })
)
