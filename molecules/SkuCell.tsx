import React from 'react'
import clsx from 'clsx'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Tooltip } from '@material-ui/core'

const SkuCell = (props) => {
  const { name, customerId, onClick, title } = props
  const classes = useStyles()
  return (
    <>
      <Grid item>
        <Typography
          variant={title ? 'body1' : 'subtitle1'}
          className={clsx(classes.labelSmall, classes.text)}
        >
          {customerId}
        </Typography>
      </Grid>
      <Grid item>
        {onClick ? (
          <a href="#" onClick={() => onClick()}>
            <Tooltip title={name}>
              <Typography
                variant={title ? 'h5' : 'subtitle2'}
                color="primary"
                className={classes.text}
              >
                {name}
              </Typography>
            </Tooltip>
          </a>
        ) : (
          <Tooltip title={name}>
            <Typography
              variant={title ? 'h5' : 'subtitle2'}
              className={classes.text}
            >
              {name}
            </Typography>
          </Tooltip>
        )}
      </Grid>
    </>
  )
}
export default SkuCell

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelSmall: {
      fontWeight: 'normal',
      fontSize: 12,
      lineHeight: '22px',
      marginLeft: '4px',
      marginRight: '8px',
      color: '#787E8A'
    },
    text: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }
  })
)
