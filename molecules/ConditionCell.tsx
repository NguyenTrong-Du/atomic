import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Tooltip } from '@material-ui/core'

const ConditionCell = (props) => {
  const { condition } = props
  const classes = useStyles()
  return (
    <>
      <Tooltip
        title={condition.name}
        placement="bottom"
        classes={{
          tooltip: classes.tooltip
        }}
      >
        <Grid item>
          <Typography
            variant="subtitle2"
            className={
              condition.favoriteFlag ? classes.textBlue : classes.textRoot
            }
          >
            {condition.name}
          </Typography>
        </Grid>
      </Tooltip>
    </>
  )
}
export default ConditionCell

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textRoot: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0.1px',
      paddingRight: 10
    },
    textBlue: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0.1px',
      fontWeight: 700,
      color: '#1E3C8C',
      paddingRight: 10
    },
    tooltip: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: '16px',
      letterSpacing: '0.1px',
      backgroundColor: 'black',
      opacity: '.7',
      textAlign: 'center'
    }
  })
)
