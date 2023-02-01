import React from 'react'
import { authPage } from '@middleware/auth'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import {
  Card,
  Grid,
  Typography,
  CardActionArea,
  CardContent,
  Box
} from '@material-ui/core'
import conditionsSalesSlice from '@store/salesPromotions/[id]/conditions'
import salesDraftSlice, {
  fetchCreateDraft
} from '@store/salesPromotions/draftData'
import { useRouter } from 'next/router'
import { useAppDispatch } from '@store'
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded'
import { useLoading } from '@context/loading'
import { useSnackbar } from '@context/snackbar'
import CommonCss from '@styles/commonCss'
import Icon from '@components/atoms/Icons'
import Button from '@components/atoms/Button'

const SalesPromotionsCard: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()
  const { onLoading, disposeLoading } = useLoading()
  const { onError } = useSnackbar()
  const dispatch = useAppDispatch()

  const handleSkuQualityAnalysis = async () => {
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await dispatch(conditionsSalesSlice.actions.reset())
      await dispatch(salesDraftSlice.actions.reset())
      const { payload } = await dispatch(
        fetchCreateDraft({
          analysisType: 'QUALITY_ANALYSIS',
          addonType: 'NONE'
        })
      )
      router.push(`/salesPromotions/${payload.id}/qualityAnalysis`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  const handleQualityAnalysisProductCode = async () => {
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await dispatch(conditionsSalesSlice.actions.reset())
      await dispatch(salesDraftSlice.actions.reset())
      const { payload } = await dispatch(
        fetchCreateDraft({
          analysisType: 'QUALITY_ANALYSIS_PRODUCT_CODE',
          addonType: 'NONE'
        })
      )
      router.push(`/salesPromotions/${payload.id}/qualityAnalysisProductCode`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  const handleUnitPriceAnalysis = async () => {
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await dispatch(conditionsSalesSlice.actions.reset())
      await dispatch(salesDraftSlice.actions.reset())
      const { payload } = await dispatch(
        fetchCreateDraft({
          analysisType: 'UNIT_ANALYSIS',
          addonType: 'NONE'
        })
      )
      router.push(`/salesPromotions/${payload.id}/unitPriceAnalysis`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  const handleNoAnalysis = async () => {
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await dispatch(conditionsSalesSlice.actions.reset())
      await dispatch(salesDraftSlice.actions.reset())
      const { payload } = await dispatch(
        fetchCreateDraft({
          analysisType: 'NO_ANALYSIS',
          addonType: 'NONE'
        })
      )
      router.push(`/salesPromotions/${payload.id}/skus`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  return (
    <>
      <Card elevation={2} classes={{ root: classes.root }}>
        <Box {...CommonCss.cardBoxProperties}>
          {/* 上部 */}
          <Box {...CommonCss.topBoxProperties}>
            <Box {...CommonCss.betweenCenter}>
              <Icon>store_front</Icon>
              <Typography variant="h4" className="ml-12">
                販売強化
              </Typography>
            </Box>
            <Box {...CommonCss.betweenCenter}>
              <Button
                onClick={() => router.push('/salesPromotions')}
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
            <Grid
              container
              item
              md={6}
              direction="column"
              classes={{ root: classes.leftSide }}
            >
              <Grid item>
                <Card classes={{ root: classes.cardRoot }}>
                  <CardContent classes={{ root: classes.cardContentRoot }}>
                    <Card elevation={0} classes={{ root: classes.quadrant }}>
                      <Icon>quality_analysis</Icon>
                    </Card>
                  </CardContent>
                  <CardContent classes={{ root: classes.cardActionAreaRoot }}>
                    <Box {...CommonCss.jcBetweenItemsCenterColumn}>
                      <Typography variant="h5" className="mb-8">
                        クオリティ分析
                      </Typography>
                      <Button
                        onClick={handleSkuQualityAnalysis}
                        classes={{ root: classes.btn }}
                      >
                        <Typography variant="h6">SKU単位</Typography>
                        <ArrowForwardIosRoundedIcon />
                      </Button>
                      <Button
                        onClick={handleQualityAnalysisProductCode}
                        classes={{ root: classes.btn }}
                        className="mt-8"
                      >
                        <Typography variant="h6">品番単位</Typography>
                        <ArrowForwardIosRoundedIcon />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* 右側 */}
            <Grid container item md={6} className="w-full">
              <Grid item className="w-full">
                <Card classes={{ root: classes.cardRoot }}>
                  <CardContent classes={{ root: classes.cardContentRoot }}>
                    <Card elevation={0} classes={{ root: classes.quadrant }}>
                      <Icon>unit_price_analysis</Icon>
                    </Card>
                  </CardContent>
                  <CardActionArea
                    classes={{ root: classes.cardActionAreaRoot }}
                    onClick={handleUnitPriceAnalysis}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h5">単価分析</Typography>
                      <ArrowForwardIosRoundedIcon />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>

              <Grid item className="w-full">
                <Grid item className="mt-22">
                  <Card classes={{ root: classes.cardRoot }}>
                    <CardActionArea
                      classes={{ root: classes.cardActionAreaRoot }}
                      onClick={handleNoAnalysis}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="h5">分析なし</Typography>
                        <ArrowForwardIosRoundedIcon />
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  )
}
export default SalesPromotionsCard

export const getServerSideProps = authPage(async () => {
  return {
    props: {}
  }
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '2rem',
      marginLeft: '1.5rem',
      marginRight: '1rem',
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
    quadrant: {
      height: '10rem'
    },
    quadrant2: {
      height: '5rem',
      backgroundColor: 'red'
    },
    btnRoot: {
      paddingRight: 0
    },
    btn: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: 'white',
      color: '#1E3C8C',
      padding: '.6rem .8rem',
      '&:hover': {
        backgroundColor: '#d7d7d7'
      }
    },
    leftSide: {
      marginRight: '1rem'
    }
  })
)
