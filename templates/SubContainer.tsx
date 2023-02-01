import React from 'react'
import { Container } from '@material-ui/core'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@material-ui/core/styles'

interface Props {
  children: any
  className?: any
  wide?: boolean
}
/**
 * ./Sidebarと併用するコンテナ
 */
const SubContainer: React.FC<Props> = (props: Props) => {
  const { className, children, wide } = props
  const classes = useStyles()
  return (
    <>
      <main
        className={clsx(classes.content, !wide && classes.short, className)}
      >
        <Container maxWidth="xl" disableGutters>
          {children}
        </Container>
      </main>
    </>
  )
}

export default SubContainer

const useStyles = makeStyles(() =>
  createStyles({
    content: {
      // padding: theme.spacing(3), //HACK: propsから指定したい
      flexGrow: 1,
      height: '100%',
      width: '100vh'
    },
    short: {
      marginLeft: 280 // HACK: propsから指定したい
    }
  })
)
