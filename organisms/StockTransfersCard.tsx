import React from 'react'
import { authPage } from '@middleware/auth'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import {
  Card,
  Grid,
  Typography,
  CardContent,
  CardActionArea,
  Box
} from '@material-ui/core'
import axios from '@lib/axios'
import { useAppDispatch } from '@store'
import { useRouter } from 'next/router'
import conditionsStockSlice from '@store/stockTransfers/[id]/conditions'
import stockDraftSlice from '@store/stockTransfers/draftData'
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIos'
import { useLoading } from '@context/loading'
import { useSnackbar } from '@context/snackbar'
import CommonCss from '@styles/commonCss'
import Icon from '@components/atoms/Icons'
import Button from '@components/atoms/Button'
import { useAccountSettingsSelector } from '@store/accountSettings'
import Const from '@constants'

const StockTransfersCard: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { onLoading, disposeLoading } = useLoading()
  const { onError } = useSnackbar()
  const { contractEnabled } = useAccountSettingsSelector()

  const handleRiskAnalysis = async () => {
    onLoading()
    try {
      const data = await createStockDraft({
        transferTo: 'SELLER',
        analysisType: 'STOCK_RISK_ANALYSIS'
      })

      // ドラフト&検索条件のStoreリセット
      dispatch(conditionsStockSlice.actions.reset())
      dispatch(stockDraftSlice.actions.reset())
      router.push(`/stockTransfers/${data.id}/riskAnalysis`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  const handleStockDistributeAnalysisSend = async () => {
    onLoading()
    try {
      const data = await createStockDraft({
        transferTo: 'SELLER',
        analysisType:
          Const.STOCK_TRANSFERS_ANALYSIS_TYPES.STOCK_DISTRIBUTE_ANALYSIS_SEND
      })

      dispatch(conditionsStockSlice.actions.reset())
      dispatch(stockDraftSlice.actions.reset())
      router.push(`/stockTransfers/${data.id}/distributeAnalysis/send`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  // Todo: distributeAnalysis collect feature
  // const handleStockDistributeAnalysisCollect = async () => {
  //   onLoading()
  //   try {
  //     const data = await createStockDraft({
  //       transferTo: 'SELLER',
  //       analysisType:
  //         Const.STOCK_TRANSFERS_ANALYSIS_TYPES.STOCK_DISTRIBUTE_ANALYSIS_COLLECT
  //     })

  //     dispatch(conditionsStockSlice.actions.reset())
  //     dispatch(stockDraftSlice.actions.reset())
  //     router.push(`/stockTransfers/${data.id}/distributeAnalysis/collect`)
  //   } catch (error) {
  //     onError(error.response.data.message)
  //     disposeLoading()
  //   }
  // }

  return (
    <>
      <Card elevation={2} classes={{ root: classes.root }}>
        <Box {...CommonCss.cardBoxProperties}>
          {/* 上部 */}
          <Box {...CommonCss.topBoxProperties}>
            <Box {...CommonCss.betweenCenter}>
              <Icon>warehouse</Icon>
              <Typography variant="h4" className="ml-12">
                在庫移動
              </Typography>
            </Box>
            <Box {...CommonCss.betweenCenter}>
              <Button
                onClick={() => router.push('/stockTransfers')}
                classes={{ root: classes.btnRoot }}
              >
                <Typography variant="h6">リスト一覧</Typography>
                <ArrowForwardIosRoundedIcon className="ml-12" />
              </Button>
            </Box>
          </Box>
          {/* 下部 */}
          <Grid container item justify="space-between" wrap="nowrap">
            {/* 左側 */}
            <Grid container item md={6} direction="column" className="mr-8">
              <Grid item>
                <Card classes={{ root: classes.cardRoot }}>
                  <CardContent classes={{ root: classes.cardContentRoot }}>
                    <Card elevation={0} classes={{ root: classes.quadrant }}>
                      <Icon>quality_analysis</Icon>
                    </Card>
                  </CardContent>
                  <CardActionArea
                    classes={{ root: classes.cardActionAreaRoot }}
                    onClick={handleRiskAnalysis}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h5">中央倉庫分析</Typography>
                      <ArrowForwardIosRoundedIcon />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
            {/* 右側 */}
            {contractEnabled?.stockDistributeAnalysis && (
              <Grid container item md={6} direction="column" className="mr-8">
                <Grid item>
                  <Card classes={{ root: classes.cardRoot }}>
                    <CardContent classes={{ root: classes.cardContentRoot }}>
                      <Card elevation={0} classes={{ root: classes.quadrant }}>
                        <Icon>quality_analysis</Icon>
                      </Card>
                    </CardContent>
                    <CardActionArea
                      classes={{ root: classes.cardActionAreaRoot }}
                      onClick={handleStockDistributeAnalysisSend}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="h5">
                          ディストリビュート分析
                        </Typography>
                        <ArrowForwardIosRoundedIcon />
                      </Box>
                      {/* Todo: distributeAnalysis collect feature */}
                      {/* <Box
                        mb={1}
                        onClick={handleStockDistributeAnalysisSend}
                        className={classes.distributeBtn}
                      >
                        <Typography>補充</Typography>
                        <ArrowForwardIosRoundedIcon />
                      </Box>
                      <Box
                        onClick={handleStockDistributeAnalysisCollect}
                        className={classes.distributeBtn}
                      >
                        <Typography>回収</Typography>
                        <ArrowForwardIosRoundedIcon />
                      </Box> */}
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </Card>
    </>
  )
}
export default StockTransfersCard

export const getServerSideProps = authPage(async () => {
  return {
    props: {}
  }
})

async function createStockDraft(params) {
  const { data } = await axios.post(`/api/stock-transfers/create`, params)
  return data
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '2rem',
      marginLeft: '1rem',
      marginRight: '1.5rem',
      padding: theme.spacing(3),
      borderRadius: '.6rem',
      minHeight: '32rem'
    },
    cardRoot: {
      marginRight: 0,
      width: '100%',
      borderRadius: '.6rem'
    },
    cardContentRoot: {
      backgroundColor: '#EBF0FA'
    },
    cardActionAreaRoot: {
      color: 'white',
      backgroundColor: '#1E3C8C',
      padding: '1.5rem'
    },
    disabledCardActionAreaRoot: {
      color: 'white',
      backgroundColor: '#D2D4D8',
      padding: '1.5rem'
    },
    quadrant: {
      height: '10rem'
    },
    btnRoot: {
      paddingRight: 0
    },
    distributeBtn: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#1E3C8C',
      cursor: 'pointer',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '7px 12px 9px 12px',
      '&:hover': {
        backgroundColor: '#d7d7d7'
      }
    }
  })
)
