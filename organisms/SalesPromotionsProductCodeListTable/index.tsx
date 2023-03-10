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
// γγΌγγ«
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
    { name: 'productCodeCustomerId', title: 'εηͺ' },
    { name: 'skuListButton', title: ' ' },
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
    { name: 'productCodeUnitPrice', title: 'εεεδΎ‘' },
    { name: 'productCodeGrossProfitUnitPrice', title: 'εεη²ε©εδΎ‘' },
    { name: 'indexType', title: 'δΊζΈ¬η³»ζζ¨' },
    { name: 'salesContributionScore', title: 'ε£²δΈθ²’η?εΊ¦' },
    { name: 'grossProfitContributionScore', title: 'η²ε©θ²’η?εΊ¦' },
    { name: 'predictedSoldoutDtMin', title: 'ε?ε£²δΊζΈ¬ζ₯(ζε°)' },
    { name: 'predictedSoldoutDtMax', title: 'ε?ε£²δΊζΈ¬ζ₯(ζε€§)' },
    { name: 'predictedSoldoutDaysMin', title: 'ε?ε£²δΊζΈ¬ζ₯ζ°(ζε°)' },
    { name: 'predictedSoldoutDaysMax', title: 'ε?ε£²δΊζΈ¬ζ₯ζ°(ζε€§)' },
    { name: 'predictedSoldoutWeeksMin', title: 'ε?ε£²δΊζΈ¬ι±ζ°(ζε°)' },
    { name: 'predictedSoldoutWeeksMax', title: 'ε?ε£²δΊζΈ¬ι±ζ°(ζε€§)' },
    { name: 'indexType', title: 'εηͺεγ?γ―γͺγͺγγ£' },
    { name: 'bestSkuRatio', title: 'Best-SKUη' },
    { name: 'betterSkuRatio', title: 'Better-SKUη' },
    { name: 'goodSkuRatio', title: 'Good-SKUη' },
    { name: 'badSkuRatio', title: 'Bad-SKUη' },
    { name: 'bestSkuKinds', title: 'Best-SKUζ°' },
    { name: 'betterSkuKinds', title: 'Better-SKUζ°' },
    { name: 'goodSkuKinds', title: 'Good-SKUζ°' },
    { name: 'badSkuKinds', title: 'Bad-SKUζ°' },
    { name: 'outOfAnalysisSkuKinds', title: 'εζε―Ύθ±‘ε€-SKUζ°' },
    { name: 'totalSkuKinds', title: 'εθ¨-SKUζ°' },
    { name: 'outOfStockSkuRatio', title: 'ζ¬ εSKUη' },
    { name: 'indexType', title: 'εεγγΉγΏζζ¨' },
    { name: 'retailPrice', title: 'ε?δΎ‘' },
    { name: 'wholesalePrice', title: 'εΈδΎ‘ζ Ό' },
    { name: 'costPrice', title: 'εεεδΎ‘' }
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
    { columnName: 'productCodeCustomerId', align: 'left', width: 280 }, // εηͺ
    { columnName: 'skuListButton', align: 'right', width: 40 }, //          SKUδΈθ¦§γΉγ©γ€γγΌγγΏγ³
    // { columnName: 'combinationSkuButton', align: 'right' }, //       εγγθ²·γ
    { columnName: 'desiredPrice', align: 'right' }, //                  δΊε?ε£²δΎ‘
    { columnName: 'localGrossProfit', align: 'right' }, //              ζ³ε?η²ε©
    { columnName: 'quadrantClassification', align: 'center' },
    { columnName: 'retailPrice', align: 'right' }, //                   ε?δΎ‘
    { columnName: 'wholesalePrice', align: 'right' }, //                εΈδΎ‘ζ Ό
    { columnName: 'costPrice', align: 'right' }, //                     εεεδΎ‘
    { columnName: 'salesAmount', align: 'right', width: 90 }, //        ε£²δΈιι‘
    { columnName: 'grossProfitAmount', align: 'right' }, //             η²ε©ιι‘
    { columnName: 'salesQuantity', align: 'right' }, //                 θ²©ε£²ζ°
    { columnName: 'stockQuantity', align: 'right' }, //                 ε¨εΊ«ζ°
    { columnName: 'stockAmount', align: 'right', width: 150 }, //                   ε¨εΊ«ιι‘
    { columnName: 'stockAmountRetailPrice', align: 'right', width: 150 }, //        ε¨εΊ«ιι‘(ε?δΎ‘)
    { columnName: 'salesContributionScore', align: 'right' }, //        ε£²δΈθ²’η?εΊ¦
    { columnName: 'grossProfitContributionScore', align: 'right' }, //  η²ε©θ²’η?εΊ¦
    { columnName: 'averageCustomerUnitPrice', align: 'right' }, //      ε?’εδΎ‘εΉ³ε
    { columnName: 'averageGrossProfitUnitPrice', align: 'right' }, //   η²ε©εδΎ‘εΉ³ε
    { columnName: 'productCodeUnitPrice', align: 'right' }, //          εεεδΎ‘
    { columnName: 'productCodeGrossProfitUnitPrice', align: 'right' }, //       εεη²ε©εδΎ‘
    { columnName: 'predictedSoldoutDtMin', align: 'right', width: 160 }, //         ε?ε£²δΊζΈ¬ζ₯(ζε°)
    { columnName: 'predictedSoldoutDtMax', align: 'right', width: 160 }, //         ε?ε£²δΊζΈ¬ζ₯(ζε€§)
    { columnName: 'predictedSoldoutDaysMin', align: 'right', width: 160 }, //       ε?ε£²δΊζΈ¬ζ₯ζ°(ζε°)
    { columnName: 'predictedSoldoutDaysMax', align: 'right', width: 160 }, //       ε?ε£²δΊζΈ¬ζ₯ζ°(ζε€§)
    { columnName: 'predictedSoldoutWeeksMin', align: 'right', width: 170 }, //      ε?ε£²δΊζΈ¬ι±ζ°(ζε°)
    { columnName: 'predictedSoldoutWeeksMax', align: 'right', width: 170 }, //      ε?ε£²δΊζΈ¬ι±ζ°(ζε€§)
    { columnName: 'bestSkuRatio', align: 'right' }, //                  SKUη
    { columnName: 'betterSkuRatio', align: 'right' },
    { columnName: 'goodSkuRatio', align: 'right' },
    { columnName: 'badSkuRatio', align: 'right' },
    { columnName: 'bestSkuKinds', align: 'right' }, //                  SKUζ°
    { columnName: 'betterSkuKinds', align: 'right' },
    { columnName: 'goodSkuKinds', align: 'right' },
    { columnName: 'badSkuKinds', align: 'right' },
    { columnName: 'outOfAnalysisSkuKinds', align: 'right', width: 150 },
    { columnName: 'totalSkuKinds', align: 'right' },
    { columnName: 'outOfStockSkuRatio', align: 'right' }
  ])
  // γ―γͺγͺγγ£εζζγ―θ‘¨η€Ί(η·¨ιγ’γΌγγ§γ―ιθ‘¨η€Ί)
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

  // devexpressγ³γ³γγΌγγ³γoverlay
  const [chooser, handleOpenChooser, handleCloseChooser] = useColumnChooser()
  const overlayChooser = connectProps(ColumnChooserOverlay, () => {
    return {
      chooser,
      onClose: handleCloseChooser
    }
  })

  // propsγ«ε₯γγ­γγγ£θΏ½ε 
  const cellComponent = connectProps(tableCellComponent, () => {
    return { skuListButtonCellProps }
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
