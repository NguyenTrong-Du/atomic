import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import {
  SortingState,
  SortingStateProps,
  Column
} from '@devexpress/dx-react-grid'
import {
  Grid as TGrid,
  VirtualTable as Table,
  Table as NormalTable,
  TableHeaderRow,
  TableColumnVisibility,
  TableSelection,
  Toolbar,
  TableFixedColumns
} from '@devexpress/dx-react-grid-material-ui'
import { Grid as MGrid, Paper, Box, FormControlLabel } from '@material-ui/core'
import Loading from '@components/atoms/Loading'
import Pagination from '@hooks/usePagination'
import { Props as PaginationProps } from '@hooks/usePagination/enhance'
import IdPagination from '@hooks/useIdPagination'
import { Props as IdPaginationProps } from '@hooks/useIdPagination/enhance'
import Switch from '@components/atoms/Switch'

// テーブル
const TableRoot = (props) => (
  <TGrid.Root {...props} style={{ height: 'calc(100vh - 138px)' }} />
)
interface Props {
  searchComponent?: JSX.Element
  tableHeaderRowComponent?
  tableCellComponent
  edges: any
  switchProps?: {
    checked: boolean
    onChange: () => void
  }
  pagination?: PaginationProps
  idPagination?: IdPaginationProps
  sortingState: SortingStateProps
  editConditionsComponent?: any
}
const TableComponent = ({
  searchComponent,
  tableHeaderRowComponent,
  tableCellComponent,
  edges,
  switchProps,
  pagination,
  idPagination,
  sortingState,
  editConditionsComponent
}: Props): JSX.Element => {
  const classes = useStyles()
  const tableClasses = tableStyle()

  let excludeColumnName = []
  const excludeColumn = (colums: Column[]) => {
    return colums.filter((v) => !excludeColumnName.includes(v.name))
  }

  // 基本のカラム設定
  const columns: Column[] = [
    { name: 'condition', title: '条件名' },
    { name: 'updatedAt', title: '更新日' },
    { name: 'updatedUser', title: '更新者' },
    { name: 'favoriteFlag', title: ' ' },
    { name: 'defaultFlag', title: ' ' },
    { name: 'edit', title: ' ' },
    { name: 'deleteButton', title: ' ' }
  ]

  // alignの調整
  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'condition', align: 'left' },
    { columnName: 'updatedAt', align: 'left', width: 180 },
    { columnName: 'updatedUser', align: 'left', width: 180 },
    { columnName: 'favoriteFlag', align: 'left', width: 50 },
    { columnName: 'defaultFlag', align: 'left', width: 50 },
    { columnName: 'edit', align: 'left', width: 50 },
    { columnName: 'deleteButton', align: 'left', width: 50 }
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'condition', sortingEnabled: false },
    { columnName: 'updatedAt', sortingEnabled: true },
    { columnName: 'updatedUser', sortingEnabled: false },
    { columnName: 'favoriteFlag', sortingEnabled: false },
    { columnName: 'defaultFlag', sortingEnabled: false },
    { columnName: 'edit', sortingEnabled: false },
    { columnName: 'deleteButton', sortingEnabled: false }
  ])

  // デフォルトで非表示にしたいカラムを指定
  const [defaultHiddenColumnNames] = useState([])
  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'condition', togglingEnabled: false },
    { columnName: 'updatedAt', togglingEnabled: false },
    { columnName: 'updatedUser', togglingEnabled: false },
    { columnName: 'favoriteFlag', togglingEnabled: false },
    { columnName: 'defaultFlag', togglingEnabled: false },
    { columnName: 'edit', togglingEnabled: false },
    { columnName: 'deleteButton', togglingEnabled: false }
  ])

  return (
    <Paper className={tableClasses.tablePaper} square>
      {editConditionsComponent}
      <MGrid container justify="space-between" className="p-4">
        <MGrid xs={5} container item>
          <Box ml={3} mt={1} mb={1}>
            {/* フィルターを追加 */}
            {searchComponent}
          </Box>
        </MGrid>
        <MGrid container item xs={7} justify="flex-end">
          {switchProps && (
            <FormControlLabel
              control={<Switch {...switchProps} />}
              className={classes.switch}
              label="お気に入り"
            />
          )}
          {pagination && <Pagination {...pagination} />}
          {idPagination && <IdPagination {...idPagination} />}
        </MGrid>
      </MGrid>

      {!edges ? (
        <Loading />
      ) : (
        <>
          <TGrid
            rows={edges}
            columns={excludeColumn(columns)}
            rootComponent={TableRoot}
          >
            <SortingState
              {...sortingState}
              columnExtensions={sortColumnExtensions}
            />
            <Table
              columnExtensions={tableColumnExtensions}
              cellComponent={tableCellComponent}
            />
            {tableHeaderRowComponent ? (
              <TableHeaderRow
                showSortingControls
                contentComponent={tableHeaderRowComponent}
              />
            ) : (
              <TableHeaderRow showSortingControls />
            )}
            <TableColumnVisibility
              defaultHiddenColumnNames={defaultHiddenColumnNames}
              columnExtensions={tableColumnVisibilityColumnExtensions}
            />
            <TableFixedColumns leftColumns={[TableSelection.COLUMN_TYPE]} />
            <Toolbar />
          </TGrid>
        </>
      )}
    </Paper>
  )
}
export default TableComponent
const useStyles = makeStyles(() =>
  createStyles({
    switch: {
      '& span': {
        fontSize: 14
      }
    }
  })
)

const tableStyle = makeStyles(() => ({
  tablePaper: {
    position: 'relative',
    width: '100%',
    border: 'none',
    boxShadow: 'none',
    '& table': {
      borderTop: 'solid 1px #d2d4d8',
      minWidth: 'inherit !important'
    },
    '& thead > tr': {
      height: 40
    },
    '& tbody > tr': {
      height: 40,
      '&:hover': {
        backgroundColor: '#f4f4f5'
      }
    },
    '& th': {
      background: '#ECEEF0',
      borderBottom: 'solid 1px #d2d4d8',
      borderRight: 'none',
      padding: 0,
      fontSize: 14,
      color: '#1e283c',
      fontWeight: 'bold',
      '& .Mui-disabled > svg': {
        opacity: 0
      },
      '& svg': {
        opacity: 0.2
      }
    },
    '& td': {
      borderBottom: 'solid 1px #d2d4d8',
      borderRight: 'none',
      fontSize: 14,
      padding: 0,
      color: '#1e283c',
      '& svg': {
        color: '#a5a9b1'
      }
    },
    '& th > div > thead': {
      width: '100%'
    },
    '& th > div': {
      justifyContent: 'flex-end'
    },
    '& td:last-child, th:last-child': {
      paddingRight: '1rem'
    },
    '& .MuiToolbar-root': {
      display: 'none'
    }
  }
}))
