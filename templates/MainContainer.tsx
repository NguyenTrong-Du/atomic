import React from 'react'
import { Container } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const MainContainer: React.FC = (props) => {
  const { children } = props
  const classes = useStyles()
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container disableGutters className={classes.container}>
        {children}
      </Container>
    </main>
  )
}

export default MainContainer

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto'
    },
    appBarSpacer: theme.mixins.toolbar,
    container: {
      maxWidth: 'initial',
      marginLeft: '0 !important',
      marginRight: '0 !important'
    }
  })
)
