import React, { useState, useEffect, useRef } from 'react'
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
import { Edge as SkusEdge } from '@typeDefs/supplierOrdersSkus'
import Button from '@components/atoms/Button'
import Const from '@constants/index'
import Icon from '@components/atoms/Icons'
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
  filterComponent?: JSX.Element
  tableHeaderRowComponent?
  tableCellComponent
  cacheKey: string
  edges: SkusEdge[]
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

  // 親SKU,品番表示のとき(skus≠true)表示しないカラムを指定
  let excludeColumnName = []
  switch (true) {
    case parentSku:
      excludeColumnName = [
        'stockAmountRetailPrice',
        'skuCustomerId', // SKU
        'productCodeCustomerId', // 品番
        'salesContributionScore', // 売上貢献度
        'grossProfitContributionScore', // 粗利貢献度
        'stockRiskScore', // 在庫リスク
        'predictedSoldoutDt', // 完売予測日
        'predictedSoldoutDays', // 完売予測日数
        'predictedSoldoutWeeks' // 完売予測週数
      ]
      break
    case productCode:
      excludeColumnName = [
        'stockAmountRetailPrice',
        'skuCustomerId', // SKU
        'parentSkuCustomerId', // 親SKU
        'salesContributionScore', // 売上貢献度
        'grossProfitContributionScore', // 粗利貢献度
        'stockRiskScore', // 在庫リスク
        'predictedSoldoutDt', // 完売予測日
        'predictedSoldoutDays', // 完売予測日数
        'predictedSoldoutWeeks' // 完売予測週数
      ]
      break
    default:
      break
  }
  const excludeColumn = (colums: Column[]) => {
    return colums.filter((v) => !excludeColumnName.includes(v.name))
  }

  // 基本のカラム設定
  const columns: Column[] = [
    { name: 'image', title: '  ' },
    { name: 'skuCustomerId', title: 'SKU' },
    { name: 'parentSkuCustomerId', title: '親SKU' },
    { name: 'productCodeCustomerId', title: '品番' },
    { name: 'recommendedOrderAmount', title: '推奨発注金額' },
    { name: 'recommendedOrderQuantity', title: '推奨発注数' },
    { name: 'predictedSalesQuantity', title: '販売予測数' },
    { name: 'stockQuantityAll', title: '全社在庫数' },
    { name: 'backlogStockQuantity', title: '発注残' },

    { name: 'indexType', title: '発注指標' },
    { name: 'predictedSoldoutDtAfterArrival', title: '入荷後完売予測日' },
    { name: 'leadTimeDay', title: 'リードタイム' },
    { name: 'desiredStockDay', title: '入荷後在庫日数' },

    { name: 'indexType', title: '基本指標' },
    { name: 'salesAmount', title: '売上金額' },
    { name: 'grossProfitAmount', title: '粗利金額' },
    { name: 'salesQuantity', title: '販売数' },
    { name: 'stockQuantityCentral', title: '倉庫在庫数' },
    { name: 'stockAmountCentral', title: '倉庫在庫金額(商品原価)' },
    { name: 'stockAmountCentralRetailPrice', title: '倉庫在庫金額(定価)' },
    { name: 'stockAmountAll', title: '全社在庫金額(商品原価)' },
    { name: 'stockAmountAllRetailPrice', title: '全社在庫金額(定価)' },

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
  // クオリティ分析時は表示(編集モードでは非表示)

  // alignの調整
  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'image', align: 'center', width: 46 },
    { columnName: 'skuCustomerId', align: 'left', width: 280 }, // SKU
    { columnName: 'parentSkuCustomerId', align: 'left' }, // 親SKU
    { columnName: 'productCodeCustomerId', align: 'left' }, // 品番
    { columnName: 'recommendedOrderAmount', align: 'right' }, // 推奨発注金額
    { columnName: 'recommendedOrderQuantity', align: 'right' }, // 推奨発注数
    { columnName: 'predictedSalesQuantity', align: 'right' }, // 販売予測数
    { columnName: 'stockQuantityAll', align: 'right' }, // 全社在庫数
    { columnName: 'backlogStockQuantity', align: 'right' }, // 発注残

    {
      columnName: 'predictedSoldoutDtAfterArrival',
      align: 'right',
      wordWrapEnabled: true
    }, // 入荷後完売予測日
    { columnName: 'leadTimeDay', align: 'right' }, // リードタイム
    { columnName: 'desiredStockDay', align: 'right', wordWrapEnabled: true }, // 入荷後在庫日数

    { columnName: 'salesAmount', align: 'right' }, // 売上金額
    { columnName: 'grossProfitAmount', align: 'right' }, // 粗利金額
    { columnName: 'salesQuantity', align: 'right' }, // 販売数
    { columnName: 'stockQuantityCentral', align: 'right' }, // 倉庫在庫数
    { columnName: 'stockAmountCentral', align: 'right', wordWrapEnabled: true }, // 倉庫在庫金額(商品原価)
    {
      columnName: 'stockAmountCentralRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // 倉庫在庫金額(定価)
    { columnName: 'stockAmountAll', align: 'right', wordWrapEnabled: true }, // 全社在庫金額(商品原価)
    {
      columnName: 'stockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // 全社在庫金額(定価)

    { columnName: 'salesContributionScore', align: 'right' }, // 売上貢献度
    { columnName: 'grossProfitContributionScore', align: 'right' }, // 粗利貢献度
    { columnName: 'stockRiskScore', align: 'right' }, // 在庫リスク
    { columnName: 'predictedSoldoutDt', align: 'right' }, // 完売予測日
    { columnName: 'predictedSoldoutDays', align: 'right' }, // 完売予測日数
    { columnName: 'predictedSoldoutWeeks', align: 'right' }, // 完売予測週数

    { columnName: 'retailPrice', align: 'right' }, // 定価
    { columnName: 'wholesalePrice', align: 'right' }, // 卸価格
    { columnName: 'costPrice', align: 'right' } // 商品原価
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'skuCustomerId', sortingEnabled: true },
    { columnName: 'parentSkuCustomerId', sortingEnabled: true }, // 親SKU
    { columnName: 'productCodeCustomerId', sortingEnabled: true }, // 品番
    { columnName: 'recommendedOrderAmount', sortingEnabled: true }, // 推奨発注金額
    { columnName: 'recommendedOrderQuantity', sortingEnabled: true }, // 推奨発注数
    { columnName: 'predictedSalesQuantity', sortingEnabled: true }, // 販売予測数
    { columnName: 'stockQuantityAll', sortingEnabled: true }, // 全社在庫数
    { columnName: 'backlogStockQuantity', sortingEnabled: true }, // 発注残

    { columnName: 'predictedSoldoutDtAfterArrival', sortingEnabled: true }, // 入荷後完売予測日
    { columnName: 'leadTimeDay', sortingEnabled: true }, // リードタイム
    { columnName: 'desiredStockDay', sortingEnabled: true }, // 入荷後在庫日数

    { columnName: 'salesAmount', sortingEnabled: true }, // 売上金額
    { columnName: 'grossProfitAmount', sortingEnabled: true }, // 粗利金額
    { columnName: 'salesQuantity', sortingEnabled: true }, // 販売数
    { columnName: 'stockQuantityCentral', sortingEnabled: true }, // 倉庫在庫数
    { columnName: 'stockAmountCentral', sortingEnabled: true }, // 倉庫在庫金額(商品原価)
    { columnName: 'stockAmountCentralRetailPrice', sortingEnabled: true }, // 倉庫在庫金額(定価)
    { columnName: 'stockAmountAll', sortingEnabled: true }, // 全社在庫金額(商品原価)
    { columnName: 'stockAmountAllRetailPrice', sortingEnabled: true }, // 全社在庫金額(定価)

    { columnName: 'salesContributionScore', sortingEnabled: true }, // 売上貢献度
    { columnName: 'grossProfitContributionScore', sortingEnabled: true }, // 粗利貢献度
    { columnName: 'stockRiskScore', sortingEnabled: true }, // 在庫リスク
    { columnName: 'predictedSoldoutDt', sortingEnabled: true }, // 完売予測日
    { columnName: 'predictedSoldoutDays', sortingEnabled: true }, // 完売予測日数
    { columnName: 'predictedSoldoutWeeks', sortingEnabled: true }, // 完売予測週数

    { columnName: 'retailPrice', sortingEnabled: true }, // 定価
    { columnName: 'wholesalePrice', sortingEnabled: true }, // 卸価格
    { columnName: 'costPrice', sortingEnabled: true } // 商品原価
  ])

  // デフォルトで非表示にしたいカラムを指定
  const [defaultHiddenColumnNames] = useState([
    'indexType',

    'predictedSoldoutDtAfterArrival', // 入荷後完売予測日
    'leadTimeDay', // リードタイム
    'desiredStockDay', // 入荷後在庫日数

    'salesAmount', // 売上金額
    'grossProfitAmount', // 粗利金額
    'salesQuantity', // 販売数
    'stockQuantityCentral', // 倉庫在庫数
    'stockAmountCentral', // 倉庫在庫金額(商品原価)
    'stockAmountCentralRetailPrice', // 倉庫在庫金額(定価)
    'stockAmountAll', // 全社在庫金額(商品原価)
    'stockAmountAllRetailPrice', // 全社在庫金額(定価)

    'salesContributionScore', // 売上貢献度
    'grossProfitContributionScore', // 粗利貢献度
    'stockRiskScore', // 在庫リスク
    'predictedSoldoutDt', // 完売予測日
    'predictedSoldoutDays', // 完売予測日数
    'predictedSoldoutWeeks', // 完売予測週数

    'retailPrice', // 定価
    'wholesalePrice', // 卸価格
    'costPrice' // 商品原価
  ])
  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'image', togglingEnabled: false },
    { columnName: 'skuCustomerId', togglingEnabled: false },
    { columnName: 'parentSkuCustomerId', togglingEnabled: false },
    { columnName: 'productCodeCustomerId', togglingEnabled: false },
    { columnName: 'recommendedOrderAmount', togglingEnabled: false },
    { columnName: 'recommendedOrderQuantity', togglingEnabled: false },
    { columnName: 'predictedSalesQuantity', togglingEnabled: false },
    { columnName: 'stockQuantityAll', togglingEnabled: false },
    { columnName: 'backlogStockQuantity', togglingEnabled: false }
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
          className={clsx(['pt-6', 'pb-6', !useFilter && 'pl-12'])}
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
    buttonTune: {
      width: 48,
      height: 36,
      padding: 0,
      background: '#2D5AF0',
      borderRadius: '0px 5px 5px 0px',
      position: 'absolute',
      left: 0,
      zIndex: 999
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
      '& .Mui-disabled > .MuiTableSortLabel-icon': {
        opacity: 0
      },
      '& .MuiTableSortLabel-icon': {
        opacity: 0.2
      },
      '& .MuiSvgIcon-colorAction': {
        color: '#A5A9B1'
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
