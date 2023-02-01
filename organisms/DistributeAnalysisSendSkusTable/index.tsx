import React, { useState, useEffect, useRef } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import {
  SortingState,
  SortingStateProps,
  SelectionState,
  SelectionStateProps,
  IntegratedSelection,
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
  ColumnChooser,
  TableFixedColumns
} from '@devexpress/dx-react-grid-material-ui'
import { connectProps } from '@devexpress/dx-react-core'
import { Paper, Box } from '@material-ui/core'
import Loading from '@components/atoms/Loading'
import Pagination from '@hooks/usePagination'
import IdPagination from '@hooks/useIdPagination'
import Icon from '@components/atoms/Icons'
import { Props as PaginationProps } from '@hooks/usePagination/enhance'
import { Props as IdPaginationProps } from '@hooks/useIdPagination/enhance'
import { Edge as SkusEdge } from '@typeDefs/stockSkus'
import { Edge as ProductEdge } from '@typeDefs/stockProductCodes'
import { Edge as ParentSkuEdge } from '@typeDefs/stockParentSkus'
import Button from '@components/atoms/Button'
import Const from '@constants/index'
import TableHeader from '@components/molecules/TableHeader'
import CustomChooseColumn, { ColumnChooserOverlay } from './useColumnChooser'
import { useColumnChooser } from './useColumnChooser/enhance'
// テーブル
const TableRoot = (props) => (
  <TGrid.Root {...props} style={{ height: 'calc(100vh - 188px)' }} />
)
interface Props {
  reFetchSkus?: () => void
  productCode?: boolean
  parentSku?: boolean
  filterComponent: JSX.Element
  tableHeaderRowComponent?
  tableCellComponent
  cacheKey: string
  edges: SkusEdge[] | ProductEdge[] | ParentSkuEdge[]
  switchProps?: {
    checked: boolean
    onChange: () => void
  }
  pagination?: PaginationProps
  idPagination?: IdPaginationProps
  selectionState: SelectionStateProps
  sortingState: SortingStateProps
  handleOpenSideBar?: () => void
  useFilter?: boolean
}
const TableComponent = ({
  productCode,
  parentSku,
  filterComponent,
  tableHeaderRowComponent,
  tableCellComponent,
  edges,
  switchProps,
  pagination,
  idPagination,
  selectionState,
  sortingState,
  handleOpenSideBar,
  useFilter
}: Props): JSX.Element => {
  const classes = useStyles()
  const tableClasses = tableStyle()

  // 親SKU,品番表示のとき(skus≠true)は親SKU,品番カラムを表示しない
  let excludeColumnName = []
  let fixedColumn = ['image']
  switch (true) {
    case parentSku:
      excludeColumnName = [
        'stockAmountCentralRetailPrice',
        'stockAmountAllRetailPrice',
        'skuCustomerId', // SKU
        'productCodeCustomerId', // 品番
        'salesContributionScore', // 売上貢献度
        'grossProfitContributionScore', // 粗利貢献度
        'stockRiskScore', // 在庫リスク
        'predictedSoldoutDt', // 完売予測日
        'predictedSoldoutDays', // 完売予測日数
        'predictedSoldoutWeeks' // 完売予測週数
      ]
      fixedColumn.push('parentSkuCustomerId')
      break
    case productCode:
      excludeColumnName = [
        'stockAmountCentralRetailPrice',
        'stockAmountAllRetailPrice',
        'skuCustomerId', // SKU
        'parentSkuCustomerId', // 品番
        'salesContributionScore', // 売上貢献度
        'grossProfitContributionScore', // 粗利貢献度
        'stockRiskScore', // 在庫リスク
        'predictedSoldoutDt', // 完売予測日
        'predictedSoldoutDays', // 完売予測日数
        'predictedSoldoutWeeks' // 完売予測週数
      ]
      fixedColumn.push('productCodeCustomerId')
      break
    default:
      fixedColumn.push('skuCustomerId')
      break
  }
  const excludeColumn = (colums: Column[]) => {
    return colums.filter((v) => !excludeColumnName.includes(v.name))
  }
  const columns: Column[] = [
    { name: 'image', title: '  ' },
    { name: 'skuCustomerId', title: 'SKU' },
    { name: 'parentSkuCustomerId', title: '親SKU' },
    { name: 'productCodeCustomerId', title: '品番' },
    { name: 'quality', title: 'クオリティ' },
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
  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'image', align: 'center', width: 46 },
    { columnName: 'skuCustomerId', align: 'left', width: 280 }, //      sku
    { columnName: 'parentSkuCustomerId', align: 'left' }, //            親SKU
    { columnName: 'productCodeCustomerId', align: 'left' }, //          品番
    { columnName: 'quality', align: 'right' }, //    クオリティ
    {
      columnName: 'recommendedSendStockQuantityAll',
      align: 'right',
      wordWrapEnabled: true,
      width: 145
    }, //     補充数[倉庫出荷+他店舗回収]
    {
      columnName: 'recommendedSendStockQuantityCentral',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // 補充数[倉庫出荷]
    {
      columnName: 'recommendedSendStockQuantityOthers',
      align: 'right',
      wordWrapEnabled: true,
      width: 120
    }, // 補充数[他店舗回収]
    {
      columnName: 'shortageStockQuantity',
      align: 'right',
      wordWrapEnabled: true,
      width: 125
    }, // 必要在庫数
    {
      columnName: 'excessStockQuantity',
      align: 'right',
      wordWrapEnabled: true,
      width: 125
    }, // 余剰在庫数
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
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'skuCustomerId', sortingEnabled: true },
    { columnName: 'parentSkuCustomerId', sortingEnabled: true },
    { columnName: 'productCodeCustomerId', sortingEnabled: true },
    { columnName: 'quality', sortingEnabled: false },
    { columnName: 'recommendedSendStockQuantityAll', sortingEnabled: true },
    { columnName: 'recommendedSendStockQuantityCentral', sortingEnabled: true },
    { columnName: 'recommendedSendStockQuantityOthers', sortingEnabled: true },
    { columnName: 'shortageStockQuantity', sortingEnabled: true },
    { columnName: 'excessStockQuantity', sortingEnabled: true },
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
    { columnName: 'retailPrice', sortingEnabled: true },
    { columnName: 'wholesalePrice', sortingEnabled: true },
    { columnName: 'costPrice', sortingEnabled: true }
  ])

  const [defaultHiddenColumnNames] = useState(
    parentSku || productCode
      ? [
          'indexType',
          'grossProfitAmount', // 粗利金額
          'salesQuantity', // 販売数
          'stockAmountCentral', // 倉庫在庫金額(商品原価)
          'stockQuantityAll', // 全社在庫数
          'stockAmountAll', // 全社在庫金額(商品原価)
          'averageCustomerUnitPrice', // 客単価平均
          'skuUnitPrice', // 商品単価
          'skuGrossProfitUnitPrice', // 商品粗利単価
          'retailPrice', // 定価
          'wholesalePrice', // 卸価格
          'costPrice' // 商品原価
        ]
      : [
          'indexType',
          'shortageStockQuantity',
          'shortageStockAmount',
          'shortageStockAmountRetailPrice',
          'excessStockQuantity',
          'excessStockAmount',
          'excessStockAmountRetailPrice',
          'salesAmount', // 売上金額
          'grossProfitAmount', // 粗利金額
          'salesQuantity', // 販売数
          'stockQuantityCentral', // 倉庫在庫数
          'stockAmountCentral', // 倉庫在庫金額(商品原価)
          'stockAmountCentralRetailPrice', // 倉庫在庫金額(定価)
          'backlogStockQuantity', //          発注残 ※初期表示
          'stockQuantityAll', // 全社在庫数
          'stockAmountAll', // 全社在庫金額(商品原価),
          'stockAmountAllRetailPrice', // 全社在庫金額(定価)
          'averageCustomerUnitPrice', // 客単価平均
          'averageGrossProfitUnitPrice', // 粗利単価返金
          'skuUnitPrice', // 商品単価
          'skuGrossProfitUnitPrice', // 商品粗利単価
          'salesContributionScore', // 売上貢献度
          'grossProfitContributionScore', // 粗利貢献度
          'stockRiskScore', // 在庫リスク
          'predictedSoldoutDt', // 完売予測日
          'predictedSoldoutDays', // 完売予測日数
          'predictedSoldoutWeeks', // 完売予測週数
          'retailPrice', // 定価
          'wholesalePrice', // 卸価格
          'costPrice' // 商品原価
        ]
  )
  const [tableColumnVisibilityColumnExtensions] = useState([
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
            <SortingState
              {...sortingState}
              columnExtensions={sortColumnExtensions}
            />
            <SelectionState {...selectionState} />
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
            <IntegratedSelection />
            <TableSelection
              showSelectAll
              // headerCellComponent={(props) => (
              //   <SelectionHeaderCellComponent
              //     {...props}
              //     reFetchSkus={reFetchSkus}
              //   />
              // )}
            />
            <TableFixedColumns
              leftColumns={[TableSelection.COLUMN_TYPE, ...fixedColumn]}
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
      height: 56
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
      '& .Mui-disabled > .MuiTableSortLabel-icon': {
        opacity: 0
      },
      '& .MuiTableSortLabel-icon': {
        opacity: 0.2
      }
    },
    '& td': {
      borderBottom: 'solid 1px #d2d4d8',
      borderRight: 'none',
      fontSize: 14,
      padding: 0,
      color: '#1e283c'
    },
    '& th > div > thead': {
      width: '100%'
    },
    '& th:not(:first-child) > div': {
      justifyContent: 'flex-end'
    },
    '& th:first-child': {
      paddingLeft: 0
    },
    '& th:first-child > div': {
      display: 'block'
    },
    '& td:last-child, th:last-child': {
      paddingRight: '1rem'
    },
    '& .MuiToolbar-root': {
      display: 'none'
    }
  }
}))
