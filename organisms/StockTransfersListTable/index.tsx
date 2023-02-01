import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
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
  productCode?: boolean
  parentSku?: boolean
  filterComponent?: JSX.Element
  tableHeaderRowComponent?
  tableCellComponent
  cacheKey: string
  edges: SkusEdge[] | ParentSkuEdge[] | ProductCodeEdge[]
  pagination?: PaginationProps
  idPagination?: IdPaginationProps
  sortingState: SortingStateProps
  handleOpenSideBar?: () => void
  useFilter?: boolean
}
const columns: Column[] = [
  { name: 'deleteButton', title: '  ' },
  { name: 'image', title: '  ' },
  { name: 'skuCustomerId', title: 'SKU' },
  { name: 'parentSkuCustomerId', title: '親SKU' },
  { name: 'productCodeCustomerId', title: '品番' },
  // { name: 'combinationSkuButton', title: '  ' },
  { name: 'indexType', title: '基本指標' },
  { name: 'transferQuantity', title: '店舗配送数' },
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
  // { name: 'indexType', title: '単価分析指標' },
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
  { name: 'skuOwnershipRatio', title: '店舗展開率' },
  { name: 'retailPrice', title: '定価' },
  { name: 'wholesalePrice', title: '卸価格' },
  { name: 'costPrice', title: '商品原価' }
]
const TableComponent = ({
  productCode,
  parentSku,
  filterComponent,
  tableHeaderRowComponent,
  tableCellComponent,
  edges,
  pagination,
  idPagination,
  sortingState,
  handleOpenSideBar,
  useFilter
}: Props): JSX.Element => {
  const tableClasses = tableStyle()

  // 親SKU,品番表示のとき(skus≠true)は親SKU,品番カラムを表示しない
  let excludeColumnName = []
  let fixedColumn = ['deleteButton', 'image']
  switch (true) {
    case parentSku:
      excludeColumnName = [
        'skuCustomerId', // SKU
        'productCodeCustomerId', // 品番
        'salesContributionScore', // 売上貢献度
        'grossProfitContributionScore', // 粗利貢献度
        'stockRiskScore', // 在庫リスク
        'predictedSoldoutDt', // 完売予測日
        'predictedSoldoutDays', // 完売予測日数
        'predictedSoldoutWeeks', // 完売予測週数
        'skuOwnershipRatio' // 店舗展開率
      ]
      fixedColumn.push('parentSkuCustomerId')
      break
    case productCode:
      excludeColumnName = [
        'skuCustomerId', // SKU
        'parentSkuCustomerId', // 品番
        'salesContributionScore', // 売上貢献度
        'grossProfitContributionScore', // 粗利貢献度
        'stockRiskScore', // 在庫リスク
        'predictedSoldoutDt', // 完売予測日
        'predictedSoldoutDays', // 完売予測日数
        'predictedSoldoutWeeks', // 完売予測週数
        'skuOwnershipRatio' // 店舗展開率
      ]
      fixedColumn.push('productCodeCustomerId')
      break
    default:
      fixedColumn.push('skuCustomerId')
      break
  }
  const excludeColumn = (colums: Column[]) => {
    const currentColumns = colums.filter(
      (v) => !excludeColumnName.includes(v.name)
    )
    return currentColumns.filter(
      (v, i) => !(v.name === currentColumns[i + 1]?.name)
    )
  }

  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'deleteButton', align: 'left', width: 46 },
    { columnName: 'image', align: 'center', width: 46 },
    { columnName: 'skuCustomerId', align: 'left', width: 280 }, //      sku
    { columnName: 'parentSkuCustomerId', align: 'left' }, //            親SKU
    { columnName: 'productCodeCustomerId', align: 'left' }, //          品番
    // { columnName: 'combinationSkuButton', align: 'right' }, //       合わせ買い
    { columnName: 'transferQuantity', align: 'right', wordWrapEnabled: true }, //              店舗配送数
    { columnName: 'salesAmount', align: 'right' }, //                   売上金額
    { columnName: 'grossProfitAmount', align: 'right' }, //             粗利金額
    { columnName: 'salesQuantity', align: 'right' }, //                 販売数
    {
      columnName: 'stockQuantityCentral',
      align: 'right',
      wordWrapEnabled: true
    }, //          倉庫在庫数 ※初期表示
    { columnName: 'stockAmountCentral', align: 'right', wordWrapEnabled: true }, //            倉庫在庫金額
    {
      columnName: 'stockAmountCentralRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // 倉庫在庫金額(定価)
    {
      columnName: 'backlogStockQuantity',
      align: 'right',
      wordWrapEnabled: true
    }, //          発注残 ※初期表示
    { columnName: 'stockQuantityAll', align: 'right', wordWrapEnabled: true }, //              全社在庫数
    { columnName: 'stockAmountAll', align: 'right', wordWrapEnabled: true }, //                全社在庫金額
    {
      columnName: 'stockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //     全社在庫金額(定価)
    { columnName: 'averageCustomerUnitPrice', align: 'right' }, //      客単価
    { columnName: 'averageGrossProfitUnitPrice', align: 'right' }, //   粗利単価
    { columnName: 'skuUnitPrice', align: 'right' }, //                  商品単価
    {
      columnName: 'skuGrossProfitUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //       商品粗利単価
    {
      columnName: 'salesContributionScore',
      align: 'right',
      wordWrapEnabled: true
    }, //        売上貢献度 ※初期表示
    {
      columnName: 'grossProfitContributionScore',
      align: 'right',
      wordWrapEnabled: true
    }, //  粗利貢献度
    { columnName: 'stockRiskScore', align: 'right', wordWrapEnabled: true }, //                在庫リスク ※初期表示
    { columnName: 'predictedSoldoutDt', align: 'right', wordWrapEnabled: true }, //            完売予測日
    {
      columnName: 'predictedSoldoutDays',
      align: 'right',
      wordWrapEnabled: true
    }, //          完売予測日数
    {
      columnName: 'predictedSoldoutWeeks',
      align: 'right',
      wordWrapEnabled: true
    }, //         完売予測週数
    { columnName: 'skuOwnershipRatio', align: 'right', wordWrapEnabled: true }, //             店舗展開率
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
    // { columnName: 'combinationSkuButton', sortingEnabled: false },
    { columnName: 'transferQuantity', sortingEnabled: false },
    { columnName: 'salesAmount', sortingEnabled: true },
    { columnName: 'grossProfitAmount', sortingEnabled: true },
    { columnName: 'salesQuantity', sortingEnabled: true },
    { columnName: 'stockQuantityCentral', sortingEnabled: true },
    { columnName: 'stockAmountCentral', sortingEnabled: true },
    { columnName: 'stockAmountCentralRetailPrice', sortingEnabled: true },
    { columnName: 'backlogStockQuantity', sortingEnabled: true },
    { columnName: 'stockQuantityAll', sortingEnabled: true },
    { columnName: 'stockAmountAll', sortingEnabled: true },
    { columnName: 'stockAmountAllRetailPrice', sortingEnabled: true },
    { columnName: 'averageCustomerUnitPrice', sortingEnabled: true },
    { columnName: 'averageGrossProfitUnitPrice', sortingEnabled: true },
    { columnName: 'skuUnitPrice', sortingEnabled: true },
    { columnName: 'skuGrossProfitUnitPrice', sortingEnabled: true },
    { columnName: 'salesContributionScore', sortingEnabled: true },
    { columnName: 'grossProfitContributionScore', sortingEnabled: true },
    { columnName: 'stockRiskScore', sortingEnabled: true },
    { columnName: 'predictedSoldoutDt', sortingEnabled: true },
    { columnName: 'predictedSoldoutDays', sortingEnabled: true },
    { columnName: 'predictedSoldoutWeeks', sortingEnabled: true },
    { columnName: 'skuOwnershipRatio', sortingEnabled: true },
    { columnName: 'retailPrice', sortingEnabled: true },
    { columnName: 'wholesalePrice', sortingEnabled: true },
    { columnName: 'costPrice', sortingEnabled: true }
  ])

  const [defaultHiddenColumnNames] = useState([
    'indexType',
    'salesAmount',
    'grossProfitAmount',
    'salesQuantity',
    'stockAmountCentral',
    'stockAmountCentralRetailPrice',
    'stockQuantityAll',
    'stockAmountAll',
    'stockAmountAllRetailPrice',
    'averageCustomerUnitPrice',
    'averageGrossProfitUnitPrice',
    'skuUnitPrice',
    'skuGrossProfitUnitPrice',
    'grossProfitContributionScore',
    'predictedSoldoutDt',
    'predictedSoldoutDays',
    'predictedSoldoutWeeks',
    'skuOwnershipRatio',
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
                  className={tableClasses.boxControl}
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
          className="pt-6 pb-6"
          classes={tableClasses}
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
  },
  boxControl: {
    cursor: 'pointer',
    height: '36px'
  }
}))
