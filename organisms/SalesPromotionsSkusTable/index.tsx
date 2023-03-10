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

// γγΌγγ«
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

  // θ¦ͺSKU,εηͺθ‘¨η€Ίγ?γ¨γ(skusβ true)θ‘¨η€Ίγγͺγγ«γ©γ γζε?
  let excludeColumnName = []
  switch (true) {
    case parentSku:
      excludeColumnName = [
        'skuCustomerId', // SKU
        'productCodeCustomerId', // εηͺ
        'salesContributionScore', // ε£²δΈθ²’η?εΊ¦
        'grossProfitContributionScore', // η²ε©θ²’η?εΊ¦
        'predictedAverageSoldoutQuantityOneWeek', // δΊζΈ¬θ²©ε£²ζ°(1W)
        'stockRiskScore', // ε¨εΊ«γͺγΉγ―
        'predictedSoldoutDt', // ε?ε£²δΊζΈ¬ζ₯
        'predictedSoldoutDays', // ε?ε£²δΊζΈ¬ζ₯ζ°
        'predictedSoldoutWeeks', // ε?ε£²δΊζΈ¬ι±ζ°
        'quadrantClassification' // γ―γͺγͺγγ£
      ]
      break
    case productCode:
      excludeColumnName = [
        'skuCustomerId', // SKU
        'parentSkuCustomerId', // θ¦ͺSKU
        'salesContributionScore', // ε£²δΈθ²’η?εΊ¦
        'grossProfitContributionScore', // η²ε©θ²’η?εΊ¦
        'predictedAverageSoldoutQuantityOneWeek', // δΊζΈ¬θ²©ε£²ζ°(1W)
        'stockRiskScore', // ε¨εΊ«γͺγΉγ―
        'predictedSoldoutDt', // ε?ε£²δΊζΈ¬ζ₯
        'predictedSoldoutDays', // ε?ε£²δΊζΈ¬ζ₯ζ°
        'predictedSoldoutWeeks', // ε?ε£²δΊζΈ¬ι±ζ°
        'quadrantClassification' // γ―γͺγͺγγ£
      ]
      break
    case skuDialog:
      excludeColumnName = [
        'productCodeCustomerId' // εηͺ
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

  // εΊζ¬γ?γ«γ©γ θ¨­ε?
  let columns: Column[] = [
    { name: 'image', title: '  ' },
    { name: 'skuCustomerId', title: 'SKU' },
    { name: 'parentSkuCustomerId', title: 'θ¦ͺSKU' },
    { name: 'productCodeCustomerId', title: 'εηͺ' },
    // { name: 'combinationSkuButton', title: '  ' },
    { name: 'indexType', title: 'εΊζ¬ζζ¨' },
    { name: 'salesAmount', title: 'ε£²δΈιι‘' },
    { name: 'grossProfitAmount', title: 'η²ε©ιι‘' },
    { name: 'salesQuantity', title: 'θ²©ε£²ζ°' },
    { name: 'stockQuantity', title: 'ε¨εΊ«ζ°' },
    { name: 'stockAmount', title: 'ε¨εΊ«ιι‘(εεεδΎ‘)' },
    { name: 'stockAmountRetailPrice', title: 'ε¨εΊ«ιι‘(ε?δΎ‘)' },
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
    { name: 'predictedAverageSoldoutQuantityOneWeek', title: 'δΊζΈ¬θ²©ε£²ζ°(1W)' },
    { name: 'indexType', title: 'εεγγΉγΏζζ¨' },
    { name: 'retailPrice', title: 'ε?δΎ‘' },
    { name: 'wholesalePrice', title: 'εΈδΎ‘ζ Ό' },
    { name: 'costPrice', title: 'εεεδΎ‘' }
  ]
  // γ―γͺγͺγγ£εζζγ―θ‘¨η€Ί(η·¨ιγ’γΌγγ§γ―ιθ‘¨η€Ί)
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

  // alignγ?θͺΏζ΄
  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'image', align: 'center', width: 70 },
    { columnName: 'skuCustomerId', align: 'left', width: 280 }, //      sku
    { columnName: 'parentSkuCustomerId', align: 'left' }, //            θ¦ͺSKU
    { columnName: 'productCodeCustomerId', align: 'left' }, //          εηͺ
    // { columnName: 'combinationSkuButton', align: 'right' }, //       εγγθ²·γ
    { columnName: 'salesAmount', align: 'right' }, //                   ε£²δΈιι‘
    { columnName: 'grossProfitAmount', align: 'right' }, //             η²ε©ιι‘
    { columnName: 'salesQuantity', align: 'right' }, //                 θ²©ε£²ζ°
    { columnName: 'stockQuantity', align: 'right' }, //                 ε¨εΊ«ζ°
    {
      columnName: 'stockAmount',
      align: 'right',
      wordWrapEnabled: true,
      width: 165
    }, //     ε¨εΊ«ιι‘(εεεδΎ‘)
    {
      columnName: 'stockAmountRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 145
    }, //        ε¨εΊ«ιι‘(ε?δΎ‘)
    {
      columnName: 'averageCustomerUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //      ε?’εδΎ‘εΉ³ε
    {
      columnName: 'averageGrossProfitUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //   η²ε©εδΎ‘εΉ³ε
    { columnName: 'skuUnitPrice', align: 'right' }, //                  εεεδΎ‘
    {
      columnName: 'skuGrossProfitUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //       εεη²ε©εδΎ‘
    {
      columnName: 'salesContributionScore',
      align: 'right',
      wordWrapEnabled: true
    }, //        ε£²δΈθ²’η?εΊ¦
    {
      columnName: 'grossProfitContributionScore',
      align: 'right',
      wordWrapEnabled: true
    }, //  η²ε©θ²’η?εΊ¦
    {
      columnName: 'predictedAverageSoldoutQuantityOneWeek',
      align: 'right',
      width: 150
    }, //  δΊζΈ¬θ²©ε£²ζ°(1W)
    { columnName: 'stockRiskScore', align: 'right', wordWrapEnabled: true }, //                ε¨εΊ«γͺγΉγ―
    { columnName: 'predictedSoldoutDt', align: 'right', wordWrapEnabled: true }, //            ε?ε£²δΊζΈ¬ζ₯
    {
      columnName: 'predictedSoldoutDays',
      align: 'right',
      wordWrapEnabled: true
    }, //          ε?ε£²δΊζΈ¬ζ₯ζ°
    {
      columnName: 'predictedSoldoutWeeks',
      align: 'right',
      wordWrapEnabled: true
    }, //         ε?ε£²δΊζΈ¬ι±ζ°
    { columnName: 'retailPrice', align: 'right' }, //                   ε?δΎ‘
    { columnName: 'wholesalePrice', align: 'right' }, //                εΈδΎ‘ζ Ό
    { columnName: 'costPrice', align: 'right', wordWrapEnabled: true }, //                     εεεδΎ‘
    Const.IS_DISPLAY_QUALITY.includes(analysisType) &&
      isNotProductCodesList && {
        columnName: 'quadrantClassification',
        align: 'right',
        width: 120
      } // γ―γͺγͺγγ£
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

  // γγγ©γ«γγ§ιθ‘¨η€Ίγ«γγγγ«γ©γ γζε?
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
