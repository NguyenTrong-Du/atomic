import React from 'react'
import clsx from 'clsx'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import {
  Paper,
  Grid,
  Card,
  Typography,
  Box,
  Hidden,
  MenuItem
} from '@material-ui/core'
import Utils from '@utils'
import SquareContent from '@components/molecules/SquareContent'
import Loading from '@components/atoms/Loading'
import CheckBox from '@components/atoms/CheckBox'
import CommonCss from '@styles/commonCss'
import Select from '@components/atoms/Select'
import Const from '@constants'

const Quadrant = (props) => {
  const {
    best,
    better,
    good,
    bad,
    outOfAnalysis,
    indicatorXType,
    indicatorYType,
    useEnhance
  } = props
  const isLoading = !best || !better || !good || !bad || !outOfAnalysis
  const classes = useStyles()

  const {
    checkBoxBestProps,
    checkBoxBetterProps,
    checkBoxGoodProps,
    checkBoxBadProps,
    checkBoxOutProps,
    priorityIndicatorTypeProps,
    handleQuadrantChange,
    priorityIndex
  } = useEnhance()

  const isProductCode =
    priorityIndex.KINDS === Const.PRIORITY_INDEX_PRODUCT_CODE.KINDS
  const resourceType = isProductCode ? '品番' : 'SKU'

  const priorityIndicatorTypeItems = []
  const item = priorityIndex
  Object.keys(item).forEach((key) => {
    priorityIndicatorTypeItems.push(
      <MenuItem key={key} value={key}>
        {item[key]}
      </MenuItem>
    )
  })
  // 合計値
  const {
    sumOfTotalStockCostPrice,
    sumOfTotalStockRetailPrice,
    sumOfTotalStockKinds,
    sumOfTotalStockQuantity
  } = getTotalValues(best, better, good, bad, outOfAnalysis)

  return (
    <Card classes={{ root: classes.root }}>
      {/* 4象限 */}
      <Box className={classes.boxRoot} {...CommonCss.quadrantBox}>
        <Grid container className={classes.quadrantRoot}>
          <Grid item className={classes.quadrantContainer}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
                <Box mt={1.2} mb={0.8} className={classes.boxHeader}>
                  <Typography
                    variant="h5"
                    className={clsx(classes.indicatorLabel, classes.indicatorY)}
                  >
                    {Const.Y_SALES_INDICATOR_TYPE[indicatorYType]}
                  </Typography>
                </Box>
                <Box>
                  <Box>
                    <Grid container item justify="center">
                      {/* BEST */}
                      <Grid item xs>
                        <Box className={classes.paperBox}>
                          <Paper
                            classes={{
                              root: classes.paperRoot
                            }}
                            elevation={checkBoxBestProps?.checked ? 16 : 3}
                            onClick={(e) => handleQuadrantChange('best')}
                          >
                            {isLoading ? (
                              <Loading />
                            ) : (
                              <SquareContent
                                checkBoxProps={checkBoxBestProps}
                                squareData={best}
                                priorityIndicatorTypeProps={
                                  priorityIndicatorTypeProps
                                }
                                resourceType={resourceType}
                                priorityIndex={priorityIndex}
                              />
                            )}
                          </Paper>
                        </Box>
                      </Grid>
                      {/* <Divider orientation="vertical" flexItem /> */}
                      <Hidden mdDown>
                        {/* 縦線 */}
                        <div
                          className={clsx(
                            classes.y1,
                            'MuiDivider-root MuiDivider-flexItem MuiDivider-vertical arrow top'
                          )}
                        />
                      </Hidden>
                      {/* BETTER */}
                      <Grid item xs>
                        <Box className={classes.paperBox}>
                          <Paper
                            classes={{ root: classes.paperRoot }}
                            elevation={checkBoxBetterProps?.checked ? 16 : 3}
                            onClick={(e) => handleQuadrantChange('better')}
                          >
                            {isLoading ? (
                              <Loading />
                            ) : (
                              <SquareContent
                                checkBoxProps={checkBoxBetterProps}
                                squareData={better}
                                priorityIndicatorTypeProps={
                                  priorityIndicatorTypeProps
                                }
                                resourceType={resourceType}
                                priorityIndex={priorityIndex}
                              />
                            )}
                          </Paper>
                        </Box>
                      </Grid>
                    </Grid>
                    <Hidden mdDown>
                      {/* 横線 */}
                      <div
                        className={clsx(
                          classes.x,
                          'MuiDivider-root arrow right'
                        )}
                      />
                    </Hidden>
                    <Grid container item justify="center">
                      {/* GOOD */}
                      <Grid item classes={{ root: classes.good }} xs>
                        <Box className={classes.paperBox}>
                          <Paper
                            classes={{ root: classes.paperRoot }}
                            elevation={checkBoxGoodProps?.checked ? 16 : 3}
                            onClick={(e) => handleQuadrantChange('good')}
                          >
                            {isLoading ? (
                              <Loading />
                            ) : (
                              <SquareContent
                                checkBoxProps={checkBoxGoodProps}
                                squareData={good}
                                priorityIndicatorTypeProps={
                                  priorityIndicatorTypeProps
                                }
                                resourceType={resourceType}
                                priorityIndex={priorityIndex}
                              />
                            )}
                          </Paper>
                        </Box>
                      </Grid>
                      <Hidden mdDown>
                        {/* 縦線 */}
                        <div
                          className={clsx(
                            classes.y2,
                            'MuiDivider-root MuiDivider-flexItem MuiDivider-vertical'
                          )}
                        />
                      </Hidden>
                      {/* BAD */}
                      <Grid item classes={{ root: classes.bad }} xs>
                        <Box className={classes.paperBox}>
                          <Paper
                            classes={{ root: classes.paperRoot }}
                            elevation={checkBoxBadProps?.checked ? 16 : 3}
                            onClick={(e) => handleQuadrantChange('bad')}
                          >
                            {isLoading ? (
                              <Loading />
                            ) : (
                              <SquareContent
                                checkBoxProps={checkBoxBadProps}
                                squareData={bad}
                                priorityIndicatorTypeProps={
                                  priorityIndicatorTypeProps
                                }
                                resourceType={resourceType}
                                priorityIndex={priorityIndex}
                              />
                            )}
                          </Paper>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                <Grid container direction="column" justify="flex-start">
                  {/* 分析対象外 */}
                  <Grid item>
                    <Box
                      mt={1.3}
                      mb={0}
                      ml={1}
                      {...CommonCss.jcFlexStartItemsCenter}
                    >
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <Paper
                          classes={{ root: classes.outOfAnalysisPaperRoot }}
                          elevation={checkBoxOutProps?.checked ? 16 : 3}
                          onClick={(e) => handleQuadrantChange('outOfAnalysis')}
                        >
                          <CheckBox
                            {...checkBoxOutProps}
                            name="outOfAnalysis"
                            style={{ marginRight: 0 }}
                          />
                          <Typography
                            variant="h6"
                            className={classes.outOfAnalysisLabel}
                            classes={{ root: classes.outOfAnalysisLabelRoot }}
                          >
                            分析対象外
                          </Typography>
                          <Typography
                            variant="body2"
                            className={classes.outOfAnalysisLabel}
                            display="inline"
                          >
                            {`｜${priorityIndex.COST_PRICE}：
                          ${
                            Utils.separateMomentaryWithUnit(
                              outOfAnalysis.total.totalStockCostPrice
                            ).value
                          }
                          ${
                            Utils.separateMomentaryWithUnit(
                              outOfAnalysis.total.totalStockCostPrice
                            ).unit
                          }

                         | ${priorityIndex.RETAIL_PRICE}：
                          ${
                            Utils.separateMomentaryWithUnit(
                              outOfAnalysis.total.totalStockRetailPrice
                            ).value
                          }
                          ${
                            Utils.separateMomentaryWithUnit(
                              outOfAnalysis.total.totalStockRetailPrice
                            ).unit
                          }

                        | ${priorityIndex.KINDS}：${Utils.separate(
                              outOfAnalysis.total.totalStockKinds
                            )} | ${
                              priorityIndex.STOCK_QUANTITY
                            }：${Utils.separate(
                              outOfAnalysis.total.totalStockQuantity
                            )}`}
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  </Grid>

                  <Grid item>
                    <Box
                      mt={1.5}
                      mb={1.5}
                      ml={1.5}
                      {...CommonCss.jcStartItemsCenterWrap}
                    >
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <>
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            classes={{ root: classes.outOfAnalysisLabelRoot }}
                          >
                            合計
                          </Typography>
                          <Typography variant="body2" display="inline">
                            {`｜${priorityIndex.COST_PRICE}：
                          ${
                            Utils.separateMomentaryWithUnit(
                              sumOfTotalStockCostPrice
                            ).value
                          }
                          ${
                            Utils.separateMomentaryWithUnit(
                              sumOfTotalStockCostPrice
                            ).unit
                          }

                        | ${priorityIndex.RETAIL_PRICE}：
                          ${
                            Utils.separateMomentaryWithUnit(
                              sumOfTotalStockRetailPrice
                            ).value
                          }
                          ${
                            Utils.separateMomentaryWithUnit(
                              sumOfTotalStockRetailPrice
                            ).unit
                          }

                         | ${priorityIndex.KINDS}: ${Utils.separate(
                              sumOfTotalStockKinds
                            )}
                         | ${priorityIndex.STOCK_QUANTITY}：${Utils.separate(
                              sumOfTotalStockQuantity
                            )}`}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Hidden mdDown>
                  <Box ml="2rem" mt="auto" mb="auto">
                    <Grid item>
                      <Typography
                        variant="h5"
                        className={clsx(classes.indicatorLabelX)}
                      >
                        {Const.X_STOCK_INDICATOR_TYPE[indicatorXType]}
                      </Typography>
                    </Grid>
                  </Box>
                </Hidden>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <style jsx>{`
          .MuiDivider-root.arrow {
            position: relative;
          }
          .MuiDivider-root.arrow.right::after {
            content: '';
            position: absolute;
            right: -17px;
            top: -7px;
            border-top: 8px solid transparent;
            border-left: 18px solid rgba(0, 0, 0, 0.12);
            border-bottom: 8px solid transparent;
          }
          .MuiDivider-root.arrow.top::after {
            content: '';
            position: absolute;
            left: -7px;
            top: -18px;
            border-right: 8px solid transparent;
            border-bottom: 18px solid rgba(0, 0, 0, 0.12);
            border-left: 8px solid transparent;
          }
        `}</style>
      </Box>

      {/* 重点指標プルダウン */}
      <Box className={classes.menuType}>
        <Typography classes={{ root: classes.menuTitle }}>重点指標</Typography>
        <Select
          {...priorityIndicatorTypeProps}
          variant="outlined"
          className={classes.selectPosition}
        >
          {priorityIndicatorTypeItems}
        </Select>
      </Box>
    </Card>
  )
}
export default Quadrant

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'relative',
      justifyContent: 'space-between',
      height: '105vh',
      overflow: 'auto',
      backgroundColor: '#f9f9f9'
    },
    boxRoot: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%'
    },
    paperRoot: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'space-between',
      maxWidth: '35rem',
      minWidth: '28em',
      minHeight: '14.5em',
      paddingLeft: '.8rem',
      paddingRight: '.8rem',
      paddingBottom: '.8rem',
      cursor: 'pointer',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    outOfAnalysisPaperRoot: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '98.2%',
      paddingLeft: '.8rem',
      paddingRight: '.8rem',
      cursor: 'pointer'
    },
    boxHeader: {
      marginBottom: '1rem',
      marginTop: '1.5rem',
      textAlign: 'center'
    },
    paperBox: {
      margin: 8
    },
    menuTitle: {
      marginRight: '.5rem'
    },
    menuType: {
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      right: 0,
      zIndex: 5,
      marginTop: '2rem',
      marginRight: 24
    },
    selectPosition: {
      width: 230
    },
    indicatorLabel: {
      fontSize: 18,
      color: '#787E8A'
    },
    indicatorLabelX: {
      fontSize: 18,
      color: '#787E8A',
      marginBottom: '2rem'
    },
    indicatorY: {
      marginBottom: '.5rem'
    },
    outOfAnalysisLabel: {
      color: '#787E8A'
    },
    outOfAnalysisLabelRoot: {
      fontSize: '.9rem'
    },
    verticalRl: {
      writingMode: 'vertical-rl',
      marginBottom: '7rem'
    },
    x: {
      width: '100%'
    },
    y1: {
      top: '.5rem',
      marginRight: '8px',
      marginLeft: '8px'
    },
    y2: {
      position: 'relative',
      marginRight: '8px',
      marginLeft: '8px'
    },
    bad: {
      alignSelf: 'flex-end'
    },
    good: {
      alignSelf: 'flex-end'
    },
    quadrantRoot: {
      justifyContent: 'center'
    },
    quadrantContainer: {
      minWidth: '66%'
    },
    formControlLabelRoot: {
      marginLeft: '0rem',
      marginRight: '0rem'
    },
    formControlLabel: {
      color: '#787E8A',
      fontWeight: 'bold',
      fontSize: 14
    }
  })
)

const getTotalValues = (best, better, good, bad, outOfAnalysis) => {
  const sumOfTotalStockCostPrice =
    best.total.totalStockCostPrice +
    better.total.totalStockCostPrice +
    good.total.totalStockCostPrice +
    bad.total.totalStockCostPrice +
    outOfAnalysis.total.totalStockCostPrice

  const sumOfTotalStockRetailPrice =
    best.total.totalStockRetailPrice +
    better.total.totalStockRetailPrice +
    good.total.totalStockRetailPrice +
    bad.total.totalStockRetailPrice +
    outOfAnalysis.total.totalStockRetailPrice

  const sumOfTotalStockKinds =
    best.total.totalStockKinds +
    better.total.totalStockKinds +
    good.total.totalStockKinds +
    bad.total.totalStockKinds +
    outOfAnalysis.total.totalStockKinds

  const sumOfTotalStockQuantity =
    best.total.totalStockQuantity +
    better.total.totalStockQuantity +
    good.total.totalStockQuantity +
    bad.total.totalStockQuantity +
    outOfAnalysis.total.totalStockQuantity

  return {
    sumOfTotalStockCostPrice,
    sumOfTotalStockRetailPrice,
    sumOfTotalStockKinds,
    sumOfTotalStockQuantity
  }
}
