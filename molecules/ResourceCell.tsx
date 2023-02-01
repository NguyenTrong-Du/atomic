import React from 'react'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Tooltip } from '@material-ui/core'

const ResourceCell = (props) => {
  const { name, customerId, onClick, title, receipt } = props
  const classes = useStyles()

  return (
    <>
      {/* SKU情報表示 */}
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
            <Tooltip
              title={`「${name}」のレシート・伝票一覧`}
              classes={{ tooltipPlacementBottom: classes.link }}
            >
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
          <>
            {title ? (
              <Typography variant="h5" className={classes.text}>
                {name}
              </Typography>
            ) : (
              <Tooltip
                title={name}
                classes={{
                  tooltipPlacementBottom: receipt
                    ? classes.receipt
                    : classes.link
                }}
              >
                <Typography variant="subtitle2" className={classes.name}>
                  {name}
                </Typography>
              </Tooltip>
            )}
          </>
        )}
      </Grid>
    </>
  )
}
export default ResourceCell

const useStyles = makeStyles(() =>
  createStyles({
    labelSmall: {
      fontWeight: 'normal',
      fontSize: 12,
      lineHeight: '22px',
      marginLeft: '1px',
      marginRight: '8px',
      color: '#787E8A'
    },
    text: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    },
    name: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      position: 'relative',
      bottom: '.2rem'
    },
    receipt: {
      position: 'relative',
      bottom: 10
    },
    link: {
      position: 'relative',
      bottom: 10
    }
  })
)
