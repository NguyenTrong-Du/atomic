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
import { Edge as ProductEdge } from '@typeDefs/salesProductCodes'
import { useRouter } from 'next/router'
import TableHeader from '@components/molecules/TableHeader'
import Icon from '@components/atoms/Icons'
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
  filterComponent?: JSX.Element
  tableCellComponent
  cacheKey: string
  edges: ProductEdge[]
  switchProps?: {
    checked: boolean
    onChange: () => void
  }
  pagination?: PaginationProps
  idPagination?: IdPaginationProps
  selectionState: SelectionStateProps
  sortingState: SortingStateProps
  loading?: boolean
  skuListButtonCellProps
  handleOpenSideBar?: () => void
  useFilter?: boolean
  filterButtonGroupProps?: FilterButtonGroupPropsInterface
}
const TableComponent = ({
  analysisType,
  tableCellComponent,
  edges,
  switchProps,
  pagination,
  idPagination,
  selectionState,
  sortingState,
  loading,
  skuListButtonCellProps,
  handleOpenSideBar,
  useFilter,
  filterButtonGroupProps
}: Props): JSX.Element => {
  const classes = useStyles()
  const tableClasses = tableStyle()

  // εΊζ¬γ?γ«γ©γ θ¨­ε?
  let columns: Column[] = [
    { name: 'image', title: '  ' },
    { name: 'productCodeCustomerId', title: 'εηͺ' },
    { name: 'skuListButton', title: ' ' },
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
  // γ―γͺγͺγγ£εζζγ―θ‘¨η€Ί(η·¨ιγ’γΌγγ§γ―ιθ‘¨η€Ί)
  const { query } = useRouter()
  columns = Utils.addQuadrantClassificationColumn(
    query,
    columns,
    analysisType,
    3
  ).columns

  // alignγ?θͺΏζ΄
  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'image', align: 'center', width: 46 },
    { columnName: 'productCodeCustomerId', align: 'left', width: 280 }, //          εηͺ
    { columnName: 'skuListButton', align: 'right', width: 40 }, //          SKUδΈθ¦§γΉγ©γ€γγΌγγΏγ³
    // { columnName: 'combinationSkuButton', align: 'right' }, //       εγγθ²·γ
    { columnName: 'salesAmount', align: 'right', width: 90 }, //                   ε£²δΈιι‘
    { columnName: 'grossProfitAmount', align: 'right' }, //             η²ε©ιι‘
    { columnName: 'salesQuantity', align: 'right' }, //                 θ²©ε£²ζ°
    { columnName: 'stockQuantity', align: 'right' }, //                 ε¨εΊ«ζ°
    {
      columnName: 'stockAmount',
      align: 'right',
      wordWrapEnabled: true,
      width: 200
    }, //                   ε¨εΊ«ιι‘
    {
      columnName: 'stockAmountRetailPrice',
      align: 'right',
      wordWrapEnabled: true,
      width: 130
    }, // ε¨εΊ«ιι‘(ε?δΎ‘)
    {
      columnName: 'averageCustomerUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // ε?’εδΎ‘εΉ³ε
    {
      columnName: 'averageGrossProfitUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // η²ε©εδΎ‘εΉ³ε
    { columnName: 'productCodeUnitPrice', align: 'right' }, //                  εεεδΎ‘
    {
      columnName: 'productCodeGrossProfitUnitPrice',
      align: 'right',
      wordWrapEnabled: true
    }, // εεη²ε©εδΎ‘
    { columnName: 'salesContributionScore', align: 'right' }, //        ε£²δΈθ²’η?εΊ¦
    { columnName: 'grossProfitContributionScore', align: 'right' }, //  η²ε©θ²’η?εΊ¦
    {
      columnName: 'predictedSoldoutDtMin',
      align: 'right',
      width: 160
    }, // ε?ε£²δΊζΈ¬ζ₯(ζε°)
    {
      columnName: 'predictedSoldoutDtMax',
      align: 'right',
      width: 160
    }, // ε?ε£²δΊζΈ¬ζ₯(ζε€§)
    {
      columnName: 'predictedSoldoutDaysMin',
      align: 'right',
      width: 160
    }, // ε?ε£²δΊζΈ¬ζ₯ζ°(ζε°)
    {
      columnName: 'predictedSoldoutDaysMax',
      align: 'right',
      width: 160
    }, // ε?ε£²δΊζΈ¬ζ₯ζ°(ζε€§)
    {
      columnName: 'predictedSoldoutWeeksMin',
      align: 'right',
      width: 170
    }, // ε?ε£²δΊζΈ¬ι±ζ°(ζε°)
    {
      columnName: 'predictedSoldoutWeeksMax',
      align: 'right',
      width: 170
    }, // ε?ε£²δΊζΈ¬ι±ζ°(ζε€§)

    // ε?ε£²δΊζΈ¬ι±ζ°(ζε€§)
    { columnName: 'bestSkuRatio', align: 'right' }, // SKUη
    { columnName: 'betterSkuRatio', align: 'right' },
    { columnName: 'goodSkuRatio', align: 'right' },
    { columnName: 'badSkuRatio', align: 'right' },
    { columnName: 'bestSkuKinds', align: 'right' }, // SKUζ°
    { columnName: 'betterSkuKinds', align: 'right' },
    { columnName: 'goodSkuKinds', align: 'right' },
    { columnName: 'badSkuKinds', align: 'right' },
    { columnName: 'outOfAnalysisSkuKinds', align: 'right', width: 150 },
    { columnName: 'totalSkuKinds', align: 'right' },
    { columnName: 'outOfStockSkuRatio', align: 'right' },

    { columnName: 'retailPrice', align: 'right' }, //                   ε?δΎ‘
    { columnName: 'wholesalePrice', align: 'right' }, //                εΈδΎ‘ζ Ό
    { columnName: 'costPrice', align: 'right' }, //                     εεεδΎ‘
    {
      columnName: 'quadrantClassification',
      align: 'right',
      width: 120
    } // γ―γͺγͺγγ£
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'productCodeCustomerId', sortingEnabled: true },
    { columnName: 'skuListButton', sortingEnabled: false },
    { columnName: 'salesAmount', sortingEnabled: true },
    { columnName: 'grossProfitAmount', sortingEnabled: true },
    { columnName: 'salesQuantity', sortingEnabled: true },
    { columnName: 'stockQuantity', sortingEnabled: true },
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
    { columnName: 'badSkuKinds', sortingEnabled: true },
    { columnName: 'outOfAnalysisSkuKinds', sortingEnabled: true },
    { columnName: 'outOfStockSkuRatio', sortingEnabled: true },
    { columnName: 'retailPrice', sortingEnabled: true },
    { columnName: 'wholesalePrice', sortingEnabled: true },
    { columnName: 'costPrice', sortingEnabled: true },
    { columnName: 'quadrantClassification', sortingEnabled: false }
  ])

  // γγγ©γ«γγ§ιθ‘¨η€Ίγ«γγγγ«γ©γ γζε?
  const [defaultHiddenColumnNames, setDefaultHiddenColumnNames] = useState([
    'indexType',
    'stockAmount',
    'stockAmountRetailPrice',
    'productCodeUnitPrice',
    'averageCustomerUnitPrice',
    'averageGrossProfitUnitPrice',
    'productCodeGrossProfitUnitPrice',
    'salesContributionScore',
    'grossProfitContributionScore',
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
    { columnName: 'image', togglingEnabled: false },
    { columnName: 'productCodeCustomerId', togglingEnabled: false },
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

  // TODO γγ§γγ―γγγ―γΉγ«γ©γΌε€ζ΄
  const TableSelectionCell = (props) => {
    return <Table.Cell {...props} className="skus-table" />
  }

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
          switchProps={switchProps}
          className={clsx(['pt-6', 'pb-6', !useFilter && 'pl-12'])}
          classes={classes}
        >
          <></>
        </TableHeader>
      </div>

      {!edges || loading ? (
        <Loading />
      ) : (
        <>
          <TGrid rows={edges} columns={columns} rootComponent={TableRoot}>
            <SortingState
              {...sortingState}
              columnExtensions={sortColumnExtensions}
            />
            <SelectionState {...selectionState} />
            <Table
              columnExtensions={tableColumnExtensions}
              cellComponent={cellComponent}
            />
            <TableHeaderRow showSortingControls />
            <TableColumnVisibility
              hiddenColumnNames={defaultHiddenColumnNames}
              columnExtensions={tableColumnVisibilityColumnExtensions}
            />
            <IntegratedSelection />
            <TableSelection
              showSelectAll
              // cellComponent={TableSelectionCell}
            />
            <TableFixedColumns
              leftColumns={[
                TableSelection.COLUMN_TYPE,
                'image',
                'productCodeCustomerId',
                'skuListButton'
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
  }
}))
