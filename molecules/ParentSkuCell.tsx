import React from 'react'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Tooltip } from '@material-ui/core'
import { Table } from '@devexpress/dx-react-grid-material-ui'

const ParentSkuCell = (props) => {
  const { name, customerId } = props
  const classes = useStyles()
  return (
    <Table.Cell {...props}>
      <Grid item>
        <Typography
          variant="subtitle1"
          className={clsx(classes.labelSmall, classes.text)}
        >
          {customerId}
        </Typography>
      </Grid>
      <Grid item>
        <Tooltip title={name}>
          <Typography variant="body2" className={classes.text}>
            {name}
          </Typography>
        </Tooltip>
      </Grid>
    </Table.Cell>
  )
}
export default ParentSkuCell

const useStyles = makeStyles(() =>
  createStyles({
    labelSmall: {
      fontWeight: 'normal',
      fontSize: 12,
      lineHeight: '22px',
      marginLeft: '.1rem',
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
