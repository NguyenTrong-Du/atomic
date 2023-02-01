import React from 'react'
import { ColumnChooser } from '@devexpress/dx-react-grid-material-ui'
import { makeStyles, createStyles } from '@material-ui/core/styles'

/**
 * カラム選択に表示しない列を指定
 * @param props
 */
export default function CustomChooseColumn(props) {
  const { item } = props
  const classes = useStyles()
  switch (item.column.name) {
    case 'productGroup':
      return <></>
    case 'indexType':
      return (
        <>
          <div className={classes.link}>{item.column.title}</div>
        </>
      )
    default:
      return <ColumnChooser.Item {...props} />
  }
}
/**
 * Overlayコンポーネント
 * @param props
 */
export const ColumnChooserOverlay = (props) => {
  const { chooser } = props
  return (
    <ColumnChooser.Overlay
      {...props}
      visible={Boolean(chooser)}
      target={chooser}
    />
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      paddingTop: '0.8rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      paddingBottom: '0.05rem',
      color: '#1E283C',
      fontWeight: 'bold'
    }
  })
)
