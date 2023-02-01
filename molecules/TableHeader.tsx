import React, { useState, useEffect, useRef } from 'react'
import { Box, FormControlLabel, Theme, Typography } from '@material-ui/core'
import Switch from '@components/atoms/Switch'
import CommonCss from '@styles/commonCss'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Const from '@constants'

interface ListTableHeaderProps {
  children: JSX.Element
  buttonComponent: React.ReactElement
  paginationComponent: React.ReactElement
  idPaginationComponent: React.ReactElement
  switchProps?: {
    checked: boolean
    onChange: () => void
    switchLabel?: string
  }
  className?: string
  classes?: ClassNameMap
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ListTableHeader(props: ListTableHeaderProps) {
  const {
    children,
    buttonComponent,
    paginationComponent,
    idPaginationComponent,
    switchProps,
    className
  } = props
  const classes = useStyles()

  // Divider height
  const styleDivider = {
    height: `${Math.round(
      Const.TABLE_HEADER_SWITCH_PROPS.HEIGHT
    ).toString()}px`,
    marginTop: `${Math.round(
      Const.TABLE_HEADER_SWITCH_PROPS.MARGINTOP
    ).toString()}px`
  }
  const [dividerStyle, setDividerStyle] = useState(styleDivider)

  const elementSwitch = useRef(null)
  const elementBox = useRef(null)

  useEffect(() => {
    const resizeWindow = () => {
      const elmSwitchObject = elementSwitch.current.getBoundingClientRect()
      const elmBoxObject = elementBox.current.getBoundingClientRect()

      let elmHeight =
        elmSwitchObject.height + (elmBoxObject.bottom - elmSwitchObject.bottom)
      let elmMarginTop = elmSwitchObject.top - elmBoxObject.top

      let style = {
        height: `${Math.round(elmHeight).toString()}px`,
        marginTop: `${Math.round(elmMarginTop).toString()}px`
      }
      setDividerStyle(style)
    }

    window.addEventListener('resize', resizeWindow)
    return () => window.removeEventListener('resize', resizeWindow)
  })

  return (
    <>
      <Box {...CommonCss.jcBetweenItemsCenter} className={className}>
        <Box {...CommonCss.jcBetweenItemsCenter}>
          <Box {...CommonCss.jcStartItemsCenterWrap}>
            {buttonComponent}
            {children}
          </Box>
        </Box>
        <Box {...CommonCss.jcEndItemsCenter}>
          <div ref={elementSwitch}>
            <Box className={classes.root}>
              <Box {...CommonCss.jcEndItemsCenter}>
                {switchProps && (
                  <FormControlLabel
                    control={<Switch {...switchProps} />}
                    label={
                      switchProps.switchLabel ? (
                        <Typography variant="subtitle2">
                          {switchProps.switchLabel}
                        </Typography>
                      ) : (
                        <Typography variant="subtitle2">選択中</Typography>
                      )
                    }
                  />
                )}
              </Box>
            </Box>
          </div>
          {switchProps && (
            <Divider
              style={dividerStyle}
              orientation="vertical"
              variant="middle"
              flexItem
            />
          )}
          <div className={classes.minWidthPagination} ref={elementBox}>
            {paginationComponent}
          </div>
          {idPaginationComponent}
        </Box>
      </Box>
    </>
  )
}

export default ListTableHeader

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        marginTop: theme.spacing(1)
      },
      marginBottom: '.2rem',
      marginRight: '-1rem'
    },
    minWidthPagination: {
      minWidth: '24.125rem'
    }
  })
)
