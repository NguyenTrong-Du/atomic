import React from 'react'
import { authPage } from '@middleware/auth'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Card, Grid, Typography, CardActionArea, Box } from '@material-ui/core'
import { useRouter } from 'next/router'
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded'
import CommonCss from '@styles/commonCss'
import Icon from '@components/atoms/Icons'
import Button from '@components/atoms/Button'
import { useAppDispatch } from '@store'
import conditionsSlice from '@store/supplierOrders/[id]/conditions'
import draftSlice, {
  fetchCreateDraftSupplierOrder
} from '@store/supplierOrders/draftData'
import { useLoading } from '@context/loading'
import { useSnackbar } from '@context/snackbar'

const SupplierOrdersCard: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()
  const { onLoading, disposeLoading } = useLoading()
  const { onError } = useSnackbar()
  const dispatch = useAppDispatch()

  const createNewSupplierOrder = async () => {
    onLoading()
    try {
      await dispatch(conditionsSlice.actions.reset())
      await dispatch(draftSlice.actions.reset())

      const { payload } = await dispatch(fetchCreateDraftSupplierOrder())

      router.push(`/supplierOrders/${payload.id}/skus`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  const onGoToSupplierOrderList = async (route) => {
    router.push(route)
  }

  return (
    <>
      <Card elevation={2} classes={{ root: classes.root }}>
        <Box {...CommonCss.cardBoxProperties}>
          <Box {...CommonCss.topBoxProperties}>
            <Box {...CommonCss.betweenCenter}>
              <Icon>track</Icon>
              <Typography variant="h4" className="ml-12">
                追加発注
              </Typography>
            </Box>
            <Box {...CommonCss.betweenCenter}>
              <Button
                onClick={() => onGoToSupplierOrderList('supplierOrders')}
                classes={{ root: classes.btnRoot }}
              >
                <Typography variant="h6">リスト一覧</Typography>
                <ArrowForwardIosRoundedIcon className="ml-12" />
              </Button>
            </Box>
          </Box>

          <Grid container item justify="space-between" wrap="nowrap">
            <Grid container item md={6} direction="column" className="mr-8">
              <Grid item className="mt-16">
                <Card classes={{ root: classes.cardRoot }}>
                  <CardActionArea
                    classes={{ root: classes.cardActionAreaRoot }}
                    onClick={createNewSupplierOrder}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h5">新規発注リスト</Typography>
                      <ArrowForwardIosRoundedIcon />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  )
}
export default SupplierOrdersCard

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
      marginBottom: '2rem',
      padding: theme.spacing(3),
      borderRadius: '.6rem'
      // minHeight: '32rem'
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
    }
  })
)
