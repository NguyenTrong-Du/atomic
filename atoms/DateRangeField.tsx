import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import {
  Grid,
  Box,
  Typography,
  IconButton,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core'
import DateRangeIcon from '@material-ui/icons/DateRange'
import SaveDialog from '@components/molecules/SaveDialog'
import DateField from '@components/atoms/DateField'
import Alert from '@components/atoms/Alert'

import { createStyles, makeStyles } from '@material-ui/core/styles'

export default function DateRangeField(props) {
  const { startValue, endValue, label, onChange } = props
  const classes = useStyles()
  const [startDate, setStartDate] = useState<string>(startValue)
  const [endDate, setEndDate] = useState<string>(endValue)
  const [isValidStartDate, setIsValidStartDate] = useState<boolean>(false)
  const [isValidEndDate, setIsValidEndDate] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>()
  const [open, setOpen] = useState<boolean>(false)
  const isValidRangeDate =
    startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))
  const hasErrorInput = isValidStartDate || isValidEndDate
  const handleSave = () => {
    setOpen(false)
    onChange({ salesStartDt: startDate, salesEndDt: endDate })
  }
  const onCancel = () => {
    setOpen(false)
    setStartDate(startValue)
    setEndDate(endValue)
  }
  const onChangeDate = (onSaveDate) => (event) => {
    const { value } = event.target
    const date = dayjs(value).isValid() ? value : null
    onSaveDate(date)
  }
  useEffect(() => {
    if (startValue && endValue) {
      setStartDate(startValue)
      setEndDate(endValue)
      setInputValue(
        `${dayjs(startValue).format('YYYY/MM/DD')}-${dayjs(endValue).format(
          'YYYY/MM/DD'
        )}`
      )
    }
  }, [startValue, endValue])

  return (
    <Grid container>
      <OutlinedInput
        className={classes.field}
        readOnly
        onClick={() => setOpen(true)}
        type="text"
        value={inputValue}
        labelWidth={0}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onMouseDown={(event) => event.preventDefault()}
              edge="end"
            >
              <DateRangeIcon />
            </IconButton>
          </InputAdornment>
        }
      />
      <SaveDialog
        title={label}
        open={open}
        onSave={handleSave}
        disabled={!(startDate && endDate) || isValidRangeDate || hasErrorInput}
        onCancel={onCancel}
      >
        <>
          <Alert visible={isValidRangeDate} severity="error">
            終了日には開始日より後の日付を指定してください
          </Alert>
          <Box m={2}>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <DateField
                  defaultValue={startValue}
                  onChange={onChangeDate(setStartDate)}
                  onError={(error) => setIsValidStartDate(Boolean(error))}
                />
              </Grid>
              <Box m="auto">
                <Typography variant="inherit" display="inline">
                  〜
                </Typography>
              </Box>
              <Grid item xs={5}>
                <DateField
                  defaultValue={endValue}
                  onChange={onChangeDate(setEndDate)}
                  onError={(error) => setIsValidEndDate(Boolean(error))}
                />
              </Grid>
            </Grid>
          </Box>
        </>
      </SaveDialog>
    </Grid>
  )
}
const useStyles = makeStyles(() =>
  createStyles({
    field: {
      backgroundColor: 'white',
      minWidth: '300px',
      '& input': {
        padding: '0.5rem'
      }
    }
  })
)
