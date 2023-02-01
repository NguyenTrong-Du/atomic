import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'

export default function CheckboxLabels(props: CheckboxProps) {
  const { checked: value, name, onChange, style } = props
  const classes = useStyles(style)

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          name={name}
          onChange={(e, checked) => onChange(e, checked)}
          color="default"
          classes={{
            root: classes.checkboxRoot,
            checked: classes.checked
          }}
        />
      }
      // eslint-disable-next-line react/destructuring-assignment
      label={props['aria-label']}
      classes={{ root: classes.root }}
    />
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    root: (props: any) => ({
      ...props
    }),
    label: {
      fontWeight: 'bold'
    },
    checkboxRoot: {
      color: '#A5A9B1',
      checked: {}
    },
    checked: {
      color: '#28B4B4'
    }
  })
)
