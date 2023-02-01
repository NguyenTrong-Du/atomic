import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Paper } from '@material-ui/core'
import Utils from '@utils'
import CheckBox from '@components/atoms/CheckBox'
import CommomCss from '@styles/commonCss'

const SquareContent = (props) => {
  const {
    squareData,
    checkBoxProps,
    priorityIndicatorTypeProps,
    resourceType,
    priorityIndex
  } = props

  // カラー
  const classLabel = squareData?.classLabel
  let styleProps: any = {}
  styleProps.color = squareData?.color
  const classes = useStyles(styleProps)

  // 各指標の集計値
  const totalStockCostPrice = squareData?.total.totalStockCostPrice || 0
  const totalStockKinds = squareData?.total.totalStockKinds || 0
  const totalStockQuantity = squareData?.total.totalStockQuantity || 0
  const totalStockRetailPrice = squareData?.total.totalStockRetailPrice || 0
  // 各指標の比率
  const stockCostPriceShareRate =
    squareData?.shareRate.stockCostPriceShareRate || 0
  const stockKindsShareRate = squareData?.shareRate.stockKindsShareRate || 0
  const stockQuantityShareRate =
    squareData?.shareRate.stockQuantityShareRate || 0
  const stockRetailPriceShareRate =
    squareData?.shareRate.stockRetailPriceShareRate || 0

  // 優先表示項目
  let priorityBox = {
    title: '',
    percent: '',
    value: '',
    unit: ''
  }

  const priorityIndicatorType = priorityIndex[priorityIndicatorTypeProps?.value]
  switch (priorityIndicatorType) {
    case priorityIndex.COST_PRICE:
      priorityBox.title = priorityIndicatorType
      priorityBox.percent = stockCostPriceShareRate
      priorityBox.value = `${
        Utils.separateMomentaryWithUnit(totalStockCostPrice).value
      }`
      priorityBox.unit = `${
        Utils.separateMomentaryWithUnit(totalStockCostPrice).unit
      }`
      break
    case priorityIndex.RETAIL_PRICE:
      priorityBox.title = priorityIndicatorType
      priorityBox.percent = stockRetailPriceShareRate
      priorityBox.value = `${
        Utils.separateMomentaryWithUnit(totalStockRetailPrice).value
      }`
      priorityBox.unit = `${
        Utils.separateMomentaryWithUnit(totalStockRetailPrice).unit
      }`
      break
    case priorityIndex.KINDS:
      priorityBox.title = priorityIndicatorType
      priorityBox.percent = stockKindsShareRate
      priorityBox.value = `${Utils.separate(totalStockKinds)}`
      priorityBox.unit = resourceType
      break
    case priorityIndex.STOCK_QUANTITY:
      priorityBox.title = priorityIndicatorType
      priorityBox.percent = stockQuantityShareRate
      priorityBox.value = `${Utils.separate(totalStockQuantity)}`
      priorityBox.unit = ''
      break
    default:
  }

  return (
    <>
      <Box {...CommomCss.jcBetweenItemsCenter}>
        <Typography
          variant="h3"
          color="primary"
          classes={{ root: classes.classLabel }}
        >
          {classLabel}
        </Typography>
        <CheckBox
          {...checkBoxProps}
          name={classLabel.toLowerCase()}
          style={{ marginRight: 0, color: squareData?.color }}
        />
      </Box>

      <Box>
        <Box {...CommomCss.jcBetweenItemsCenter} className="flex-no-wrap">
          <Paper classes={{ root: classes.paperRoot }} elevation={0}>
            <Box {...CommomCss.jcBetweenItemsCenterDirCol}>
              <Typography
                variant="body2"
                classes={{ root: classes.title }}
                className="self-start"
              >
                {priorityBox.title}
              </Typography>
              <Box className="self-end">
                <Typography
                  variant="h1"
                  display="inline"
                  classes={{ root: classes.costRate }}
                  className="self-end"
                >
                  {priorityBox.percent}
                </Typography>
                <Typography
                  variant="h1"
                  display="inline"
                  classes={{ root: classes.costRate }}
                  style={{ fontSize: 32 }}
                  className="self-end"
                >
                  %
                </Typography>
              </Box>
              <Box className="self-end">
                <Typography variant="h6" display="inline">
                  {priorityBox.value}
                </Typography>
                <Typography
                  className={classes.unit}
                  variant="body2"
                  display="inline"
                >
                  {priorityBox.unit}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* rights */}
          <Box
            {...CommomCss.cardBoxProperties}
            className={classes.cardBoxRight}
          >
            <Box
              className={classes.indicatorBox}
              hidden={priorityIndicatorType === priorityIndex.COST_PRICE}
            >
              <Typography variant="body2" classes={{ root: classes.typoRoot }}>
                {priorityIndex.COST_PRICE}
              </Typography>
              <Box {...CommomCss.jcBetweenItemsCenter}>
                <Typography
                  variant="h6"
                  classes={{ root: classes.rate }}
                  className="text-left font-400"
                >
                  {stockCostPriceShareRate}%
                </Typography>
                <Typography
                  variant="h6"
                  display="inline"
                  className="self-end ml-8"
                >
                  {Utils.separateMomentaryWithUnit(totalStockCostPrice).value}
                </Typography>
                <Typography
                  className={classes.unit}
                  variant="body2"
                  display="inline"
                >
                  {Utils.separateMomentaryWithUnit(totalStockCostPrice).unit}
                </Typography>
              </Box>
            </Box>

            <Box
              className={classes.indicatorBox}
              hidden={priorityIndicatorType === priorityIndex.RETAIL_PRICE}
            >
              <Typography variant="body2" classes={{ root: classes.typoRoot }}>
                {priorityIndex.RETAIL_PRICE}
              </Typography>
              <Box {...CommomCss.jcBetweenItemsCenter}>
                <Typography
                  variant="h6"
                  classes={{ root: classes.rate }}
                  className="text-left font-400"
                >
                  {stockRetailPriceShareRate}%
                </Typography>
                <Typography
                  variant="h6"
                  display="inline"
                  className="self-end ml-8"
                >
                  {Utils.separateMomentaryWithUnit(totalStockRetailPrice).value}
                </Typography>
                <Typography
                  className={classes.unit}
                  variant="body2"
                  display="inline"
                >
                  {Utils.separateMomentaryWithUnit(totalStockRetailPrice).unit}
                </Typography>
              </Box>
            </Box>

            <Box
              className={classes.indicatorBox}
              hidden={priorityIndicatorType === priorityIndex.KINDS}
            >
              <Typography variant="body2" classes={{ root: classes.typoRoot }}>
                {priorityIndex.KINDS}
              </Typography>
              <Box {...CommomCss.jcBetweenItemsCenter}>
                <Typography
                  variant="h6"
                  classes={{ root: classes.rate }}
                  className="text-left font-400"
                >
                  {stockKindsShareRate}%
                </Typography>
                <Box>
                  <Typography
                    variant="h6"
                    display="inline"
                    className="self-end ml-8"
                  >
                    {Utils.separate(Math.round(totalStockKinds))}
                  </Typography>
                  <Typography
                    className={classes.unit}
                    variant="body2"
                    display="inline"
                  >
                    {resourceType}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              className={classes.indicatorBox}
              hidden={priorityIndicatorType === priorityIndex.STOCK_QUANTITY}
            >
              <Typography variant="body2" classes={{ root: classes.typoRoot }}>
                {priorityIndex.STOCK_QUANTITY}
              </Typography>
              <Box {...CommomCss.jcBetweenItemsCenter}>
                <Typography
                  variant="h6"
                  classes={{ root: classes.rate }}
                  className="text-left font-400"
                >
                  {stockQuantityShareRate}%
                </Typography>
                <Box>
                  <Typography
                    variant="h6"
                    display="inline"
                    className="self-end ml-8"
                  >
                    {Utils.separate(totalStockQuantity)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
export default SquareContent

const useStyles = makeStyles(() =>
  createStyles({
    rootGrid: {
      flexWrap: 'nowrap'
    },
    classLabel: {
      fontSize: '250%',
      marginTop: '.4rem',
      color: '#1E283C'
    },
    squareGridItem: {
      textAlign: 'right'
    },
    unit: {
      color: '#787E8A',
      marginLeft: '.5rem',
      whiteSpace: 'nowrap'
    },
    typoRoot: {
      color: '#787E8A'
    },
    paperRoot: {
      minWidth: '12rem',
      padding: '.7rem',
      marginRight: '1rem',
      borderRadius: 8,
      border: '1px solid #E8E9EB',
      marginTop: 8
    },
    title: {
      color: '#787E8A',
      marginBottom: 16
    },
    costRate: (styleProps: any) => {
      return {
        color: styleProps.color,
        fontSize: 64,
        lineHeight: '56px',
        letterSpacing: '1px',
        fontWeight: 300,
        textAlign: 'right',
        marginTop: '.1rem',
        marginBottom: '.5rem'
      }
    },
    rate: (styleProps: any) => {
      return {
        color: styleProps.color,
        marginRight: 'auto'
      }
    },
    indicatorBox: {
      width: '100%',
      marginTop: 8
    },
    checkbox: {
      marginRight: 0
    },
    cardBoxRight: {
      minWidth: '13.5em',
      maxWidth: '17em',
      flexGrow: 1
    }
  })
)
