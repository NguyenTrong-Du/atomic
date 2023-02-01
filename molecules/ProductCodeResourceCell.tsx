import React from 'react'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Tooltip } from '@material-ui/core'

const ProductCodeResourceCell = (props) => {
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
      <Grid item className={classes.nameCell}>
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
export default ProductCodeResourceCell

const useStyles = makeStyles(() =>
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
    },
    nameCell: {
      marginLeft: '.25rem'
    },
    tooltip: {
      position: 'relative',
      top: -10
    },
    link: {
      position: 'relative',
      bottom: 10
    }
  })
)
