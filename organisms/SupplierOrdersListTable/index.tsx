import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
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
import IdPagination from '@hooks/useIdPagination'
import { Props as PaginationProps } from '@hooks/usePagination/enhance'
import { Props as IdPaginationProps } from '@hooks/useIdPagination/enhance'
import { Edge as SkusEdge } from '@typeDefs/stockSkus'
import { Edge as ParentSkuEdge } from '@typeDefs/stockParentSkus'
import { Edge as ProductCodeEdge } from '@typeDefs/stockProductCodes'
import Button from '@components/atoms/Button'
import Const from '@constants/index'
import Icon from '@components/atoms/Icons'
import TableHeader from '@components/molecules/TableHeader'
import CustomChooseColumn, { ColumnChooserOverlay } from './useColumnChooser'
import { useColumnChooser } from './useColumnChooser/enhance'
// γγΌγγ«
const TableRoot = (props) => (
  <TGrid.Root {...props} style={{ height: 'calc(100vh - 16rem)' }} />
)
interface Props {
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
  switchProps?: {
    checked: boolean
    onChange: () => void
  }
  handleOpenSideBar?: () => void
  useFilter?: boolean
}
const columns: Column[] = [
  { name: 'deleteButton', title: '  ' },
  { name: 'image', title: '  ' },
  { name: 'skuCustomerId', title: 'SKU' },
  { name: 'parentSkuCustomerId', title: 'θ¦ͺSKU' },
  { name: 'productCodeCustomerId', title: 'εηͺ' },
  { name: 'orderQuantity', title: 'ηΊζ³¨ζ°' },
  { name: 'orderAmount', title: 'ηΊζ³¨ιι‘' },
  { name: 'indexType', title: 'ηΊζ³¨ζζ¨' },
  { name: 'recommendedOrderQuantity', title: 'ζ¨ε₯¨ηΊζ³¨ζ°' },
  { name: 'recommendedOrderAmount', title: 'ζ¨ε₯¨ηΊζ³¨ιι‘' },
  { name: 'predictedSalesQuantity', title: 'θ²©ε£²δΊζΈ¬ζ°' },
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
  { name: 'backlogStockQuantity', title: 'ηΊζ³¨ζ?' },
  { name: 'stockQuantityAll', title: 'ε¨η€Ύε¨εΊ«ζ°' },
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
const TableComponent = ({
  filterComponent,
  tableHeaderRowComponent,
  tableCellComponent,
  edges,
  pagination,
  idPagination,
  sortingState,
  switchProps,
  handleOpenSideBar,
  useFilter
}: Props): JSX.Element => {
  const classes = useStyles()
  const tableClasses = tableStyle()

  // θ¦ͺSKU,εηͺθ‘¨η€Ίγ?γ¨γ(skusβ true)γ―θ¦ͺSKU,εηͺγ«γ©γ γθ‘¨η€Ίγγͺγ
  let excludeColumnName = []
  let fixedColumn = ['deleteButton', 'image', 'skuCustomerId']
  const excludeColumn = (colums: Column[]) => {
    return colums.filter((v) => !excludeColumnName.includes(v.name))
  }

  const [tableColumnExtensions] = useState<NormalTable.ColumnExtension[]>([
    { columnName: 'deleteButton', align: 'left', width: 46 },
    { columnName: 'image', align: 'center', width: 46 },
    { columnName: 'skuCustomerId', align: 'left', width: 280 }, //      sku
    { columnName: 'parentSkuCustomerId', align: 'left' }, //            θ¦ͺSKU
    { columnName: 'productCodeCustomerId', align: 'left' }, //          εηͺ
    { columnName: 'orderQuantity', align: 'right' }, //                  ηΊζ³¨ζ°
    { columnName: 'orderAmount', align: 'right' }, //                  ηΊζ³¨ιι‘
    { columnName: 'recommendedOrderQuantity', align: 'right' }, //        ζ¨ε₯¨ηΊζ³¨ζ°
    { columnName: 'recommendedOrderAmount', align: 'right' }, //        ζ¨ε₯¨ηΊζ³¨ιι‘
    { columnName: 'predictedSalesQuantity', align: 'right' },
    {
      columnName: 'predictedSoldoutDtAfterArrival',
      align: 'right',
      wordWrapEnabled: true
    },
    { columnName: 'leadTimeDay', align: 'right' },
    { columnName: 'desiredStockDay', align: 'right', wordWrapEnabled: true },
    { columnName: 'salesAmount', align: 'right' },
    { columnName: 'grossProfitAmount', align: 'right' },
    { columnName: 'salesQuantity', align: 'right' },
    { columnName: 'stockQuantityCentral', align: 'right' },
    { columnName: 'stockAmountCentral', align: 'right', wordWrapEnabled: true },
    {
      columnName: 'stockAmountCentralRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    },
    { columnName: 'backlogStockQuantity', align: 'right' },
    { columnName: 'stockQuantityAll', align: 'right' },
    { columnName: 'stockAmountAll', align: 'right', wordWrapEnabled: true },
    {
      columnName: 'stockAmountAllRetailPrice',
      align: 'right',
      wordWrapEnabled: true
    },
    { columnName: 'salesContributionScore', align: 'right' },
    { columnName: 'grossProfitContributionScore', align: 'right' },
    { columnName: 'stockRiskScore', align: 'right' },
    { columnName: 'predictedSoldoutDt', align: 'right' },
    { columnName: 'predictedSoldoutDays', align: 'right' },
    { columnName: 'predictedSoldoutWeeks', align: 'right' },
    { columnName: 'retailPrice', align: 'right' },
    { columnName: 'wholesalePrice', align: 'right' },
    { columnName: 'costPrice', align: 'right' } //                      εεεδΎ‘
  ])
  const [sortColumnExtensions] = useState<SortingState.ColumnExtension[]>([
    { columnName: 'deleteButton', sortingEnabled: false },
    { columnName: 'image', sortingEnabled: false },
    { columnName: 'skuCustomerId', sortingEnabled: true },
    { columnName: 'parentSkuCustomerId', sortingEnabled: true },
    { columnName: 'productCodeCustomerId', sortingEnabled: true },
    { columnName: 'orderQuantity', sortingEnabled: false },
    { columnName: 'orderAmount', sortingEnabled: false },
    { columnName: 'recommendedOrderQuantity', sortingEnabled: true },
    { columnName: 'recommendedOrderAmount', sortingEnabled: true }
  ])

  const [defaultHiddenColumnNames] = useState([
    'indexType',
    'predictedSalesQuantity',
    'predictedSoldoutDtAfterArrival',
    'leadTimeDay',
    'desiredStockDay',
    'salesAmount',
    'grossProfitAmount',
    'salesQuantity',
    'stockQuantityCentral',
    'stockAmountCentral',
    'stockAmountCentralRetailPrice',
    'backlogStockQuantity',
    'stockQuantityAll',
    'stockAmountAll',
    'stockAmountAllRetailPrice',
    'salesContributionScore',
    'grossProfitContributionScore',
    'stockRiskScore',
    'predictedSoldoutDt',
    'predictedSoldoutDays',
    'predictedSoldoutWeeks',
    'retailPrice',
    'wholesalePrice'
  ])
  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'deleteButton', togglingEnabled: false },
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
              defaultHiddenColumnNames={defaultHiddenColumnNames}
              columnExtensions={tableColumnVisibilityColumnExtensions}
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
