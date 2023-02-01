/* eslint-disable no-return-assign */
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

interface Props {
  size?: number
  src?: string
}
const ImageCell = (props: Props): JSX.Element => {
  const { src, size } = props
  const classes = useStyles()
  const imgSize = size || 40
  return (
    <Grid item className={classes.image}>
      <img
        src={src || '/noimage.jpg'}
        onError={(e) => ((e.target as HTMLImageElement).src = '/noimage.jpg')}
        width={imgSize}
        height={imgSize}
        alt=""
      />
    </Grid>
  )
}
export default ImageCell

const useStyles = makeStyles(() =>
  createStyles({
    image: {
      marginTop: '3px',
      marginRight: '3px'
    }
  })
)
