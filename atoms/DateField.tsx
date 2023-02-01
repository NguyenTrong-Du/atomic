import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Grid, IconButton } from '@material-ui/core'
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps as MuiKeyboardDatePickerProps
} from '@material-ui/pickers'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'

type KeyboardDatePickerProps = Omit<MuiKeyboardDatePickerProps, 'value'>
type DateFieldProps = KeyboardDatePickerProps & {
  onChange: ({ target: { value: string } }) => void
  defaultValue?: string
  isSmallWidth?: boolean
}
const DateField = (props: DateFieldProps): JSX.Element => {
  const {
    required,
    defaultValue,
    onChange,
    isSmallWidth,
    ...restDateFieldProps
  } = props
  const classes = useStyles(isSmallWidth)
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>()
  const [open, setOpen] = React.useState<boolean>(false)
  const handleDateChange: KeyboardDatePickerProps['onChange'] = (date) => {
    setSelectedDate(date)
    setOpen(false)
    onChange({ target: { value: date.format('YYYY-MM-DD') } })
  }

  useEffect(() => {
    let initialValue = required ? dayjs() : null
    if (defaultValue) {
      initialValue = dayjs(defaultValue)
    }
    setSelectedDate(initialValue)
  }, [required, defaultValue])

  return (
    <Grid container justify="flex-start">
      <KeyboardDatePicker
        {...restDateFieldProps}
        required={required}
        className={classes.field}
        disableToolbar
        variant="inline"
        inputVariant="outlined"
        format="YYYY-MM-DD"
        value={selectedDate}
        invalidDateMessage=""
        allowKeyboardControl={false}
        minDateMessage="本日以降の日付を選択して下さい"
        maxDateMessage="指定可能範囲から選択して下さい"
        onChange={handleDateChange}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        PopoverProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 156
          }
        }}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={() => handleDateChange(null)}
              classes={{ root: classes.iconRoot }}
            >
              <ClearIcon />
            </IconButton>
          )
        }}
        InputAdornmentProps={{
          position: 'start'
        }}
      />
    </Grid>
  )
}

export default React.memo(DateField)

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: 0
    },
    field: {
      backgroundColor: 'white',
      width: (isSmallWidth) => {
        return isSmallWidth ? '90%' : '95%'
      },
      minWidth: '200px',
      '& input': {
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem'
      },
      '& div': {
        paddingRight: 0,
        paddingLeft: 0
      }
    },
    iconRoot: {
      padding: '0.34rem'
    }
  })
)
