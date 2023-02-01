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
import { Paper, Box } from '@material-ui/core'
import Loading from '@components/atoms/Loading'
import Pagination from '@hooks/usePagination'
import Icon from '@components/atoms/Icons'
import { Props as PaginationProps } from '@hooks/usePagination/enhance'
import IdPagination from '@hooks/useIdPagination'
import { Props as IdPaginationProps } from '@hooks/useIdPagination/enhance'
import { Edge as ProductCodeEdge } from '@typeDefs/salesPromotionProductCodes'
import TableHeader from '@components/molecules/TableHeader'
import FilterBtnGroup from '@hooks/useConditionFilter/useFilterBtnGroup'
import { useRouter } from 'next/router'
import { FilterButtonGroupPropsInterface } from '@typeDefs/conditionFilter'
import Utils from '@utils'
import CustomChooseColumn, { ColumnChooserOverlay } from './useColumnChooser'
import { useColumnChooser } from './useColumnChooser/enhance'
// テーブル
const TableRoot = (props) => (
  <TGrid.Root {...props} style={{ height: 'calc(100vh - 15.7rem)' }} />
)
interface Props {
  analysisType?: string
  filterComponent?: JSX.Element
  tableHeaderRowComponent?
  tableCellComponent
  cacheKey: string
  edges: ProductCodeEdge[]
  pagination?: PaginationProps
  idPagination?: IdPaginationProps
  sortingState: SortingStateProps
  skuListButtonCellProps
  handleOpenSideBar?: () => void
  useFilter?: boolean
  filterButtonGroupProps?: FilterButtonGroupPropsInterface
}

const TableComponent = ({
  analysisType,
  tableHeaderRowComponent,
  tableCellComponent,
  edges,
  pagination,
  idPagination,
  sortingState,
  skuListButtonCellProps,
  handleOpenSideBar,
  useFilter,
  filterButtonGroupProps
}: Props): JSX.Element => {
  const classes = useStyles()
  const tableClasses = tableStyle()
  let columns: Column[] = [
    { name: 'deleteButton', title: '  ' },
    { name: 'image', title: '  ' },
    { name: 'productCodeCustomerId', title: '品番' },
    { name: 'skuListButton', title: ' ' },
    // { name: 'combinationSkuButton', title: '  ' },
    { name: 'indexType', title: '基本指標' },
    { name: 'desiredPrice', title: '予定売価' },
    { name: 'localGrossProfit', title: '想定粗利' },
    { name: 'salesAmount', title: '売上金額' },
    { name: 'grossProfitAmount', title: '粗利金額' },
    { name: 'salesQuantity', title: '販売数' },
    { name: 'stockQuantity', title: '在庫数' },
    { name: 'stockAmount', title: '在庫金額(商品原価)' },
    { name: 'stockAmountRetailPrice', title: '在庫金額(定価)' },
    { name: 'indexType', title: '単価分析指標' },
    { name: 'averageCustomerUnitPrice', title: '客単価平均' },
    { name: 'averageGrossProfitUnitPrice', title: '粗利単価平均' },
    { name: 'productCodeUnitPrice', title: '商品単価' },
    { name: 'productCodeGrossProfitUnitPrice', title: '商品粗利単価' },
    { name: 'indexType', title: '予測系指標' },
    { name: 'salesContributionScore', title: '売上貢献度' },
    { name: 'grossProfitContributionScore', title: '粗利貢献度' },
    { name: 'predictedSoldoutDtMin', title: '完売予測日(最小)' },
    { name: 'predictedSoldoutDtMax', title: '完売予測日(最大)' },
    { name: 'predictedSoldoutDaysMin', title: '完売予測日数(最小)' },
    { name: 'predictedSoldoutDaysMax', title: '完売予測日数(最大)' },
    { name: 'predictedSoldoutWeeksMin', title: '完売予測週数(最小)' },
    { name: 'predictedSoldoutWeeksMax', title: '完売予測週数(最大)' },
    { name: 'indexType', title: '品番内のクオリティ' },
    { name: 'bestSkuRatio', title: 'Best-SKU率' },
    { name: 'betterSkuRatio', title: 'Better-SKU率' },
    { name: 'goodSkuRatio', title: 'Good-SKU率' },
    { name: 'badSkuRatio', title: 'Bad-SKU率' },
    { name: 'bestSkuKinds', title: 'Best-SKU数' },
    { name: 'betterSkuKinds', title: 'Better-SKU数' },
    { name: 'goodSkuKinds', title: 'Good-SKU数' },
    { name: 'badSkuKinds', title: 'Bad-SKU数' },
    { name: 'outOfAnalysisSkuKinds', title: '分析対象外-SKU数' },
    { name: 'totalSkuKinds', title: '合計-SKU数' },
    { name: 'outOfStockSkuRatio', title: '欠品SKU率' },
    { name: 'indexType', title: '商品マスタ指標' },
    { name: 'retailPrice', title: '定価' },
    { name: 'wholesalePrice', title: '卸価格' },
    { name: 'costPrice', title: '商品原価' }
  ]
  const fixedColumn = [
    'deleteButton',
    'image',
    'productCodeCustomerId',
    'skuListButton',
    'desiredPrice',
    'localGrossProfit'
  ]
  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'deleteButton', align: 'left', width: 46 },
    { columnName: 'image', align: 'center', width: 46 },
    { columnName: 'productCodeCustomerId', align: 'left', width: 280 }, // 品番
    { columnName: 'skuListButton', align: 'right', width: 40 }, //          SKU一覧スライダーボタン
    // { columnName: 'combinationSkuButton', align: 'right' }, //       合わせ買い
    { columnName: 'desiredPrice', align: 'right' }, //                  予定売価
    { columnName: 'localGrossProfit', align: 'right' }, //              想定粗利
    { columnName: 'quadrantClassification', align: 'center' },
    { columnName: 'retailPrice', align: 'right' }, //                   定価
    { columnName: 'wholesalePrice', align: 'right' }, //                卸価格
    { columnName: 'costPrice', align: 'right' }, //                     商品原価
    { columnName: 'salesAmount', align: 'right', width: 90 }, //        売上金額
    { columnName: 'grossProfitAmount', align: 'right' }, //             粗利金額
    { columnName: 'salesQuantity', align: 'right' }, //                 販売数
    { columnName: 'stockQuantity', align: 'right' }, //                 在庫数
    { columnName: 'stockAmount', align: 'right', width: 150 }, //                   在庫金額
    { columnName: 'stockAmountRetailPrice', align: 'right', width: 150 }, //        在庫金額(定価)
    { columnName: 'salesContributionScore', align: 'right' }, //        売上貢献度
    { columnName: 'grossProfitContributionScore', align: 'right' }, //  粗利貢献度
    { columnName: 'averageCustomerUnitPrice', align: 'right' }, //      客単価平均
    { columnName: 'averageGrossProfitUnitPrice', align: 'right' }, //   粗利単価平均
    { columnName: 'productCodeUnitPrice', align: 'right' }, //          商品単価
    { columnName: 'productCodeGrossProfitUnitPrice', align: 'right' }, //       商品粗利単価
    { columnName: 'predictedSoldoutDtMin', align: 'right', width: 160 }, //         完売予測日(最小)
    { columnName: 'predictedSoldoutDtMax', align: 'right', width: 160 }, //         完売予測日(最大)
    { columnName: 'predictedSoldoutDaysMin', align: 'right', width: 160 }, //       完売予測日数(最小)
    { columnName: 'predictedSoldoutDaysMax', align: 'right', width: 160 }, //       完売予測日数(最大)
    { columnName: 'predictedSoldoutWeeksMin', align: 'right', width: 170 }, //      完売予測週数(最小)
    { columnName: 'predictedSoldoutWeeksMax', align: 'right', width: 170 }, //      完売予測週数(最大)
    { columnName: 'bestSkuRatio', align: 'right' }, //                  SKU率
    { columnName: 'betterSkuRatio', align: 'right' },
    { columnName: 'goodSkuRatio', align: 'right' },
    { columnName: 'badSkuRatio', align: 'right' },
    { columnName: 'bestSkuKinds', align: 'right' }, //                  SKU数
    { columnName: 'betterSkuKinds', align: 'right' },
    { columnName: 'goodSkuKinds', align: 'right' },
    { columnName: 'badSkuKinds', align: 'right' },
    { columnName: 'outOfAnalysisSkuKinds', align: 'right', width: 150 },
    { columnName: 'totalSkuKinds', align: 'right' },
    { columnName: 'outOfStockSkuRatio', align: 'right' }
  ])
  // クオリティ分析時は表示(編集モードでは非表示)
  const { query } = useRouter()
  columns = Utils.addQuadrantClassificationColumn(
    query,
    columns,
    analysisType,
    7
  ).columns
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'deleteButton', sortingEnabled: false },
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'productCodeCustomerId', sortingEnabled: true },
    { columnName: 'skuListButton', sortingEnabled: false },
    { columnName: 'desiredPrice', sortingEnabled: false },
    { columnName: 'localGrossProfit', sortingEnabled: false },
    { columnName: 'retailPrice', sortingEnabled: true },
    { columnName: 'wholesalePrice', sortingEnabled: true },
    { columnName: 'costPrice', sortingEnabled: true },
    { columnName: 'salesAmount', sortingEnabled: true },
    { columnName: 'grossProfitAmount', sortingEnabled: true },
    { columnName: 'salesQuantity', sortingEnabled: true },
    { columnName: 'stockQuantity', sortingEnabled: true },
    { columnName: 'stockAmount', sortingEnabled: true },
    { columnName: 'stockAmountRetailPrice', sortingEnabled: true },
    { columnName: 'salesContributionScore', sortingEnabled: true },
    { columnName: 'grossProfitContributionScore', sortingEnabled: true },
    { columnName: 'averageCustomerUnitPrice', sortingEnabled: true },
    { columnName: 'averageGrossProfitUnitPrice', sortingEnabled: true },
    { columnName: 'productCodeUnitPrice', sortingEnabled: true },
    { columnName: 'productCodeGrossProfitUnitPrice', sortingEnabled: true },
    { columnName: 'predictedSoldoutDtMin', sortingEnabled: true },
    { columnName: 'predictedSoldoutDtMax', sortingEnabled: true },
    { columnName: 'predictedSoldoutDaysMin', sortingEnabled: true },
    { columnName: 'predictedSoldoutDaysMax', sortingEnabled: true },
    { columnName: 'predictedSoldoutWeeksMin', sortingEnabled: true },
    { columnName: 'predictedSoldoutWeeksMax', sortingEnabled: true },
    { columnName: 'bestSkuRatio', sortingEnabled: true },
    { columnName: 'betterSkuRatio', sortingEnabled: true },
    { columnName: 'goodSkuRatio', sortingEnabled: true },
    { columnName: 'badSkuRatio', sortingEnabled: true },
    { columnName: 'bestSkuKinds', sortingEnabled: true },
    { columnName: 'betterSkuKinds', sortingEnabled: true },
    { columnName: 'goodSkuKinds', sortingEnabled: true },
    { columnName: 'badSkuKinds', sortingEnabled: true },
    { columnName: 'outOfAnalysisSkuKinds', sortingEnabled: true },
    { columnName: 'totalSkuKinds', sortingEnabled: true },
    { columnName: 'outOfStockSkuRatio', sortingEnabled: true },
    { columnName: 'quadrantClassification', sortingEnabled: false }
  ])

  const [defaultHiddenColumnNames, setDefaultHiddenColumnNames] = useState([
    'indexType',
    'salesAmount',
    'grossProfitAmount',
    'salesQuantity',
    'stockQuantity',
    'stockAmount',
    'stockAmountRetailPrice',
    'salesContributionScore',
    'grossProfitContributionScore',
    'averageCustomerUnitPrice',
    'averageGrossProfitUnitPrice',
    'productCodeUnitPrice',
    'productCodeGrossProfitUnitPrice',
    'predictedSoldoutDtMin',
    'predictedSoldoutDtMax',
    'predictedSoldoutDaysMin',
    'predictedSoldoutDaysMax',
    'predictedSoldoutWeeksMin',
    'predictedSoldoutWeeksMax',
    'bestSkuRatio',
    'betterSkuRatio',
    'goodSkuRatio',
    'badSkuRatio',
    'bestSkuKinds',
    'betterSkuKinds',
    'goodSkuKinds',
    'badSkuKinds',
    'outOfAnalysisSkuKinds',
    'totalSkuKinds',
    'outOfStockSkuRatio',
    'wholesalePrice'
  ])
  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'deleteButton', togglingEnabled: false },
    { columnName: 'image', togglingEnabled: false },
    { columnName: 'productCodeCustomerId', togglingEnabled: false },
    { columnName: 'desiredPrice', togglingEnabled: false },
    { columnName: 'localGrossProfit', togglingEnabled: false },
    { columnName: 'skuListButton', togglingEnabled: false }
  ])

  // devexpressコンポーネントoverlay
  const [chooser, handleOpenChooser, handleCloseChooser] = useColumnChooser()
  const overlayChooser = connectProps(ColumnChooserOverlay, () => {
    return {
      chooser,
      onClose: handleCloseChooser
    }
  })

  // propsに別プロパティ追加
  const cellComponent = connectProps(tableCellComponent, () => {
    return { skuListButtonCellProps }
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
              {filterButtonGroupProps && (
                <FilterBtnGroup
                  {...filterButtonGroupProps}
                  setDefaultHiddenColumns={setDefaultHiddenColumnNames}
                />
              )}
            </Box>
          }
          paginationComponent={pagination && <Pagination {...pagination} />}
          idPaginationComponent={
            idPagination && <IdPagination {...idPagination} />
          }
          className="pt-6 pb-6"
          classes={tableClasses}
        >
          <></>
        </TableHeader>
      </div>

      {!edges ? (
        <Loading />
      ) : (
        <TGrid rows={edges} columns={columns} rootComponent={TableRoot}>
          <Table
            columnExtensions={tableColumnExtensions}
            cellComponent={cellComponent}
          />
          <SortingState
            {...sortingState}
            columnExtensions={sortColumnExtensions}
          />
          {tableHeaderRowComponent ? (
            <TableHeaderRow showSortingControls />
          ) : (
            <TableHeaderRow showSortingControls />
          )}
          <TableFixedColumns leftColumns={fixedColumn} />
          <TableColumnVisibility
            hiddenColumnNames={defaultHiddenColumnNames}
            columnExtensions={tableColumnVisibilityColumnExtensions}
          />
          <Toolbar />
          {/* 指標を変更 */}
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

const useStyles = makeStyles(() =>
  createStyles({
    boxControl: {
      cursor: 'pointer',
      height: '36px'
    }
  })
)

const tableStyle = makeStyles(() => ({
  tablePaper: {
    width: '100%',
    border: 'none',
    boxShadow: 'none',
    '& table': {
      borderTop: 'solid 1px #d2d4d8',
      minWidth: 'inherit !important',
      marginBottom: 'unset !important'
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
      borderRight: '1px solid #ECEEF0',
      borderLeft: 'none',
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
      borderLeft: 'none',
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
