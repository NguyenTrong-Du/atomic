import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
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
import { Paper } from '@material-ui/core'
import Loading from '@components/atoms/Loading'
import Pagination from '@hooks/usePagination'
import { Props as PaginationProps } from '@hooks/usePagination/enhance'
import IdPagination from '@hooks/useIdPagination'
import { Props as IdPaginationProps } from '@hooks/useIdPagination/enhance'
import Const from '@constants/index'
import Button from '@components/atoms/Button'
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
  edges: any[]
  pagination?: PaginationProps
  idPagination?: IdPaginationProps
  sortingState: SortingStateProps
  loading?: boolean
}

const TableComponent = ({
  filterComponent,
  tableHeaderRowComponent,
  tableCellComponent,
  edges,
  pagination,
  idPagination,
  sortingState,
  loading
}: Props): JSX.Element => {
  const tableClasses = tableStyle()

  // 親SKU,品番表示のとき(skus≠true)表示しないカラムを指定
  let excludeColumnName = []
  let fixedColumn = ['productGroup']
  const excludeColumn = (colums: Column[]) => {
    return colums.filter((v) => !excludeColumnName.includes(v.name))
  }

  const columns: Column[] = [
    { name: 'productGroup', title: '商品グループ名' },
    { name: 'indexType', title: '基本指標' },
    { name: 'salesAmount', title: '売上金額' },
    { name: 'grossProfitAmount', title: '粗利金額' },
    { name: 'salesQuantity', title: '販売数' },
    { name: 'stockQuantity', title: '在庫数' },
    { name: 'stockAmount', title: '在庫金額(商品原価)' },
    { name: 'stockAmountRetailPrice', title: '在庫金額(定価)' },
    { name: 'stockQuantityCentral', title: '倉庫在庫数' },
    { name: 'stockAmountCentral', title: '倉庫在庫金額(商品原価)' },
    { name: 'stockAmountCentralRetailPrice', title: '倉庫在庫金額(定価)' },
    { name: 'stockQuantityAll', title: '全社在庫数' },
    { name: 'stockAmountAll', title: '全社在庫金額(商品原価)' },
    { name: 'stockAmountAllRetailPrice', title: '全社在庫金額(定価)' },
    { name: 'indexType', title: '予測系指標' },
    { name: 'salesContributionScore', title: '売上貢献度' },
    { name: 'grossProfitContributionScore', title: '粗利貢献度' },
    { name: 'indexType', title: 'クオリティ指標' },
    { name: 'bestSkuPercent', title: 'Best-SKU率' },
    { name: 'betterSkuPercent', title: 'Better-SKU率' },
    { name: 'goodSkuPercent', title: 'Good-SKU率' },
    { name: 'badSkuPercent', title: 'Bad-SKU率' },
    { name: 'outOfAnalysisSkuPercent', title: '分析対象外-SKU率' },
    { name: 'bestSkuKinds', title: 'Best-SKU数' },
    { name: 'betterSkuKinds', title: 'Better-SKU数' },
    { name: 'goodSkuKinds', title: 'Good-SKU数' },
    { name: 'badSkuKinds', title: 'Bad-SKU数' },
    { name: 'outOfAnalysisSkuKinds', title: '分析対象外-SKU数' },
    { name: 'indexType', title: '消化指標' },
    { name: 'stockConsumptionPercent', title: '消化率(推定)' },
    { name: 'properStockConsumptionPercent', title: 'プロパー消化率(推定)' }
  ]

  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'productGroup', align: 'left', width: 260 },
    { columnName: 'salesAmount', align: 'right' }, //                               売上金額
    { columnName: 'grossProfitAmount', align: 'right' }, //                         粗利金額
    { columnName: 'salesQuantity', align: 'right' }, //                             販売数
    {
      columnName: 'stockAmount',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, //                                                                           在庫金額(商品原価)
    { columnName: 'stockQuantityCentral', align: 'right' },
    {
      columnName: 'stockAmountCentral',
      align: 'right',
      wordWrapEnabled: true,
      width: 120
    },
    {
      columnName: 'stockAmountCentralRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 120
    },
    { columnName: 'stockQuantity', align: 'right' }, //                             在庫数
    {
      columnName: 'stockAmountRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //                                                                           在庫金額(定価)
    { columnName: 'stockQuantityAll', align: 'right' },
    {
      columnName: 'stockAmountAll',
      align: 'right',
      wordWrapEnabled: true,
      width: 120
    },
    {
      columnName: 'stockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 120
    },
    { columnName: 'stockConsumptionPercent', align: 'right' }, //                     消化率(推定)
    {
      columnName: 'properStockConsumptionPercent',
      align: 'right',
      wordWrapEnabled: true,
      width: 120
    },
    { columnName: 'bestSkuPercent', align: 'right' }, //                              Best-SKU率
    { columnName: 'betterSkuPercent', align: 'right' }, //                            Better-SKU率
    { columnName: 'goodSkuPercent', align: 'right' }, //                              Good-SKU率
    { columnName: 'badSkuPercent', align: 'right' }, //                               Bad-SKU率
    { columnName: 'stockConsumptionRatio', align: 'right' }, //                     消化率(推定)
    {
      columnName: 'salesContributionScore',
      align: 'right',
      wordWrapEnabled: true,
      width: 120
    },
    {
      columnName: 'grossProfitContributionScore',
      align: 'right',
      wordWrapEnabled: true,
      width: 120
    },
    { columnName: 'bestSkuRatio', align: 'right' }, //                              Best-SKU率
    { columnName: 'betterSkuRatio', align: 'right' }, //                            Better-SKU率
    { columnName: 'goodSkuRatio', align: 'right' }, //                              Good-SKU率
    { columnName: 'badSkuRatio', align: 'right' }, //                               Bad-SKU率
    { columnName: 'outOfAnalysisSkuKinds', align: 'right', width: 160 },
    { columnName: 'bestSkuKinds', align: 'right' },
    { columnName: 'betterSkuKinds', align: 'right' },
    { columnName: 'goodSkuKinds', align: 'right' },
    { columnName: 'badSkuKinds', align: 'right' },
    {
      columnName: 'outOfAnalysisSkuPercent',
      align: 'right',
      wordWrapEnabled: true,
      width: 160
    } //                                                                            分析対象外-SKU率'
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'productGroup', sortingEnabled: true },
    { columnName: 'salesAmount', sortingEnabled: true },
    { columnName: 'grossProfitAmount', sortingEnabled: true },
    { columnName: 'salesQuantity', sortingEnabled: true },
    { columnName: 'stockAmount', sortingEnabled: true },
    { columnName: 'stockQuantityCentral', sortingEnabled: true },
    { columnName: 'stockAmountCentral', sortingEnabled: true },
    { columnName: 'stockAmountCentralRetailPrice', sortingEnabled: true },
    { columnName: 'stockQuantity', sortingEnabled: true },
    { columnName: 'stockAmountRetailPrice', sortingEnabled: true },
    { columnName: 'stockQuantityAll', sortingEnabled: true },
    { columnName: 'stockAmountAll', sortingEnabled: true },
    { columnName: 'stockAmountAllRetailPrice', sortingEnabled: true },
    { columnName: 'stockConsumptionPercent', sortingEnabled: true },
    { columnName: 'properStockConsumptionPercent', sortingEnabled: true },
    { columnName: 'bestSkuPercent', sortingEnabled: true },
    { columnName: 'betterSkuPercent', sortingEnabled: true },
    { columnName: 'goodSkuPercent', sortingEnabled: true },
    { columnName: 'badSkuPercent', sortingEnabled: true },
    { columnName: 'outOfAnalysisSkuPercent', sortingEnabled: true },
    { columnName: 'salesContributionScore', sortingEnabled: true },
    { columnName: 'grossProfitContributionScore', sortingEnabled: true },
    { columnName: 'bestSkuKinds', sortingEnabled: true },
    { columnName: 'betterSkuKinds', sortingEnabled: true },
    { columnName: 'goodSkuKinds', sortingEnabled: true },
    { columnName: 'badSkuKinds', sortingEnabled: true },
    { columnName: 'outOfAnalysisSkuKinds', sortingEnabled: true }
  ])

  const [defaultHiddenColumnNames] = useState([
    'indexType',
    'grossProfitAmount',
    'stockAmountRetailPrice',
    'stockQuantityAll',
    'stockAmountAll',
    'stockAmountAllRetailPrice',
    'properStockConsumptionPercent',
    'stockQuantityCentral',
    'stockAmountCentral',
    'stockAmountCentralRetailPrice',
    'salesContributionScore',
    'grossProfitContributionScore',
    'bestSkuKinds',
    'betterSkuKinds',
    'goodSkuKinds',
    'badSkuKinds',
    'outOfAnalysisSkuKinds'
  ])
  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'productGroup', togglingEnabled: false }
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
          }
          paginationComponent={pagination && <Pagination {...pagination} />}
          idPaginationComponent={
            idPagination && <IdPagination {...idPagination} />
          }
          className="pl-12 pt-6 pb-6 pr-8"
          classes={tableClasses}
        >
          {filterComponent}
        </TableHeader>
      </div>

      {loading ? (
        <div className={tableClasses.loadingTable}>
          <Loading />
        </div>
      ) : (
        <></>
      )}
      {!edges ? (
        <Loading />
      ) : (
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
      )}
    </Paper>
  )
}

export default TableComponent

const tableStyle = makeStyles(() => ({
  tablePaper: {
    paddingBottom: '1rem',
    width: '100%',
    border: 'none',
    boxShadow: 'none',
    '& table': {
      borderTop: 'solid 1px #d2d4d8',
      minWidth: 'inherit !important',
      zIndex: 450
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
      fontSize: '0.8rem',
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
      padding: 0,
      paddingLeft: '1rem'
    },
    '& td': {
      borderBottom: 'solid 1px #d2d4d8',
      borderRight: 'none',
      fontSize: '0.8rem',
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
  },
  loadingTable: {
    background: 'white',
    height: '100%',
    width: '100%',
    position: 'fixed',
    zIndex: 499
  }
}))
