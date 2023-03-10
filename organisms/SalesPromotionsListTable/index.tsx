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
import Icon from '@components/atoms/Icons'
import { Props as PaginationProps } from '@hooks/usePagination/enhance'
import IdPagination from '@hooks/useIdPagination'
import { Props as IdPaginationProps } from '@hooks/useIdPagination/enhance'
import { Edge as SkusEdge } from '@typeDefs/salesSkus'
import { Edge as ParentSkuEdge } from '@typeDefs/salesParentSkus'
import { Edge as ProductCodeEdge } from '@typeDefs/salesPromotionProductCodes'
import Button from '@components/atoms/Button'
import TableHeader from '@components/molecules/TableHeader'
import FilterBtnGroup from '@hooks/useConditionFilter/useFilterBtnGroup'
import { useRouter } from 'next/router'
import { FilterButtonGroupPropsInterface } from '@typeDefs/conditionFilter'
import Const from '@constants'
import Utils from '@utils'
import CustomChooseColumn, { ColumnChooserOverlay } from './useColumnChooser'
import { useColumnChooser } from './useColumnChooser/enhance'
// γγΌγγ«
const TableRoot = (props) => (
  <TGrid.Root {...props} style={{ height: 'calc(100vh - 15.7rem)' }} />
)
interface Props {
  analysisType?: string
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
  skuDialog?: boolean
  filterButtonGroupProps?: FilterButtonGroupPropsInterface
}

const TableComponent = ({
  analysisType,
  productCode,
  parentSku,
  tableHeaderRowComponent,
  tableCellComponent,
  edges,
  pagination,
  idPagination,
  sortingState,
  handleOpenSideBar,
  useFilter,
  skuDialog,
  filterButtonGroupProps,
  filterComponent
}: Props): JSX.Element => {
  const tableClasses = tableStyle()
  let columns: Column[] = [
    { name: 'deleteButton', title: '  ' },
    { name: 'image', title: '  ' },
    { name: 'skuCustomerId', title: 'SKU' },
    { name: 'parentSkuCustomerId', title: 'θ¦ͺSKU' },
    { name: 'productCodeCustomerId', title: 'εηͺ' },
    // { name: 'combinationSkuButton', title: '  ' },
    { name: 'indexType', title: 'εΊζ¬ζζ¨' },
    { name: 'desiredPrice', title: 'δΊε?ε£²δΎ‘' },
    { name: 'localGrossProfit', title: 'ζ³ε?η²ε©' },
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
  // θ¦ͺSKU,εηͺθ‘¨η€Ίγ?γ¨γ(skusβ true)θ‘¨η€Ίγγͺγγ«γ©γ γζε?
  let excludeColumnName = []
  let fixedColumn = ['deleteButton', 'image']
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
        'predictedSoldoutWeeks' // ε?ε£²δΊζΈ¬ι±ζ°
      ]
      fixedColumn.push('parentSkuCustomerId')
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
        'predictedSoldoutWeeks' // ε?ε£²δΊζΈ¬ι±ζ°
      ]
      fixedColumn.push('productCodeCustomerId')
      break
    case skuDialog:
      excludeColumnName = [
        'productCodeCustomerId' // εηͺ
      ]
      break
    default:
      fixedColumn.push(
        'skuCustomerId',
        'parentSkuCustomerId',
        'productCodeCustomerId',
        'desiredPrice',
        'localGrossProfit'
      )
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
    { columnName: 'parentSkuCustomerId', align: 'left' }, //            θ¦ͺSKU
    { columnName: 'productCodeCustomerId', align: 'left' }, //          εηͺ
    // { columnName: 'combinationSkuButton', align: 'right' }, //       εγγθ²·γ
    { columnName: 'desiredPrice', align: 'right' }, //                  δΊε?ε£²δΎ‘
    { columnName: 'localGrossProfit', align: 'right' }, //              ζ³ε?η²ε©
    { columnName: 'quadrantClassification', align: 'center' },
    { columnName: 'retailPrice', align: 'right' }, //                   ε?δΎ‘
    { columnName: 'wholesalePrice', align: 'right' }, //                εΈδΎ‘ζ Ό
    { columnName: 'costPrice', align: 'right' }, //                     εεεδΎ‘
    { columnName: 'salesAmount', align: 'right' }, //                   ε£²δΈιι‘
    { columnName: 'grossProfitAmount', align: 'right' }, //             η²ε©ιι‘
    { columnName: 'salesQuantity', align: 'right' }, //                 θ²©ε£²ζ°
    { columnName: 'stockQuantity', align: 'right' }, //                 ε¨εΊ«ζ°
    {
      columnName: 'stockAmount',
      align: 'right',
      wordWrapEnabled: true,
      width: 165
    }, //                   ε¨εΊ«ιι‘(εεεδΎ‘)
    {
      columnName: 'stockAmountRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 145
    }, //        ε¨εΊ«ιι‘(ε?δΎ‘)
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
    { columnName: 'skuUnitPrice', align: 'right', wordWrapEnabled: true }, //                  εεεδΎ‘
    {
      columnName: 'skuGrossProfitUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, //       εεη²ε©εδΎ‘
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
    } //          ε?ε£²δΊζΈ¬ι±ζ°
  ])
  // γ―γͺγͺγγ£εζζγ―θ‘¨η€Ί(η·¨ιγ’γΌγγ§γ―ιθ‘¨η€Ί)
  const { query } = useRouter()
  columns = Utils.addQuadrantClassificationColumn(
    query,
    columns,
    analysisType,
    8
  ).columns
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'deleteButton', sortingEnabled: false },
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'skuCustomerId', sortingEnabled: true },
    { columnName: 'parentSkuCustomerId', sortingEnabled: true },
    { columnName: 'productCodeCustomerId', sortingEnabled: true },
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
    { columnName: 'quadrantClassification', sortingEnabled: false }
  ])

  const defaultHiddenColumnNames: string[] = [
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
    'skuUnitPrice',
    'skuGrossProfitUnitPrice',
    'stockRiskScore',
    'predictedAverageSoldoutQuantityOneWeek',
    'predictedSoldoutDt',
    'predictedSoldoutDays',
    'predictedSoldoutWeeks'
  ]
  const [hiddenColumnNames, setDefaultHiddenColumnNames] = useState<string[]>([
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
    'skuUnitPrice',
    'skuGrossProfitUnitPrice',
    'stockRiskScore',
    'predictedAverageSoldoutQuantityOneWeek',
    'predictedSoldoutDt',
    'predictedSoldoutDays',
    'predictedSoldoutWeeks',
    'wholesalePrice'
  ])
  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'deleteButton', togglingEnabled: false },
    { columnName: 'image', togglingEnabled: false },
    { columnName: 'skuCustomerId', togglingEnabled: false },
    { columnName: 'parentSkuCustomerId', togglingEnabled: false },
    { columnName: 'productCodeCustomerId', togglingEnabled: false },
    { columnName: 'desiredPrice', togglingEnabled: false },
    { columnName: 'localGrossProfit', togglingEnabled: false }
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
                  className={tableClasses.boxControl}
                >
                  <Icon>icon_control</Icon>
                </Box>
              )}

              {filterButtonGroupProps ? (
                <FilterBtnGroup
                  {...filterButtonGroupProps}
                  setDefaultHiddenColumns={setDefaultHiddenColumnNames}
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
          className={clsx([
            'pt-6',
            'pb-6',
            (parentSku || productCode || skuDialog) && 'pl-12'
          ])}
          classes={tableClasses}
        >
          {filterComponent}
        </TableHeader>
      </div>

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
            defaultHiddenColumnNames={
              !filterButtonGroupProps && defaultHiddenColumnNames
            }
            hiddenColumnNames={filterButtonGroupProps && hiddenColumnNames}
            columnExtensions={tableColumnVisibilityColumnExtensions}
          />
          <Toolbar />
          {/* ζζ¨γε€ζ΄ */}
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
    paddingBottom: '4rem',
    width: '100%',
    border: 'none',
    boxShadow: 'none',
    '& table': {
      borderTop: 'solid 1px #d2d4d8',
      minWidth: 'inherit !important',
      marginBottom: 'unset !important',
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
  },
  boxControl: {
    cursor: 'pointer',
    height: '36px'
  }
}))
