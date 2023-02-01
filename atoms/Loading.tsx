import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const Loading: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}
export default Loading

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      margin: theme.spacing(3)
    }
  })
)
