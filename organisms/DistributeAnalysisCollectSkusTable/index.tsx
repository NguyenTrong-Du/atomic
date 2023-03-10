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
import { Paper } from '@material-ui/core'
import Loading from '@components/atoms/Loading'
import Pagination from '@hooks/usePagination'
import IdPagination from '@hooks/useIdPagination'
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
// γγΌγγ«
const TableRoot = (props) => (
  <TGrid.Root {...props} style={{ height: 'calc(100vh - 12rem)' }} />
)
interface Props {
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
  sortingState
}: Props): JSX.Element => {
  const classes = useStyles()
  const tableClasses = tableStyle()

  // θ¦ͺSKU,εηͺθ‘¨η€Ίγ?γ¨γ(skusβ true)γ―θ¦ͺSKU,εηͺγ«γ©γ γθ‘¨η€Ίγγͺγ
  let excludeColumnName = []
  let fixedColumn = ['image']
  switch (true) {
    case parentSku:
      excludeColumnName = [
        'stockAmountCentralRetailPrice',
        'stockAmountAllRetailPrice',
        'skuCustomerId', // SKU
        'productCodeCustomerId', // εηͺ
        'salesContributionScore', // ε£²δΈθ²’η?εΊ¦
        'grossProfitContributionScore', // η²ε©θ²’η?εΊ¦
        'stockRiskScore', // ε¨εΊ«γͺγΉγ―
        'predictedSoldoutDt', // ε?ε£²δΊζΈ¬ζ₯
        'predictedSoldoutDays', // ε?ε£²δΊζΈ¬ζ₯ζ°
        'predictedSoldoutWeeks' // ε?ε£²δΊζΈ¬ι±ζ°
      ]
      fixedColumn.push('parentSkuCustomerId')
      break
    case productCode:
      excludeColumnName = [
        'stockAmountCentralRetailPrice',
        'stockAmountAllRetailPrice',
        'skuCustomerId', // SKU
        'parentSkuCustomerId', // εηͺ
        'salesContributionScore', // ε£²δΈθ²’η?εΊ¦
        'grossProfitContributionScore', // η²ε©θ²’η?εΊ¦
        'stockRiskScore', // ε¨εΊ«γͺγΉγ―
        'predictedSoldoutDt', // ε?ε£²δΊζΈ¬ζ₯
        'predictedSoldoutDays', // ε?ε£²δΊζΈ¬ζ₯ζ°
        'predictedSoldoutWeeks' // ε?ε£²δΊζΈ¬ι±ζ°
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
    { name: 'parentSkuCustomerId', title: 'θ¦ͺSKU' },
    { name: 'productCodeCustomerId', title: 'εηͺ' },
    { name: 'quality', title: 'γ―γͺγͺγγ£' },
    { name: 'indexType', title: 'γγ£γΉγγͺγγ₯γΌγζζ¨' },
    {
      name: 'recommendedCollectStockQuantityAll',
      title: 'ζ¨ε₯¨εεε¨εΊ«ζ°'
    },
    {
      name: 'recommendedCollectStockAmountAll',
      title: 'ζ¨ε₯¨εεε¨εΊ«ιι‘(εεεδΎ‘)'
    },
    {
      name: 'recommendedCollectStockAmountAllRetailPrice',
      title: 'ζ¨ε₯¨εεε¨εΊ«ιι‘(ε?δΎ‘)'
    },
    { name: 'shortageStockQuantity', title: 'εΊθδΈθΆ³ε¨εΊ«ζ°' },
    { name: 'shortageStockAmount', title: 'εΊθδΈθΆ³ε¨εΊ«ιι‘(εεεδΎ‘)' },
    { name: 'shortageStockAmountRetailPrice', title: 'εΊθδΈθΆ³ε¨εΊ«ιι‘(ε?δΎ‘)' },
    { name: 'excessStockQuantity', title: 'εΊθιε°ε¨εΊ«ζ°' },
    { name: 'excessStockAmount', title: 'εΊθιε°ε¨εΊ«ιι‘(εεεδΎ‘)' },
    { name: 'excessStockAmountRetailPrice', title: 'εΊθιε°ε¨εΊ«ιι‘(ε?δΎ‘)' },
    { name: 'indexType', title: 'εΊζ¬ζζ¨' },
    { name: 'salesAmount', title: 'ε£²δΈιι‘' },
    { name: 'grossProfitAmount', title: 'η²ε©ιι‘' },
    { name: 'salesQuantity', title: 'θ²©ε£²ζ°' },
    { name: 'stockQuantityCentral', title: 'εεΊ«ε¨εΊ«ζ°' },
    { name: 'stockAmountCentral', title: 'εεΊ«ε¨εΊ«ιι‘(εεεδΎ‘)' },
    { name: 'stockAmountCentralRetailPrice', title: 'εεΊ«ε¨εΊ«ιι‘(ε?δΎ‘)' },
    { name: 'backlogStockQuantity', title: 'ηΊζ³¨ζ?' },
    { name: 'stockQuantityAll', title: 'ε¨η€Ύε¨εΊ«ζ°' },
    { name: 'stockAmountAll', title: 'ε¨η€Ύε¨εΊ«ιι‘(εεεδΎ‘)' },
    { name: 'stockAmountAllRetailPrice', title: 'ε¨η€Ύε¨εΊ«ιι‘(ε?δΎ‘)' },
    { name: 'indexType', title: 'εδΎ‘εζζζ¨' },
    { name: 'averageCustomerUnitPrice', title: 'ε?’εδΎ‘εΉ³ε' },
    { name: 'averageGrossProfitUnitPrice', title: 'η²ε©εδΎ‘εΉ³ε' },
    { name: 'skuUnitPrice', title: 'εεεδΎ‘' },
    { name: 'skuGrossProfitUnitPrice', title: 'εεη²ε©εδΎ‘' },
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
  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'image', align: 'center', width: 46 },
    { columnName: 'skuCustomerId', align: 'left', width: 280 }, //      sku
    { columnName: 'parentSkuCustomerId', align: 'left' }, //            θ¦ͺSKU
    { columnName: 'productCodeCustomerId', align: 'left' }, //          εηͺ
    { columnName: 'quality', align: 'right' }, //    γ―γͺγͺγγ£
    {
      columnName: 'recommendedCollectStockQuantityAll',
      align: 'right',
      wordWrapEnabled: true,
      width: 130
    }, //     ζ¨ε₯¨εεε¨εΊ«ζ°
    {
      columnName: 'recommendedCollectStockAmountAll',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, //    ζ¨ε₯¨εεε¨εΊ«ιι‘(εεεδΎ‘)
    {
      columnName: 'recommendedCollectStockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // ζ¨ε₯¨εεε¨εΊ«ιι‘(ε?δΎ‘)
    {
      columnName: 'shortageStockQuantity',
      align: 'right',
      wordWrapEnabled: true,
      width: 125
    }, // εΊθδΈθΆ³ε¨εΊ«ζ°
    {
      columnName: 'shortageStockAmount',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // εΊθδΈθΆ³ε¨εΊ«ιι‘(εεεδΎ‘)
    {
      columnName: 'shortageStockAmountRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // εΊθδΈθΆ³ε¨εΊ«ιι‘(ε?δΎ‘)
    {
      columnName: 'excessStockQuantity',
      align: 'right',
      wordWrapEnabled: true,
      width: 125
    }, // εΊθιε°ε¨εΊ«ζ°
    {
      columnName: 'excessStockAmount',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // εΊθιε°ε¨εΊ«ιι‘(εεεδΎ‘)
    {
      columnName: 'excessStockAmountRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 140
    }, // εΊθιε°ε¨εΊ«ιι‘(ε?δΎ‘)
    { columnName: 'salesAmount', align: 'right' }, //                   ε£²δΈιι‘
    { columnName: 'grossProfitAmount', align: 'right' }, //             η²ε©ιι‘
    { columnName: 'salesQuantity', align: 'right' }, //                 θ²©ε£²ζ°
    { columnName: 'stockQuantityCentral', align: 'right' }, //          εεΊ«ε¨εΊ«ζ° β»εζθ‘¨η€Ί
    { columnName: 'stockAmountCentral', align: 'right', wordWrapEnabled: true }, //            εεΊ«ε¨εΊ«ιι‘(εεεδΎ‘)
    {
      columnName: 'stockAmountCentralRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // εεΊ«ε¨εΊ«ιι‘(ε?δΎ‘)
    { columnName: 'backlogStockQuantity', align: 'right' }, //          ηΊζ³¨ζ? β»εζθ‘¨η€Ί
    { columnName: 'stockQuantityAll', align: 'right' }, //              ε¨η€Ύε¨εΊ«ζ°
    { columnName: 'stockAmountAll', align: 'right', wordWrapEnabled: true }, //                ε¨η€Ύε¨εΊ«ιι‘(εεεδΎ‘)
    {
      columnName: 'stockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //     ε¨η€Ύε¨εΊ«ιι‘(ε?δΎ‘)
    { columnName: 'averageCustomerUnitPrice', align: 'right' }, //      ε?’εδΎ‘εΉ³ε
    { columnName: 'averageGrossProfitUnitPrice', align: 'right' }, // η²ε©εδΎ‘εΉ³ε
    { columnName: 'skuUnitPrice', align: 'right' }, //                  εεεδΎ‘
    { columnName: 'skuGrossProfitUnitPrice', align: 'right' }, //       εεη²ε©εδΎ‘
    { columnName: 'salesContributionScore', align: 'right' }, //        ε£²δΈθ²’η?εΊ¦ β»εζθ‘¨η€Ί
    { columnName: 'grossProfitContributionScore', align: 'right' }, //  η²ε©θ²’η?εΊ¦
    { columnName: 'stockRiskScore', align: 'right' }, //                ε¨εΊ«γͺγΉγ― β»εζθ‘¨η€Ί
    { columnName: 'predictedSoldoutDt', align: 'right' }, //            ε?ε£²δΊζΈ¬ζ₯
    { columnName: 'predictedSoldoutDays', align: 'right' }, //          ε?ε£²δΊζΈ¬ζ₯ζ°
    { columnName: 'predictedSoldoutWeeks', align: 'right' }, //         ε?ε£²δΊζΈ¬ι±ζ°
    { columnName: 'retailPrice', align: 'right' }, //                   ε?δΎ‘
    { columnName: 'wholesalePrice', align: 'right' }, //                εΈδΎ‘ζ Ό
    { columnName: 'costPrice', align: 'right' } //                      εεεδΎ‘
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'skuCustomerId', sortingEnabled: true },
    { columnName: 'parentSkuCustomerId', sortingEnabled: true },
    { columnName: 'productCodeCustomerId', sortingEnabled: true },
    { columnName: 'quality', sortingEnabled: false },
    { columnName: 'recommendedCollectStockQuantityAll', sortingEnabled: true },
    { columnName: 'recommendedCollectStockAmountAll', sortingEnabled: true },
    {
      columnName: 'recommendedCollectStockAmountAllRetailPrice',
      sortingEnabled: true
    },
    { columnName: 'shortageStockQuantity', sortingEnabled: true },
    { columnName: 'shortageStockAmount', sortingEnabled: true },
    { columnName: 'shortageStockAmountRetailPrice', sortingEnabled: true },
    { columnName: 'excessStockQuantity', sortingEnabled: true },
    { columnName: 'excessStockAmount', sortingEnabled: true },
    { columnName: 'excessStockAmountRetailPrice)', sortingEnabled: true },
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
          'grossProfitAmount', // η²ε©ιι‘
          'salesQuantity', // θ²©ε£²ζ°
          'stockAmountCentral', // εεΊ«ε¨εΊ«ιι‘(εεεδΎ‘)
          'stockQuantityAll', // ε¨η€Ύε¨εΊ«ζ°
          'stockAmountAll', // ε¨η€Ύε¨εΊ«ιι‘(εεεδΎ‘)
          'averageCustomerUnitPrice', // ε?’εδΎ‘εΉ³ε
          'skuUnitPrice', // εεεδΎ‘
          'skuGrossProfitUnitPrice', // εεη²ε©εδΎ‘
          'retailPrice', // ε?δΎ‘
          'wholesalePrice', // εΈδΎ‘ζ Ό
          'costPrice' // εεεδΎ‘
        ]
      : [
          'indexType',
          'recommendedCollectStockAmountAll',
          'recommendedCollectStockAmountAllRetailPrice',
          'shortageStockQuantity',
          'shortageStockAmount',
          'shortageStockAmountRetailPrice',
          'excessStockQuantity',
          'excessStockAmount',
          'excessStockAmountRetailPrice',
          'salesAmount', // ε£²δΈιι‘
          'grossProfitAmount', // η²ε©ιι‘
          'salesQuantity', // θ²©ε£²ζ°
          'stockAmountCentral', // εεΊ«ε¨εΊ«ιι‘(εεεδΎ‘)
          'stockAmountCentralRetailPrice', // εεΊ«ε¨εΊ«ιι‘(ε?δΎ‘)
          'backlogStockQuantity', //          ηΊζ³¨ζ? β»εζθ‘¨η€Ί
          'stockQuantityAll', // ε¨η€Ύε¨εΊ«ζ°
          'stockAmountAll', // ε¨η€Ύε¨εΊ«ιι‘(εεεδΎ‘),
          'stockAmountAllRetailPrice', // ε¨η€Ύε¨εΊ«ιι‘(ε?δΎ‘)
          'averageCustomerUnitPrice', // ε?’εδΎ‘εΉ³ε
          'averageGrossProfitUnitPrice', // η²ε©εδΎ‘θΏι
          'skuUnitPrice', // εεεδΎ‘
          'skuGrossProfitUnitPrice', // εεη²ε©εδΎ‘
          'salesContributionScore', // ε£²δΈθ²’η?εΊ¦
          'grossProfitContributionScore', // η²ε©θ²’η?εΊ¦
          'stockRiskScore', // ε¨εΊ«γͺγΉγ―
          'predictedSoldoutDt', // ε?ε£²δΊζΈ¬ζ₯
          'predictedSoldoutDays', // ε?ε£²δΊζΈ¬ζ₯ζ°
          'predictedSoldoutWeeks', // ε?ε£²δΊζΈ¬ι±ζ°
          'retailPrice', // ε?δΎ‘
          'wholesalePrice', // εΈδΎ‘ζ Ό
          'costPrice' // εεεδΎ‘
        ]
  )
  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'image', togglingEnabled: false },
    { columnName: 'skuCustomerId', togglingEnabled: false },
    { columnName: 'parentSkuCustomerId', togglingEnabled: false },
    { columnName: 'productCodeCustomerId', togglingEnabled: false }
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
            <TableSelection showSelectAll />
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
