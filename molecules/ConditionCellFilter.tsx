import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Tooltip } from '@material-ui/core'
import { ConditionCellPropsInterface } from '@typeDefs/conditionFilter'

const ConditionCell = ({
  condition
}: ConditionCellPropsInterface): JSX.Element => {
  const classes = useStyles()
  return (
    <Tooltip
      title={condition.name}
      placement="bottom"
      classes={{
        tooltip: classes.tooltip
      }}
    >
      <Grid item>
        <Typography variant="subtitle2" className={classes.textBlue}>
          {condition?.name}
        </Typography>
      </Grid>
    </Tooltip>
  )
}
export default React.memo(ConditionCell)

const useStyles = makeStyles(() =>
  createStyles({
    textRoot: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      letterSpacing: '0.006rem',
      paddingRight: '0.625rem'
    },
    textBlue: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      letterSpacing: '0.006rem',
      fontWeight: 700,
      color: '#1E3C8C',
      paddingRight: 10
    },
    tooltip: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: '1rem',
      letterSpacing: '0.006rem',
      backgroundColor: 'black',
      opacity: '.7',
      textAlign: 'center'
    }
  })
)
