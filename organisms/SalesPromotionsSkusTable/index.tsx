import React, { useState, useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
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
import { Props as PaginationProps } from '@hooks/usePagination/enhance'
import IdPagination from '@hooks/useIdPagination'
import { Props as IdPaginationProps } from '@hooks/useIdPagination/enhance'
import { Edge as SkusEdge } from '@typeDefs/salesSkus'
import { Edge as ProductEdge } from '@typeDefs/salesProductCodes'
import Button from '@components/atoms/Button'
import Const from '@constants/index'
import Icon from '@components/atoms/Icons'
import { useRouter } from 'next/router'
import TableHeader from '@components/molecules/TableHeader'
import FilterBtnGroup from '@hooks/useConditionFilter/useFilterBtnGroup'
import { FilterButtonGroupPropsInterface } from '@typeDefs/conditionFilter'
import Utils from '@utils'
import CustomChooseColumn, { ColumnChooserOverlay } from './useColumnChooser'
import { useColumnChooser } from './useColumnChooser/enhance'

// テーブル
const TableRoot = (props) => (
  <TGrid.Root {...props} style={{ height: 'calc(100vh - 188px)' }} />
)
interface Props {
  analysisType?: string
  productCode?: boolean
  parentSku?: boolean
  skuDialog?: boolean
  tableHeaderRowComponent?
  tableCellComponent
  cacheKey: string
  edges: SkusEdge[] | ProductEdge[]
  switchProps?: {
    checked: boolean
    onChange: () => void
  }
  pagination?: PaginationProps
  idPagination?: IdPaginationProps
  selectionState: SelectionStateProps
  sortingState: SortingStateProps
  loading?: boolean
  handleOpenSideBar?: () => void
  useFilter?: boolean
  filterComponent?: JSX.Element
  filterButtonGroupProps?: FilterButtonGroupPropsInterface
}
const TableComponent = ({
  analysisType,
  productCode,
  parentSku,
  skuDialog,
  tableHeaderRowComponent,
  tableCellComponent,
  edges,
  switchProps,
  pagination,
  idPagination,
  selectionState,
  sortingState,
  loading,
  handleOpenSideBar,
  useFilter,
  filterButtonGroupProps,
  filterComponent
}: Props): JSX.Element => {
  const classes = useStyles()
  const tableClasses = tableStyle()

  // 親SKU,品番表示のとき(skus≠true)表示しないカラムを指定
  let excludeColumnName = []
  switch (true) {
    case parentSku:
      excludeColumnName = [
        'skuCustomerId', // SKU
        'productCodeCustomerId', // 品番
        'salesContributionScore', // 売上貢献度
        'grossProfitContributionScore', // 粗利貢献度
        'predictedAverageSoldoutQuantityOneWeek', // 予測販売数(1W)
        'stockRiskScore', // 在庫リスク
        'predictedSoldoutDt', // 完売予測日
        'predictedSoldoutDays', // 完売予測日数
        'predictedSoldoutWeeks', // 完売予測週数
        'quadrantClassification' // クオリティ
      ]
      break
    case productCode:
      excludeColumnName = [
        'skuCustomerId', // SKU
        'parentSkuCustomerId', // 親SKU
        'salesContributionScore', // 売上貢献度
        'grossProfitContributionScore', // 粗利貢献度
        'predictedAverageSoldoutQuantityOneWeek', // 予測販売数(1W)
        'stockRiskScore', // 在庫リスク
        'predictedSoldoutDt', // 完売予測日
        'predictedSoldoutDays', // 完売予測日数
        'predictedSoldoutWeeks', // 完売予測週数
        'quadrantClassification' // クオリティ
      ]
      break
    case skuDialog:
      excludeColumnName = [
        'productCodeCustomerId' // 品番
      ]
      break
    default:
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

  // 基本のカラム設定
  let columns: Column[] = [
    { name: 'image', title: '  ' },
    { name: 'skuCustomerId', title: 'SKU' },
    { name: 'parentSkuCustomerId', title: '親SKU' },
    { name: 'productCodeCustomerId', title: '品番' },
    // { name: 'combinationSkuButton', title: '  ' },
    { name: 'indexType', title: '基本指標' },
    { name: 'salesAmount', title: '売上金額' },
    { name: 'grossProfitAmount', title: '粗利金額' },
    { name: 'salesQuantity', title: '販売数' },
    { name: 'stockQuantity', title: '在庫数' },
    { name: 'stockAmount', title: '在庫金額(商品原価)' },
    { name: 'stockAmountRetailPrice', title: '在庫金額(定価)' },
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
    { name: 'predictedAverageSoldoutQuantityOneWeek', title: '予測販売数(1W)' },
    { name: 'indexType', title: '商品マスタ指標' },
    { name: 'retailPrice', title: '定価' },
    { name: 'wholesalePrice', title: '卸価格' },
    { name: 'costPrice', title: '商品原価' }
  ]
  // クオリティ分析時は表示(編集モードでは非表示)
  const { pathname, query } = useRouter()
  const isNotProductCodesList = pathname.indexOf('productCodesList') === -1

  if (isNotProductCodesList) {
    columns = Utils.addQuadrantClassificationColumn(
      query,
      columns,
      analysisType,
      4
    ).columns
  }

  // alignの調整
  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'image', align: 'center', width: 70 },
    { columnName: 'skuCustomerId', align: 'left', width: 280 }, //      sku
    { columnName: 'parentSkuCustomerId', align: 'left' }, //            親SKU
    { columnName: 'productCodeCustomerId', align: 'left' }, //          品番
    // { columnName: 'combinationSkuButton', align: 'right' }, //       合わせ買い
    { columnName: 'salesAmount', align: 'right' }, //                   売上金額
    { columnName: 'grossProfitAmount', align: 'right' }, //             粗利金額
    { columnName: 'salesQuantity', align: 'right' }, //                 販売数
    { columnName: 'stockQuantity', align: 'right' }, //                 在庫数
    {
      columnName: 'stockAmount',
      align: 'right',
      wordWrapEnabled: true,
      width: 165
    }, //     在庫金額(商品原価)
    {
      columnName: 'stockAmountRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 145
    }, //        在庫金額(定価)
    {
      columnName: 'averageCustomerUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //      客単価平均
    {
      columnName: 'averageGrossProfitUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //   粗利単価平均
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
    }, //        売上貢献度
    {
      columnName: 'grossProfitContributionScore',
      align: 'right',
      wordWrapEnabled: true
    }, //  粗利貢献度
    {
      columnName: 'predictedAverageSoldoutQuantityOneWeek',
      align: 'right',
      width: 150
    }, //  予測販売数(1W)
    { columnName: 'stockRiskScore', align: 'right', wordWrapEnabled: true }, //                在庫リスク
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
    { columnName: 'retailPrice', align: 'right' }, //                   定価
    { columnName: 'wholesalePrice', align: 'right' }, //                卸価格
    { columnName: 'costPrice', align: 'right', wordWrapEnabled: true }, //                     商品原価
    Const.IS_DISPLAY_QUALITY.includes(analysisType) &&
      isNotProductCodesList && {
        columnName: 'quadrantClassification',
        align: 'right',
        width: 120
      } // クオリティ
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'skuCustomerId', sortingEnabled: true },
    { columnName: 'parentSkuCustomerId', sortingEnabled: true },
    { columnName: 'productCodeCustomerId', sortingEnabled: true },
    { columnName: 'salesAmount', sortingEnabled: true },
    { columnName: 'grossProfitAmount', sortingEnabled: true },
    { columnName: 'salesQuantity', sortingEnabled: true },
    { columnName: 'stockQuantity', sortingEnabled: true },
    { columnName: 'salesContributionScore', sortingEnabled: true },
    { columnName: 'grossProfitContributionScore', sortingEnabled: true },
    {
      columnName: 'predictedAverageSoldoutQuantityOneWeek',
      sortingEnabled: true
    },
    { columnName: 'averageCustomerUnitPrice', sortingEnabled: true },
    { columnName: 'averageGrossProfitUnitPrice', sortingEnabled: true },
    { columnName: 'skuUnitPrice', sortingEnabled: true },
    { columnName: 'skuGrossProfitUnitPrice', sortingEnabled: true },
    { columnName: 'stockRiskScore', sortingEnabled: true },
    { columnName: 'predictedSoldoutDt', sortingEnabled: true },
    { columnName: 'predictedSoldoutDays', sortingEnabled: true },
    { columnName: 'predictedSoldoutWeeks', sortingEnabled: true },
    { columnName: 'retailPrice', sortingEnabled: true },
    { columnName: 'wholesalePrice', sortingEnabled: true },
    { columnName: 'costPrice', sortingEnabled: true },
    { columnName: 'quadrantClassification', sortingEnabled: false }
  ])

  // デフォルトで非表示にしたいカラムを指定
  const defaultHiddenColumnNames: string[] = [
    'indexType',
    'stockAmount',
    'stockAmountRetailPrice',
    'skuUnitPrice',
    'averageCustomerUnitPrice',
    'averageGrossProfitUnitPrice',
    'skuGrossProfitUnitPrice',
    'salesContributionScore',
    'grossProfitContributionScore',
    'stockRiskScore',
    'predictedSoldoutDt',
    'predictedSoldoutDays',
    'predictedSoldoutWeeks',
    'predictedAverageSoldoutQuantityOneWeek',
    'retailPrice',
    'wholesalePrice',
    'costPrice'
  ]
  const [hiddenColumnNames, setDefaultHiddenColumns] = useState<string[]>([
    'indexType',
    'stockAmount',
    'stockAmountRetailPrice',
    'skuUnitPrice',
    'averageCustomerUnitPrice',
    'averageGrossProfitUnitPrice',
    'skuGrossProfitUnitPrice',
    'salesContributionScore',
    'grossProfitContributionScore',
    'stockRiskScore',
    'predictedSoldoutDt',
    'predictedSoldoutDays',
    'predictedSoldoutWeeks',
    'predictedAverageSoldoutQuantityOneWeek',
    'wholesalePrice'
  ])
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

  useLayoutEffect(() => {
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

              {filterButtonGroupProps ? (
                <FilterBtnGroup
                  {...filterButtonGroupProps}
                  setDefaultHiddenColumns={setDefaultHiddenColumns}
                />
              ) : (
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
              )}
            </Box>
          }
          paginationComponent={pagination && <Pagination {...pagination} />}
          idPaginationComponent={
            idPagination && <IdPagination {...idPagination} />
          }
          switchProps={switchProps}
          className={clsx([
            'pt-6',
            'pb-6',
            (parentSku || productCode || skuDialog) && 'pl-12'
          ])}
          classes={classes}
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
        <></>
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
              defaultHiddenColumnNames={
                !filterButtonGroupProps && defaultHiddenColumnNames
              }
              hiddenColumnNames={filterButtonGroupProps && hiddenColumnNames}
              columnExtensions={tableColumnVisibilityColumnExtensions}
            />
            <IntegratedSelection />
            <TableSelection showSelectAll showSelectionColumn={!skuDialog} />
            <TableFixedColumns
              leftColumns={[
                TableSelection.COLUMN_TYPE,
                'image',
                'skuCustomerId'
              ]}
            />
            <Toolbar />
            {/* 指標を変更 */}
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
    loading: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10
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
      borderRight: 'solid 1px #ECEEF0',
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
