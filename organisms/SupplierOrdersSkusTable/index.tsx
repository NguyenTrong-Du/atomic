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
// γγΌγγ«
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

  // θ¦ͺSKU,εηͺθ‘¨η€Ίγ?γ¨γ(skusβ true)θ‘¨η€Ίγγͺγγ«γ©γ γζε?
  let excludeColumnName = []
  switch (true) {
    case parentSku:
      excludeColumnName = [
        'stockAmountRetailPrice',
        'skuCustomerId', // SKU
        'productCodeCustomerId', // εηͺ
        'salesContributionScore', // ε£²δΈθ²’η?εΊ¦
        'grossProfitContributionScore', // η²ε©θ²’η?εΊ¦
        'stockRiskScore', // ε¨εΊ«γͺγΉγ―
        'predictedSoldoutDt', // ε?ε£²δΊζΈ¬ζ₯
        'predictedSoldoutDays', // ε?ε£²δΊζΈ¬ζ₯ζ°
        'predictedSoldoutWeeks' // ε?ε£²δΊζΈ¬ι±ζ°
      ]
      break
    case productCode:
      excludeColumnName = [
        'stockAmountRetailPrice',
        'skuCustomerId', // SKU
        'parentSkuCustomerId', // θ¦ͺSKU
        'salesContributionScore', // ε£²δΈθ²’η?εΊ¦
        'grossProfitContributionScore', // η²ε©θ²’η?εΊ¦
        'stockRiskScore', // ε¨εΊ«γͺγΉγ―
        'predictedSoldoutDt', // ε?ε£²δΊζΈ¬ζ₯
        'predictedSoldoutDays', // ε?ε£²δΊζΈ¬ζ₯ζ°
        'predictedSoldoutWeeks' // ε?ε£²δΊζΈ¬ι±ζ°
      ]
      break
    default:
      break
  }
  const excludeColumn = (colums: Column[]) => {
    return colums.filter((v) => !excludeColumnName.includes(v.name))
  }

  // εΊζ¬γ?γ«γ©γ θ¨­ε?
  const columns: Column[] = [
    { name: 'image', title: '  ' },
    { name: 'skuCustomerId', title: 'SKU' },
    { name: 'parentSkuCustomerId', title: 'θ¦ͺSKU' },
    { name: 'productCodeCustomerId', title: 'εηͺ' },
    { name: 'recommendedOrderAmount', title: 'ζ¨ε₯¨ηΊζ³¨ιι‘' },
    { name: 'recommendedOrderQuantity', title: 'ζ¨ε₯¨ηΊζ³¨ζ°' },
    { name: 'predictedSalesQuantity', title: 'θ²©ε£²δΊζΈ¬ζ°' },
    { name: 'stockQuantityAll', title: 'ε¨η€Ύε¨εΊ«ζ°' },
    { name: 'backlogStockQuantity', title: 'ηΊζ³¨ζ?' },

    { name: 'indexType', title: 'ηΊζ³¨ζζ¨' },
    { name: 'predictedSoldoutDtAfterArrival', title: 'ε₯θ·εΎε?ε£²δΊζΈ¬ζ₯' },
    { name: 'leadTimeDay', title: 'γͺγΌγγΏγ€γ ' },
    { name: 'desiredStockDay', title: 'ε₯θ·εΎε¨εΊ«ζ₯ζ°' },

    { name: 'indexType', title: 'εΊζ¬ζζ¨' },
    { name: 'salesAmount', title: 'ε£²δΈιι‘' },
    { name: 'grossProfitAmount', title: 'η²ε©ιι‘' },
    { name: 'salesQuantity', title: 'θ²©ε£²ζ°' },
    { name: 'stockQuantityCentral', title: 'εεΊ«ε¨εΊ«ζ°' },
    { name: 'stockAmountCentral', title: 'εεΊ«ε¨εΊ«ιι‘(εεεδΎ‘)' },
    { name: 'stockAmountCentralRetailPrice', title: 'εεΊ«ε¨εΊ«ιι‘(ε?δΎ‘)' },
    { name: 'stockAmountAll', title: 'ε¨η€Ύε¨εΊ«ιι‘(εεεδΎ‘)' },
    { name: 'stockAmountAllRetailPrice', title: 'ε¨η€Ύε¨εΊ«ιι‘(ε?δΎ‘)' },

    { name: 'indexType', title: 'δΊζΈ¬η³»ζζ¨' },
    { name: 'salesContributionScore', title: 'ε£²δΈθ²’η?εΊ¦' },
    { name: 'grossProfitContributionScore', title: 'η²ε©θ²’η?εΊ¦' },
    { name: 'stockRiskScore', title: 'ε¨εΊ«γͺγΉγ―' },
    { name: 'predictedSoldoutDt', title: 'ε?ε£²δΊζΈ¬ζ₯' },
    { name: 'predictedSoldoutDays', title: 'ε?ε£²δΊζΈ¬ζ₯ζ°' },
    { name: 'predictedSoldoutWeeks', title: 'ε?ε£²δΊζΈ¬ι±ζ°' },

    { name: 'indexType', title: 'εεγγΉγΏζζ¨' },
    { name: 'retailPrice', title: 'ε?δΎ‘' },
    { name: 'wholesalePrice', title: 'εΈδΎ‘ζ Ό' },
    { name: 'costPrice', title: 'εεεδΎ‘' }
  ]
  // γ―γͺγͺγγ£εζζγ―θ‘¨η€Ί(η·¨ιγ’γΌγγ§γ―ιθ‘¨η€Ί)

  // alignγ?θͺΏζ΄
  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'image', align: 'center', width: 46 },
    { columnName: 'skuCustomerId', align: 'left', width: 280 }, // SKU
    { columnName: 'parentSkuCustomerId', align: 'left' }, // θ¦ͺSKU
    { columnName: 'productCodeCustomerId', align: 'left' }, // εηͺ
    { columnName: 'recommendedOrderAmount', align: 'right' }, // ζ¨ε₯¨ηΊζ³¨ιι‘
    { columnName: 'recommendedOrderQuantity', align: 'right' }, // ζ¨ε₯¨ηΊζ³¨ζ°
    { columnName: 'predictedSalesQuantity', align: 'right' }, // θ²©ε£²δΊζΈ¬ζ°
    { columnName: 'stockQuantityAll', align: 'right' }, // ε¨η€Ύε¨εΊ«ζ°
    { columnName: 'backlogStockQuantity', align: 'right' }, // ηΊζ³¨ζ?

    {
      columnName: 'predictedSoldoutDtAfterArrival',
      align: 'right',
      wordWrapEnabled: true
    }, // ε₯θ·εΎε?ε£²δΊζΈ¬ζ₯
    { columnName: 'leadTimeDay', align: 'right' }, // γͺγΌγγΏγ€γ 
    { columnName: 'desiredStockDay', align: 'right', wordWrapEnabled: true }, // ε₯θ·εΎε¨εΊ«ζ₯ζ°

    { columnName: 'salesAmount', align: 'right' }, // ε£²δΈιι‘
    { columnName: 'grossProfitAmount', align: 'right' }, // η²ε©ιι‘
    { columnName: 'salesQuantity', align: 'right' }, // θ²©ε£²ζ°
    { columnName: 'stockQuantityCentral', align: 'right' }, // εεΊ«ε¨εΊ«ζ°
    { columnName: 'stockAmountCentral', align: 'right', wordWrapEnabled: true }, // εεΊ«ε¨εΊ«ιι‘(εεεδΎ‘)
    {
      columnName: 'stockAmountCentralRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // εεΊ«ε¨εΊ«ιι‘(ε?δΎ‘)
    { columnName: 'stockAmountAll', align: 'right', wordWrapEnabled: true }, // ε¨η€Ύε¨εΊ«ιι‘(εεεδΎ‘)
    {
      columnName: 'stockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // ε¨η€Ύε¨εΊ«ιι‘(ε?δΎ‘)

    { columnName: 'salesContributionScore', align: 'right' }, // ε£²δΈθ²’η?εΊ¦
    { columnName: 'grossProfitContributionScore', align: 'right' }, // η²ε©θ²’η?εΊ¦
    { columnName: 'stockRiskScore', align: 'right' }, // ε¨εΊ«γͺγΉγ―
    { columnName: 'predictedSoldoutDt', align: 'right' }, // ε?ε£²δΊζΈ¬ζ₯
    { columnName: 'predictedSoldoutDays', align: 'right' }, // ε?ε£²δΊζΈ¬ζ₯ζ°
    { columnName: 'predictedSoldoutWeeks', align: 'right' }, // ε?ε£²δΊζΈ¬ι±ζ°

    { columnName: 'retailPrice', align: 'right' }, // ε?δΎ‘
    { columnName: 'wholesalePrice', align: 'right' }, // εΈδΎ‘ζ Ό
    { columnName: 'costPrice', align: 'right' } // εεεδΎ‘
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'skuCustomerId', sortingEnabled: true },
    { columnName: 'parentSkuCustomerId', sortingEnabled: true }, // θ¦ͺSKU
    { columnName: 'productCodeCustomerId', sortingEnabled: true }, // εηͺ
    { columnName: 'recommendedOrderAmount', sortingEnabled: true }, // ζ¨ε₯¨ηΊζ³¨ιι‘
    { columnName: 'recommendedOrderQuantity', sortingEnabled: true }, // ζ¨ε₯¨ηΊζ³¨ζ°
    { columnName: 'predictedSalesQuantity', sortingEnabled: true }, // θ²©ε£²δΊζΈ¬ζ°
    { columnName: 'stockQuantityAll', sortingEnabled: true }, // ε¨η€Ύε¨εΊ«ζ°
    { columnName: 'backlogStockQuantity', sortingEnabled: true }, // ηΊζ³¨ζ?

    { columnName: 'predictedSoldoutDtAfterArrival', sortingEnabled: true }, // ε₯θ·εΎε?ε£²δΊζΈ¬ζ₯
    { columnName: 'leadTimeDay', sortingEnabled: true }, // γͺγΌγγΏγ€γ 
    { columnName: 'desiredStockDay', sortingEnabled: true }, // ε₯θ·εΎε¨εΊ«ζ₯ζ°

    { columnName: 'salesAmount', sortingEnabled: true }, // ε£²δΈιι‘
    { columnName: 'grossProfitAmount', sortingEnabled: true }, // η²ε©ιι‘
    { columnName: 'salesQuantity', sortingEnabled: true }, // θ²©ε£²ζ°
    { columnName: 'stockQuantityCentral', sortingEnabled: true }, // εεΊ«ε¨εΊ«ζ°
    { columnName: 'stockAmountCentral', sortingEnabled: true }, // εεΊ«ε¨εΊ«ιι‘(εεεδΎ‘)
    { columnName: 'stockAmountCentralRetailPrice', sortingEnabled: true }, // εεΊ«ε¨εΊ«ιι‘(ε?δΎ‘)
    { columnName: 'stockAmountAll', sortingEnabled: true }, // ε¨η€Ύε¨εΊ«ιι‘(εεεδΎ‘)
    { columnName: 'stockAmountAllRetailPrice', sortingEnabled: true }, // ε¨η€Ύε¨εΊ«ιι‘(ε?δΎ‘)

    { columnName: 'salesContributionScore', sortingEnabled: true }, // ε£²δΈθ²’η?εΊ¦
    { columnName: 'grossProfitContributionScore', sortingEnabled: true }, // η²ε©θ²’η?εΊ¦
    { columnName: 'stockRiskScore', sortingEnabled: true }, // ε¨εΊ«γͺγΉγ―
    { columnName: 'predictedSoldoutDt', sortingEnabled: true }, // ε?ε£²δΊζΈ¬ζ₯
    { columnName: 'predictedSoldoutDays', sortingEnabled: true }, // ε?ε£²δΊζΈ¬ζ₯ζ°
    { columnName: 'predictedSoldoutWeeks', sortingEnabled: true }, // ε?ε£²δΊζΈ¬ι±ζ°

    { columnName: 'retailPrice', sortingEnabled: true }, // ε?δΎ‘
    { columnName: 'wholesalePrice', sortingEnabled: true }, // εΈδΎ‘ζ Ό
    { columnName: 'costPrice', sortingEnabled: true } // εεεδΎ‘
  ])

  // γγγ©γ«γγ§ιθ‘¨η€Ίγ«γγγγ«γ©γ γζε?
  const [defaultHiddenColumnNames] = useState([
    'indexType',

    'predictedSoldoutDtAfterArrival', // ε₯θ·εΎε?ε£²δΊζΈ¬ζ₯
    'leadTimeDay', // γͺγΌγγΏγ€γ 
    'desiredStockDay', // ε₯θ·εΎε¨εΊ«ζ₯ζ°

    'salesAmount', // ε£²δΈιι‘
    'grossProfitAmount', // η²ε©ιι‘
    'salesQuantity', // θ²©ε£²ζ°
    'stockQuantityCentral', // εεΊ«ε¨εΊ«ζ°
    'stockAmountCentral', // εεΊ«ε¨εΊ«ιι‘(εεεδΎ‘)
    'stockAmountCentralRetailPrice', // εεΊ«ε¨εΊ«ιι‘(ε?δΎ‘)
    'stockAmountAll', // ε¨η€Ύε¨εΊ«ιι‘(εεεδΎ‘)
    'stockAmountAllRetailPrice', // ε¨η€Ύε¨εΊ«ιι‘(ε?δΎ‘)

    'salesContributionScore', // ε£²δΈθ²’η?εΊ¦
    'grossProfitContributionScore', // η²ε©θ²’η?εΊ¦
    'stockRiskScore', // ε¨εΊ«γͺγΉγ―
    'predictedSoldoutDt', // ε?ε£²δΊζΈ¬ζ₯
    'predictedSoldoutDays', // ε?ε£²δΊζΈ¬ζ₯ζ°
    'predictedSoldoutWeeks', // ε?ε£²δΊζΈ¬ι±ζ°

    'retailPrice', // ε?δΎ‘
    'wholesalePrice', // εΈδΎ‘ζ Ό
    'costPrice' // εεεδΎ‘
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

  // devexpressγ³γ³γγΌγγ³γoverlay
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
      // δΈθ‘θ‘¨η€Ίγ?ε ΄εγTableHeaderγ?Height_max = 66.75
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
            {/* ζζ¨γε€ζ΄ */}
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
