import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
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
  Toolbar,
  ColumnChooser,
  TableFixedColumns
} from '@devexpress/dx-react-grid-material-ui'
import { connectProps } from '@devexpress/dx-react-core'
import { Paper, Box } from '@material-ui/core'
import Loading from '@components/atoms/Loading'
import Pagination from '@hooks/usePagination'
import IdPagination from '@hooks/useIdPagination'
import { Props as PaginationProps } from '@hooks/usePagination/enhance'
import { Props as IdPaginationProps } from '@hooks/useIdPagination/enhance'
import { Edge as SkusEdge } from '@typeDefs/stockSkus'
import { Edge as ParentSkuEdge } from '@typeDefs/stockParentSkus'
import { Edge as ProductCodeEdge } from '@typeDefs/stockProductCodes'
import Button from '@components/atoms/Button'
import Const from '@constants/index'
import Icon from '@components/atoms/Icons'
import TableHeader from '@components/molecules/TableHeader'
import CustomChooseColumn, { ColumnChooserOverlay } from './useColumnChooser'
import { useColumnChooser } from './useColumnChooser/enhance'
// テーブル
const TableRoot = (props) => (
  <TGrid.Root {...props} style={{ height: 'calc(100vh - 16rem)' }} />
)
interface Props {
  filterComponent?: JSX.Element
  tableHeaderRowComponent?
  tableCellComponent
  cacheKey: string
  edges: SkusEdge[] | ParentSkuEdge[] | ProductCodeEdge[]
  pagination?: PaginationProps
  idPagination?: IdPaginationProps
  sortingState: SortingStateProps
  switchProps?: {
    checked: boolean
    onChange: () => void
  }
  handleOpenSideBar?: () => void
  useFilter?: boolean
}
const columns: Column[] = [
  { name: 'deleteButton', title: '  ' },
  { name: 'image', title: '  ' },
  { name: 'skuCustomerId', title: 'SKU' },
  { name: 'parentSkuCustomerId', title: '親SKU' },
  { name: 'productCodeCustomerId', title: '品番' },
  { name: 'stockQuantity', title: '移動数' },

  { name: 'indexType', title: 'ディストリビュート指標' },
  {
    name: 'recommendedSendStockQuantityCentral',
    title: '倉庫出荷'
  },
  {
    name: 'recommendedSendStockQuantityOthers',
    title: '他店舗回収'
  },
  {
    name: 'recommendedSendStockQuantityAll',
    title: '倉庫出荷+他店舗回収'
  },
  { name: 'shortageStockQuantity', title: '不足在庫数' },
  { name: 'excessStockQuantity', title: '余剰在庫数' },
  { name: 'indexType', title: '基本指標' },
  { name: 'salesAmount', title: '売上金額' },
  { name: 'grossProfitAmount', title: '粗利金額' },
  { name: 'salesQuantity', title: '販売数' },
  { name: 'stockQuantityCentral', title: '倉庫在庫数' },
  { name: 'stockAmountCentral', title: '倉庫在庫金額(商品原価)' },
  { name: 'stockAmountCentralRetailPrice', title: '倉庫在庫金額(定価)' },
  { name: 'backlogStockQuantity', title: '発注残' },
  { name: 'stockQuantityAll', title: '全社在庫数' },
  { name: 'stockAmountAll', title: '全社在庫金額(商品原価)' },
  { name: 'stockAmountAllRetailPrice', title: '全社在庫金額(定価)' },

  { name: 'indexType', title: '単価分析指標' },
  { name: 'averageCustomerUnitPrice', title: '客単価平均' },
  { name: 'averageGrossProfitUnitPrice', title: '粗利単価平均' },
  { name: 'skuUnitPrice', title: '商品単価' },
  { name: 'skuGrossProfitUnitPrice', title: '商品粗利単価' },

  { name: 'indexType', title: '予測系指標' },
  { name: 'salesContributionScore', title: '売上貢献度' },
  { name: 'grossProfitContributionScore', title: '粗利貢献度' },
  { name: 'stockRiskScore', title: '在庫リスク' },
  { name: 'predictedSoldoutDt', title: '完売予測日' },
  { name: 'predictedSoldoutDays', title: '完売予測日数' },
  { name: 'predictedSoldoutWeeks', title: '完売予測週数' },
  { name: 'indexType', title: '商品マスタ指標' },
  { name: 'retailPrice', title: '定価' },
  { name: 'wholesalePrice', title: '卸価格' },
  { name: 'costPrice', title: '商品原価' }
]
const TableComponent = ({
  filterComponent,
  tableHeaderRowComponent,
  tableCellComponent,
  edges,
  pagination,
  idPagination,
  sortingState,
  switchProps,
  handleOpenSideBar,
  useFilter
}: Props): JSX.Element => {
  const classes = useStyles()
  const tableClasses = tableStyle()

  // 親SKU,品番表示のとき(skus≠true)は親SKU,品番カラムを表示しない
  let excludeColumnName = []
  let fixedColumn = ['deleteButton', 'image', 'skuCustomerId']

  const excludeColumn = (colums: Column[]) => {
    return colums.filter((v) => !excludeColumnName.includes(v.name))
  }

  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'deleteButton', align: 'left', width: 46 },
    { columnName: 'image', align: 'center', width: 46 },
    { columnName: 'skuCustomerId', align: 'left', width: 280 },
    { columnName: 'parentSkuCustomerId', align: 'left' },
    { columnName: 'productCodeCustomerId', align: 'left' },

    { columnName: 'stockQuantity', align: 'left' },
    {
      columnName: 'recommendedSendStockQuantityAll',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    },
    {
      columnName: 'recommendedSendStockQuantityCentral',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    },
    {
      columnName: 'recommendedSendStockQuantityOthers',
      align: 'right',
      wordWrapEnabled: true,
      width: 120
    },
    {
      columnName: 'shortageStockQuantity',
      align: 'right',
      wordWrapEnabled: true,
      width: 125
    },
    {
      columnName: 'excessStockQuantity',
      align: 'right',
      wordWrapEnabled: true,
      width: 125
    },
    { columnName: 'averageCustomerUnitPrice', align: 'right' },
    { columnName: 'averageGrossProfitUnitPrice', align: 'right' },
    { columnName: 'skuUnitPrice', align: 'right' },
    { columnName: 'skuGrossProfitUnitPrice', align: 'right' },

    { columnName: 'salesAmount', align: 'right' },
    { columnName: 'grossProfitAmount', align: 'right' },
    { columnName: 'salesQuantity', align: 'right' },
    { columnName: 'stockQuantityCentral', align: 'right', width: 140 },
    {
      columnName: 'stockAmountCentral',
      align: 'right',
      wordWrapEnabled: true
    },
    {
      columnName: 'stockAmountCentralRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    },
    { columnName: 'backlogStockQuantity', align: 'right' },
    { columnName: 'stockQuantityAll', align: 'right' },
    {
      columnName: 'stockAmountAll',
      align: 'right',
      wordWrapEnabled: true
    },
    {
      columnName: 'stockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    },
    { columnName: 'salesContributionScore', align: 'right' },
    { columnName: 'grossProfitContributionScore', align: 'right' },
    { columnName: 'stockRiskScore', align: 'right' },
    { columnName: 'predictedSoldoutDt', align: 'right' },
    { columnName: 'predictedSoldoutDays', align: 'right' },
    { columnName: 'predictedSoldoutWeeks', align: 'right' },
    { columnName: 'retailPrice', align: 'right' },
    { columnName: 'wholesalePrice', align: 'right' },
    { columnName: 'costPrice', align: 'right' } //                      商品原価
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'deleteButton', sortingEnabled: false },
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'skuCustomerId', sortingEnabled: true },
    { columnName: 'parentSkuCustomerId', sortingEnabled: true },
    { columnName: 'productCodeCustomerId', sortingEnabled: true },
    { columnName: 'stockQuantity', sortingEnabled: false }
  ])

  const [defaultHiddenColumnNames] = useState([
    'indexType',
    'shortageStockQuantity',
    'shortageStockAmount',
    'shortageStockAmountRetailPrice',
    'excessStockQuantity',
    'excessStockAmount',
    'excessStockAmountRetailPrice',
    'salesAmount',
    'grossProfitAmount',
    'salesQuantity',
    'stockQuantityCentral',
    'stockAmountCentral',
    'stockAmountCentralRetailPrice',
    'backlogStockQuantity',
    'stockQuantityAll',
    'stockAmountAll',
    'stockAmountAllRetailPrice',
    'averageCustomerUnitPrice',
    'averageGrossProfitUnitPrice',
    'skuUnitPrice',
    'skuGrossProfitUnitPrice',
    'salesContributionScore',
    'grossProfitContributionScore',
    'stockRiskScore',
    'predictedSoldoutDt',
    'predictedSoldoutDays',
    'predictedSoldoutWeeks',
    'retailPrice',
    'wholesalePrice',
    'costPrice'
  ])
  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'deleteButton', togglingEnabled: false },
    { columnName: 'image', togglingEnabled: false },
    { columnName: 'skuCustomerId', togglingEnabled: false },
    { columnName: 'parentSkuCustomerId', togglingEnabled: false },
    { columnName: 'productCodeCustomerId', togglingEnabled: false }
  ])

  // devexpressコンポーネントoverlay
  const [chooser, handleOpenChooser, handleCloseChooser] = useColumnChooser()
  const overlayChooser = connectProps(ColumnChooserOverlay, () => {
    return {
      chooser,
      onClose: handleCloseChooser
    }
  })

  const elementTableHeader = useRef(null)
  const [mbResetTH, setMbResetTH] = useState('mb-0') // TH = TableHeader

  const checkHeight = (elementHeight: number) => {
    if (elementHeight > 75) {
      // 一行表示の場合、TableHeaderのHeight_max = 66.75
      setMbResetTH('mb-10')
    } else {
      setMbResetTH('mb-0')
    }
  }

  useEffect(() => {
    // if not resizing the window
    let elementHeight =
      elementTableHeader.current.getBoundingClientRect().height
    checkHeight(elementHeight)

    // if resizing the window
    const resizeWindow = () => {
      let elmHeight = elementTableHeader.current.getBoundingClientRect().height
      checkHeight(elmHeight)
    }

    window.addEventListener('resize', resizeWindow)
    return () => window.removeEventListener('resize', resizeWindow)
  })

  return (
    <Paper className={tableClasses.tablePaper} square>
      <div ref={elementTableHeader}>
        <TableHeader
          buttonComponent={
            <Box display="flex" flexDirection="row" alignItems="center">
              {useFilter && (
                <Box
                  mr={1}
                  onClick={handleOpenSideBar}
                  className={classes.boxControl}
                >
                  <Icon>icon_control</Icon>
                </Box>
              )}
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                disableElevation
                onClick={(event) => handleOpenChooser(event)}
                className={mbResetTH}
              >
                {Const.BTN_NAME.CHANGE_INDEX}
              </Button>
            </Box>
          }
          paginationComponent={pagination && <Pagination {...pagination} />}
          idPaginationComponent={
            idPagination && <IdPagination {...idPagination} />
          }
          switchProps={switchProps}
          className="pt-6 pb-6"
          classes={classes}
        >
          {filterComponent}
        </TableHeader>
      </div>
      {!edges ? (
        <Loading />
      ) : (
        <>
          <TGrid
            rows={edges}
            columns={excludeColumn(columns)}
            rootComponent={TableRoot}
          >
            <Table
              columnExtensions={tableColumnExtensions}
              cellComponent={tableCellComponent}
            />
            <SortingState
              {...sortingState}
              columnExtensions={sortColumnExtensions}
            />
            {tableHeaderRowComponent ? (
              <TableHeaderRow
                showSortingControls
                contentComponent={tableHeaderRowComponent}
              />
            ) : (
              <TableHeaderRow showSortingControls />
            )}
            <TableFixedColumns leftColumns={fixedColumn} />
            <TableColumnVisibility
              defaultHiddenColumnNames={defaultHiddenColumnNames}
              columnExtensions={tableColumnVisibilityColumnExtensions}
            />
            <Toolbar />
            <ColumnChooser
              overlayComponent={overlayChooser}
              itemComponent={CustomChooseColumn}
            />
          </TGrid>
        </>
      )}
    </Paper>
  )
}

export default TableComponent

const tableStyle = makeStyles(() => ({
  tablePaper: {
    paddingBottom: '4rem',
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
    '& td:first-child': {
      padding: 0
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
      paddingRight: '0.5rem'
    },
    '& .MuiToolbar-root': {
      display: 'none'
    }
  }
}))
const useStyles = makeStyles(() =>
  createStyles({
    switch: {
      '& span': {
        fontSize: 14
      }
    },
    boxControl: {
      cursor: 'pointer',
      height: '36px'
    }
  })
)
