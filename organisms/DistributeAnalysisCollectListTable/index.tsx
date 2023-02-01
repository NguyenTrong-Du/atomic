import React, { useState, useEffect, useRef } from 'react'
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
import { Paper } from '@material-ui/core'
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
}
const columns: Column[] = [
  { name: 'deleteButton', title: '  ' },
  { name: 'image', title: '  ' },
  { name: 'skuCustomerId', title: 'SKU' },
  { name: 'parentSkuCustomerId', title: '親SKU' },
  { name: 'productCodeCustomerId', title: '品番' },
  { name: 'collectQuantity', title: '回収在庫数' },

  { name: 'indexType', title: 'ディストリビュート指標' },

  { name: 'recommendedCollectStockQuantityAll', title: '推奨回収在庫数' },
  {
    name: 'recommendedCollectStockAmountAll',
    title: '推奨回収在庫金額(商品原価)'
  },
  {
    name: 'recommendedCollectStockAmountAllRetailPrice',
    title: '推奨回収在庫金額(定価)'
  },
  { name: 'shortageStockQuantity', title: '店舗不足在庫数' },
  { name: 'shortageStockAmount', title: '店舗不足在庫金額(商品原価)' },
  { name: 'shortageStockAmountRetailPrice', title: '店舗不足在庫金額(定価)' },
  { name: 'excessStockQuantity', title: '店舗過剰在庫数' },
  { name: 'excessStockAmount', title: '店舗過剰在庫金額(商品原価)' },
  { name: 'excessStockAmountRetailPrice', title: '店舗過剰在庫金額(定価)' },

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
  switchProps
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
    { columnName: 'skuCustomerId', align: 'left', width: 280 }, //      sku
    { columnName: 'parentSkuCustomerId', align: 'left' }, //            親SKU
    { columnName: 'productCodeCustomerId', align: 'left' }, //          品番
    { columnName: 'collectQuantity', align: 'left' }, // 回収在庫数
    {
      columnName: 'recommendedCollectStockQuantityAll',
      align: 'right',
      wordWrapEnabled: true,
      width: 130
    }, // 推奨回収在庫数
    {
      columnName: 'recommendedCollectStockAmountAll',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // 推奨回収在庫金額(商品原価)
    {
      columnName: 'recommendedCollectStockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // 推奨回収在庫金額(定価)
    {
      columnName: 'shortageStockQuantity',
      align: 'right',
      wordWrapEnabled: true,
      width: 125
    }, // 店舗不足在庫数
    {
      columnName: 'shortageStockAmount',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // 店舗不足在庫金額(商品原価)
    {
      columnName: 'shortageStockAmountRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // 店舗不足在庫金額(定価)
    {
      columnName: 'excessStockQuantity',
      align: 'right',
      wordWrapEnabled: true,
      width: 125
    }, // 店舗過剰在庫数
    {
      columnName: 'excessStockAmount',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // 店舗過剰在庫金額(商品原価)
    {
      columnName: 'excessStockAmountRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // 店舗過剰在庫金額(定価)
    { columnName: 'salesAmount', align: 'right' }, //                   売上金額
    { columnName: 'grossProfitAmount', align: 'right' }, //             粗利金額
    { columnName: 'salesQuantity', align: 'right' }, //                 販売数
    { columnName: 'stockQuantityCentral', align: 'right' }, //          倉庫在庫数 ※初期表示
    { columnName: 'stockAmountCentral', align: 'right', wordWrapEnabled: true }, //            倉庫在庫金額(商品原価)
    {
      columnName: 'stockAmountCentralRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // 倉庫在庫金額(定価)
    { columnName: 'backlogStockQuantity', align: 'right' }, //          発注残 ※初期表示
    { columnName: 'stockQuantityAll', align: 'right' }, //              全社在庫数
    { columnName: 'stockAmountAll', align: 'right', wordWrapEnabled: true }, //                全社在庫金額(商品原価)
    {
      columnName: 'stockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //     全社在庫金額(定価)
    { columnName: 'averageCustomerUnitPrice', align: 'right' }, //      客単価平均
    { columnName: 'averageGrossProfitUnitPrice', align: 'right' }, // 粗利単価平均
    { columnName: 'skuUnitPrice', align: 'right' }, //                  商品単価
    { columnName: 'skuGrossProfitUnitPrice', align: 'right' }, //       商品粗利単価
    { columnName: 'salesContributionScore', align: 'right' }, //        売上貢献度 ※初期表示
    { columnName: 'grossProfitContributionScore', align: 'right' }, //  粗利貢献度
    { columnName: 'stockRiskScore', align: 'right' }, //                在庫リスク ※初期表示
    { columnName: 'predictedSoldoutDt', align: 'right' }, //            完売予測日
    { columnName: 'predictedSoldoutDays', align: 'right' }, //          完売予測日数
    { columnName: 'predictedSoldoutWeeks', align: 'right' }, //         完売予測週数
    { columnName: 'retailPrice', align: 'right' }, //                   定価
    { columnName: 'wholesalePrice', align: 'right' }, //                卸価格
    { columnName: 'costPrice', align: 'right' } //                      商品原価
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'deleteButton', sortingEnabled: false },
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'skuCustomerId', sortingEnabled: true },
    { columnName: 'parentSkuCustomerId', sortingEnabled: true },
    { columnName: 'productCodeCustomerId', sortingEnabled: true },
    { columnName: 'collectQuantity', sortingEnabled: false }
  ])

  const [defaultHiddenColumnNames] = useState([
    'indexType',
    'recommendedCollectStockAmountAll',
    'recommendedCollectStockAmountAllRetailPrice',
    'shortageStockQuantity',
    'shortageStockAmount',
    'shortageStockAmountRetailPrice',
    'excessStockQuantity',
    'excessStockAmount',
    'excessStockAmountRetailPrice',
    'salesAmount',
    'grossProfitAmount',
    'salesQuantity',
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
          switchProps={switchProps}
          className="pl-12 pt-6 pb-6"
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
    }
  })
)
