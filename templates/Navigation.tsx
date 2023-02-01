import React, { useState, useEffect } from 'react'
import axios from '@lib/axios'
import conditionsSalesSlice from '@store/salesPromotions/[id]/conditions'
import conditionsStockSlice from '@store/stockTransfers/[id]/conditions'
import conditionsStrategySlice from '@store/strategyBoard/conditions'
import salesDraftSlice, {
  fetchCreateDraft
} from '@store/salesPromotions/draftData'
import stockDraftSlice from '@store/stockTransfers/draftData'
// import salesPromotionsSlice from '@store/salesPromotions'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useAppDispatch } from '@store'
import {
  Drawer,
  Divider,
  Tooltip,
  Toolbar,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Menu,
  MenuItem,
  List,
  Box,
  Collapse
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { signOut, intervalAuth } from '@middleware/auth'
import Icon from '@components/atoms/Icons'
import Button from '@components/atoms/Button'
import BreadCrumbs from '@components/atoms/BreadCrumbs'
import HeaderContent from '@hooks/useHeaderContent'
import { fetchMe, useMeSelector } from '@store/me'
import { useAccountSettingsSelector } from '@store/accountSettings'

import { useLoading } from '@context/loading'
import { useSnackbar } from '@context/snackbar'
import { useNavDisabler } from '@context/navDisabler'
import CommonCss from '@styles/commonCss'
import conditionsSlice from '@store/supplierOrders/[id]/conditions'
import salesPromotionsSlice from '@store/salesPromotions'
import draftSlice, {
  fetchCreateDraftSupplierOrder
} from '@store/supplierOrders/draftData'
import Const from '@constants'

const drawerWidth = '20.5rem'
const Navigation: React.FC = () => {
  const { onLoading, disposeLoading } = useLoading()
  const { onError } = useSnackbar()
  const { navigationDisable } = useNavDisabler()
  const [qualityAnalysisOpen, setQualityAnalysisOpen] = useState(true)
  const [unitQualityAnalysisOpen, setUnitQualityAnalysisOpen] = useState(true)
  // authトークン更新定期
  useEffect(() => {
    intervalAuth()
  }, [])

  // アカウント情報取得
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  const classes = useStyles()
  const router = useRouter()
  const { me } = useMeSelector()
  const { contractEnabled } = useAccountSettingsSelector()

  const [open, setOpen] = useState(false)
  // リスト一覧へ
  const toggleDrawer = async (type) => {
    if (type === 'home') {
      await router.push(`/home`)
    }
    if (type === 'indicatorTransition') {
      await router.push(`/home/indicatorTransition`)
    }
    if (type === 'productComparison') {
      await router.push(`/home/productComparison`)
    }
    if (type === 'salesPromotionsList') {
      await router.push(`/salesPromotions`)
    }
    if (type === 'stockTransfersList') {
      await router.push(`/stockTransfers`)
    }
    if (type === 'users') {
      await router.push(`/settings/users`)
    }
    if (type === 'supplierOrders') {
      await router.push(`/supplierOrders`)
    }
    if (type === 'suppliers') {
      await router.push(`/settings/suppliers`)
    }
    if (type === 'warehouseSettings') {
      await router.push(`/settings/warehouseSettings`)
    }
    await setOpen(!open)
  }
  const [menu, setMenu] = useState<null | HTMLElement>(null)
  const handleMenu = (event) => {
    setMenu(event.currentTarget)
  }
  const handleLogOut = async () => {
    try {
      await signOut()
      await dispatch(conditionsStrategySlice.actions.reset())
      router.push('/login')
    } catch (error) {
      onError('ログアウトに失敗しました')
      console.error(error)
    }
  }

  const resetStores = async (menuType: string) => {
    // 選択したチェックボックス差分比較検知用storeのクリーニング
    await dispatch(salesPromotionsSlice.actions.resetCheckBoxSelections())

    switch (menuType) {
      case Const.MAJOR_FEATURE_TYPE.STRATEGY_BOARD:
        await dispatch(conditionsStrategySlice.actions.reset())
        break
      case Const.MAJOR_FEATURE_TYPE.SALES_PROMOTIONS:
        await dispatch(conditionsSalesSlice.actions.reset())
        await dispatch(salesDraftSlice.actions.reset())
        break
      case Const.MAJOR_FEATURE_TYPE.STOCK_TRANSFERS:
        await dispatch(conditionsStockSlice.actions.reset())
        await dispatch(stockDraftSlice.actions.reset())
        break
      case Const.MAJOR_FEATURE_TYPE.SUPPLIER_ORDERS:
        await dispatch(conditionsSlice.actions.reset())
        await dispatch(draftSlice.actions.reset())
        break
      case Const.MAJOR_FEATURE_TYPE.SETTINGS:
        break
      default:
    }
  }

  const handleSkuQualityAnalysis = async () => {
    // サイドバーを閉じる
    setOpen(false)
    // API処理に数秒時間がかかる為、ローディング処理(通常はrouter.pushで自動表示)
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await resetStores(Const.MAJOR_FEATURE_TYPE.SALES_PROMOTIONS)
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
    // サイドバーを閉じる
    setOpen(false)
    // API処理に数秒時間がかかる為、ローディング処理(通常はrouter.pushで自動表示)
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await resetStores(Const.MAJOR_FEATURE_TYPE.SALES_PROMOTIONS)
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

  const handleSupplierOrder = async () => {
    setOpen(false)
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await resetStores(Const.MAJOR_FEATURE_TYPE.SUPPLIER_ORDERS)
      const { payload } = await dispatch(fetchCreateDraftSupplierOrder())
      router.push(`/supplierOrders/${payload.id}/skus`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  const handleUnitPriceAnalysis = async () => {
    // サイドバーを閉じる
    setOpen(false)
    // API処理に数秒時間がかかる為、ローディング処理(通常はrouter.pushで自動表示)
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await resetStores(Const.MAJOR_FEATURE_TYPE.SALES_PROMOTIONS)
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

  const handleUnitPriceAnalysisProductCode = async () => {
    // サイドバーを閉じる
    setOpen(false)
    // API処理に数秒時間がかかる為、ローディング処理(通常はrouter.pushで自動表示)
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await resetStores(Const.MAJOR_FEATURE_TYPE.SALES_PROMOTIONS)
      const { payload } = await dispatch(
        fetchCreateDraft({
          analysisType: 'UNIT_ANALYSIS_PRODUCT_CODE',
          addonType: 'NONE'
        })
      )
      await router.push(
        `/salesPromotions/${payload.id}/unitPriceAnalysisProductCode`
      )
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  const handleNoAnalysis = async () => {
    // サイドバーを閉じる
    setOpen(false)
    // API処理に数秒時間がかかる為、ローディング処理(通常はrouter.pushで自動表示)
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await resetStores(Const.MAJOR_FEATURE_TYPE.SALES_PROMOTIONS)
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

  const handleRiskAnalysis = async () => {
    // サイドバーを閉じる
    setOpen(false)
    // API処理に数秒時間がかかる為、ローディング処理(通常はrouter.pushで自動表示)
    onLoading()
    try {
      // ドラフト&検索条件のStoreリセット
      await resetStores(Const.MAJOR_FEATURE_TYPE.STOCK_TRANSFERS)
      const data = await createStockDraft({
        transferTo: 'SELLER',
        analysisType: 'STOCK_RISK_ANALYSIS'
      })

      router.push(`/stockTransfers/${data.id}/riskAnalysis`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  const handleStockDistributeAnalysisSend = async () => {
    setOpen(false)
    try {
      onLoading()
      // ドラフト&検索条件のStoreリセット
      await resetStores(Const.MAJOR_FEATURE_TYPE.STOCK_TRANSFERS)
      const data = await createStockDraft({
        transferTo: 'SELLER',
        analysisType:
          Const.STOCK_TRANSFERS_ANALYSIS_TYPES.STOCK_DISTRIBUTE_ANALYSIS_SEND
      })

      router.push(`/stockTransfers/${data.id}/distributeAnalysis/send`)
    } catch (error) {
      onError(error.response.data.message)
      disposeLoading()
    }
  }

  // const handleStockDistributeAnalysisCollect = async () => {
  //   setOpen(false)
  //   try {
  //     onLoading()
  //     const data = await createStockDraft({
  //       transferTo: 'SELLER',
  //       analysisType:
  //         Const.STOCK_TRANSFERS_ANALYSIS_TYPES.STOCK_DISTRIBUTE_ANALYSIS_COLLECT
  //     })

  //     router.push(`/stockTransfers/${data.id}/distributeAnalysis/collect`)
  //     // ドラフト&検索条件のStoreリセット
  //     await dispatch(conditionsStockSlice.actions.reset())
  //     await dispatch(stockDraftSlice.actions.reset())
  //   } catch (error) {
  //     onError(error.response.data.message)
  //     disposeLoading()
  //   }
  // }

  const handleStrategyBoard = async () => {
    if (router.pathname === '/home') {
      setOpen(!open)
    } else {
      try {
        await resetStores(Const.MAJOR_FEATURE_TYPE.STRATEGY_BOARD)
        toggleDrawer('home')
      } catch (error) {
        onError(error.response.data.message)
        disposeLoading()
      }
    }
  }

  return (
    <div>
      {/* ヘッダー */}
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Box {...CommonCss.jcBetweenItemsCenter}>
            {/* ハンバーガーとパン屑 */}
            <Box
              {...CommonCss.jcFlexStartItemsCenter}
              className={classes.boxHamburger}
            >
              <Button
                classes={{ text: classes.btnText }}
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </Button>
              <Divider
                orientation="vertical"
                flexItem
                classes={{ root: classes.verticalDivider }}
              />
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.textHamburger}
              >
                <BreadCrumbs />
              </Typography>
            </Box>
            {/* アカウント */}
            <Box {...CommonCss.jcEndItemsCenter} className={classes.boxAccount}>
              {/* Summary */}
              <HeaderContent />
              <div>
                <ListItem
                  classes={{ root: classes.listItemRoot }}
                  button
                  onClick={handleMenu}
                >
                  <Tooltip
                    title={me?.name ?? ''}
                    classes={{
                      tooltip: classes.tooltip,
                      popper: classes.popper
                    }}
                  >
                    <ListItemIcon classes={{ root: classes.accountIcon }}>
                      <Icon>account_circle</Icon>
                    </ListItemIcon>
                  </Tooltip>
                </ListItem>
              </div>
              <Menu
                id="row-menu"
                anchorEl={menu}
                open={Boolean(menu)}
                onClose={() => setMenu(null)}
              >
                <MenuItem
                  onClick={() => {
                    router.push('/me')
                    setMenu(null)
                  }}
                >
                  アカウント編集
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLogOut()
                    setMenu(null)
                  }}
                >
                  ログアウト
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* サイドメニュー */}
      <Drawer
        className={classes.drawer}
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
        onClose={toggleDrawer}
        anchor="left"
      >
        <List classes={{ root: classes.listRoot }}>
          <ListItem
            classes={{ root: classes.listItemRootTop }}
            button
            onClick={handleStrategyBoard}
          >
            <ListItemIcon className={classes.menuIcon}>
              <Icon>full_kaiten_header_blue</Icon>
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.strategicBoard }}>
              <Icon>full_kaiten_char_blue</Icon>
            </ListItemText>
          </ListItem>
        </List>

        <Divider />

        <List classes={{ root: classes.listRoot }}>
          <ListItem classes={{ root: classes.listItemRootTop }}>
            <Tooltip title="戦略ボード">
              <ListItemIcon className={classes.menuIcon}>
                <Icon>home_navigation</Icon>
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="戦略ボード"
            />
          </ListItem>
          <ListItem
            button
            classes={{
              root: navigationDisable?.home
                ? classes.disabledList
                : classes.listItemSub
            }}
            onClick={() => toggleDrawer('home')}
            disabled={navigationDisable?.home}
          >
            <ListItemText
              classes={{ root: classes.insetListItemText }}
              inset
              primary="販売実績"
            />
          </ListItem>
          <ListItem
            button
            classes={{
              root: navigationDisable?.indicatorTransition
                ? classes.disabledList
                : classes.listItemSub
            }}
            onClick={() => toggleDrawer('indicatorTransition')}
            disabled={navigationDisable?.indicatorTransition}
          >
            <ListItemText
              classes={{ root: classes.insetListItemText }}
              inset
              primary="指標推移"
            />
          </ListItem>
          <ListItem
            button
            classes={{
              root: navigationDisable?.productComparison
                ? classes.disabledList
                : classes.listItemSub
            }}
            onClick={() => toggleDrawer('productComparison')}
            disabled={navigationDisable?.productComparison}
          >
            <ListItemText
              classes={{ root: classes.insetListItemText }}
              inset
              primary="商品比較"
            />
          </ListItem>

          <ListItem classes={{ root: classes.listItemRoot }}>
            <Tooltip title="販売強化">
              <ListItemIcon className={classes.menuIcon}>
                <Icon>store_front</Icon>
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="販売強化"
            />
          </ListItem>

          <ListItem
            button
            classes={{
              root: navigationDisable?.salesPromotionsList
                ? classes.disabledList
                : classes.listItemSub
            }}
            onClick={() => toggleDrawer('salesPromotionsList')}
            disabled={navigationDisable?.salesPromotionsList}
          >
            <ListItemText
              classes={{ root: classes.insetListItemText }}
              inset
              primary="リスト一覧"
            />
          </ListItem>

          <ListItem
            button
            onClick={() => setQualityAnalysisOpen(!qualityAnalysisOpen)}
            className={classes.item}
          >
            <ListItemIcon classes={{ root: classes.listItemIcon }}>
              {qualityAnalysisOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
            <ListItemText primary="クオリティ分析" />
          </ListItem>
          <Collapse
            in={qualityAnalysisOpen}
            timeout="auto"
            unmountOnExit
            className={classes.colleapse}
          >
            {/* 品番 */}
            <ListItem
              button
              classes={{
                root: navigationDisable?.qualityAnalysisProductCode
                  ? classes.disabledList
                  : classes.listItemSub
              }}
              disabled={navigationDisable?.qualityAnalysisProductCode}
            >
              <ListItemText
                classes={{
                  root: classes.nestedListItemText,
                  primary: classes.listItemPrimary,
                  secondary: classes.secondary
                }}
                inset
                primary="品番単位"
                onClick={handleQualityAnalysisProductCode}
              />
            </ListItem>
            {/* SKU */}
            <ListItem
              button
              classes={{
                root: navigationDisable?.qualityAnalysis
                  ? classes.disabledList
                  : classes.listItemSub
              }}
              disabled={navigationDisable?.qualityAnalysis}
            >
              <ListItemText
                classes={{
                  root: classes.nestedListItemText,
                  primary: classes.listItemPrimary,
                  secondary: classes.secondary
                }}
                inset
                primary="SKU単位"
                onClick={handleSkuQualityAnalysis}
              />
            </ListItem>
          </Collapse>

          <ListItem
            button
            onClick={() => setUnitQualityAnalysisOpen(!unitQualityAnalysisOpen)}
            className={classes.item}
          >
            <ListItemIcon classes={{ root: classes.listItemIcon }}>
              {unitQualityAnalysisOpen ? (
                <ExpandMoreIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </ListItemIcon>
            <ListItemText primary="単価分析" />
          </ListItem>
          <Collapse
            in={unitQualityAnalysisOpen}
            timeout="auto"
            unmountOnExit
            className={classes.colleapse}
          >
            {/* 品番 */}
            <ListItem
              button
              classes={{
                root: navigationDisable?.unitPriceAnalysisProductCode
                  ? classes.disabledList
                  : classes.listItemSub
              }}
              disabled={navigationDisable?.unitPriceAnalysisProductCode}
            >
              <ListItemText
                classes={{
                  root: classes.nestedListItemText,
                  primary: classes.listItemPrimary,
                  secondary: classes.secondary
                }}
                inset
                primary="品番単位"
                onClick={handleUnitPriceAnalysisProductCode}
              />
            </ListItem>
            {/* SKU */}
            <ListItem
              button
              classes={{
                root: navigationDisable?.unitPriceAnalysis
                  ? classes.disabledList
                  : classes.listItemSub
              }}
              disabled={navigationDisable?.unitPriceAnalysis}
            >
              <ListItemText
                classes={{
                  root: classes.nestedListItemText,
                  primary: classes.listItemPrimary,
                  secondary: classes.secondary
                }}
                inset
                primary="SKU単位"
                onClick={handleUnitPriceAnalysis}
              />
            </ListItem>
          </Collapse>

          {/* <ListItem
            button
            classes={{
              root: navigationDisable?.unitPriceAnalysis
                ? classes.disabledList
                : classes.listItemSub
            }}
            onClick={handleUnitPriceAnalysis}
            disabled={navigationDisable?.unitPriceAnalysis}
          >
            <ListItemText
              classes={{ root: classes.insetListItemText }}
              inset
              primary="単価分析"
            />
          </ListItem> */}

          <ListItem
            button
            classes={{
              root: navigationDisable?.noAnalysis
                ? classes.disabledList
                : classes.listItemSub
            }}
            onClick={handleNoAnalysis}
            disabled={navigationDisable?.noAnalysis}
          >
            <ListItemText
              classes={{ root: classes.insetListItemText }}
              inset
              primary="分析なし"
            />
          </ListItem>

          <ListItem classes={{ root: classes.listItemRoot }}>
            <Tooltip title="在庫移動">
              <ListItemIcon className={classes.menuIcon}>
                <Icon>warehouse</Icon>
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="在庫移動"
            />
          </ListItem>
          <ListItem
            button
            classes={{
              root: navigationDisable?.stockTransfersList
                ? classes.disabledList
                : classes.listItemSub
            }}
            onClick={() => toggleDrawer('stockTransfersList')}
            disabled={navigationDisable?.stockTransfersList}
          >
            <ListItemText
              classes={{ root: classes.insetListItemText }}
              inset
              primary="リスト一覧"
            />
          </ListItem>
          <ListItem
            button
            classes={{
              root: navigationDisable?.riskAnalysis
                ? classes.disabledList
                : classes.listItemSub
            }}
            onClick={handleRiskAnalysis}
            disabled={navigationDisable?.riskAnalysis}
          >
            <ListItemText
              classes={{ root: classes.insetListItemText }}
              inset
              primary="中央倉庫分析"
            />
          </ListItem>
          {contractEnabled?.stockDistributeAnalysis && (
            <ListItem
              button
              classes={{
                root: navigationDisable?.distributeAnalysisSend
                  ? classes.disabledList
                  : classes.listItemSub
              }}
              onClick={handleStockDistributeAnalysisSend}
              disabled={navigationDisable?.distributeAnalysisSend}
            >
              <ListItemText
                classes={{ root: classes.insetListItemText }}
                inset
                primary="ディストリビュート分析"
              />
            </ListItem>
          )}
          {contractEnabled?.supplierOrder && (
            <>
              <ListItem classes={{ root: classes.listItemRoot }}>
                <Tooltip title="追加発注">
                  <ListItemIcon className={classes.menuIcon}>
                    <Icon>track</Icon>
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="追加発注"
                />
              </ListItem>
              <ListItem
                button
                onClick={() => toggleDrawer('supplierOrders')}
                classes={{
                  root: navigationDisable?.supplierOrders
                    ? classes.disabledList
                    : classes.listItemSub
                }}
                disabled={navigationDisable?.supplierOrders}
              >
                <ListItemText
                  classes={{
                    root: classes.insetListItemText
                  }}
                  inset
                  primary="リスト一覧"
                />
              </ListItem>
              <ListItem
                onClick={handleSupplierOrder}
                button
                classes={{
                  root: navigationDisable?.supplierOrdersSkus
                    ? classes.disabledList
                    : classes.listItemSub
                }}
                disabled={navigationDisable?.supplierOrdersSkus}
              >
                <ListItemText
                  classes={{
                    root: classes.insetListItemText
                  }}
                  inset
                  primary="リスト作成"
                />
              </ListItem>
            </>
          )}

          {/* <ListItem classes={{ root: classes.listItemRoot }}>
            <Tooltip title="傾向">
              <ListItemIcon className={classes.menuIcon}>
                <Icon>graph</Icon>
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="傾向"
            />
          </ListItem>
          <ListItem
            // TODO button
            classes={{ root: classes.listItemSub }}
            // TODO onClick={}
          >
            <Link href="/trend">
              <ListItemText
                classes={{
                  root: classes.insetListItemText,
                  primary: classes.primary
                }}
                inset
                primary="トレンド分析"
              />
            </Link>
          </ListItem> */}
        </List>

        <Divider />

        <ListItem classes={{ root: classes.listItemRoot }}>
          <Tooltip title="設定">
            <ListItemIcon className={classes.menuIcon}>
              <Icon>settings</Icon>
            </ListItemIcon>
          </Tooltip>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="設定"
          />
        </ListItem>
        <ListItem
          button
          classes={{
            root: navigationDisable?.users
              ? classes.disabledList
              : classes.listItemSub
          }}
          onClick={() => toggleDrawer('users')}
          disabled={navigationDisable?.users}
        >
          <ListItemText
            classes={{ root: classes.insetListItemText }}
            inset
            primary="ユーザー"
          />
        </ListItem>
        <ListItem
          button
          classes={{
            root: navigationDisable?.suppliers
              ? classes.disabledList
              : classes.listItemSub
          }}
          onClick={() => toggleDrawer('suppliers')}
          disabled={navigationDisable?.suppliers}
        >
          <ListItemText
            classes={{ root: classes.insetListItemText }}
            inset
            primary="発注先"
          />
        </ListItem>
        {contractEnabled?.stockDistributeAnalysis && (
          <ListItem
            button
            classes={{
              root: navigationDisable?.warehouseSettings
                ? classes.disabledList
                : classes.listItemSub
            }}
            onClick={() => toggleDrawer('warehouseSettings')}
            disabled={navigationDisable?.warehouseSettings}
          >
            <ListItemText
              classes={{ root: classes.insetListItemText }}
              inset
              primary="ディストリビュート"
            />
          </ListItem>
        )}
      </Drawer>
    </div>
  )
}

export default Navigation

async function createStockDraft(params) {
  const { data } = await axios.post(`/api/stock-transfers/create`, params)
  return data
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: 'primary',
      zIndex: 799,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarSpacer: theme.mixins.toolbar,
    toolbar: {
      paddingLeft: '.1rem'
    },
    tooltip: {
      backgroundColor: 'black',
      fontSize: '.9rem'
    },
    popper: {
      opacity: '60%'
    },
    accountIcon: {
      minWidth: 0
    },
    listRoot: {
      padding: 0
    },
    listSettings: {
      paddingTop: 0,
      marginBottom: '4rem'
    },
    drawer: {
      display: 'inline'
    },
    drawerPaper: {
      zIndex: 499,
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      paddingBottom: '5rem'
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary
    },
    verticalDivider: {
      marginRight: '1rem',
      backgroundColor: '#FFFFFF',
      opacity: '20%'
    },
    listItemRootTop: {
      paddingLeft: 14,
      paddingTop: 18,
      paddingBottom: 14
    },
    listItemRoot: {
      padding: 14
    },
    listItemSub: {
      paddingTop: '.4rem',
      paddingBottom: '.4rem'
    },
    listItemSubBottom: {
      paddingTop: '.4rem',
      paddingBottom: '.8rem'
    },
    listItemText: {
      color: '#4B5363',
      fontWeight: 700
    },
    inset: {
      paddingLeft: 0
    },
    insetListItemText: {
      marginLeft: '.5rem'
    },
    nestedListItemText: {
      marginLeft: '2.3rem'
    },
    menuIcon: {
      marginLeft: '0.65rem'
    },
    btnText: {
      padding: '1.3rem'
    },
    // 機能実装までの一時対応
    primary: {
      color: 'lightgray'
    },
    // ダッシュボード実装までの一時対応
    strategicBoard: {
      color: 'lightgray',
      fontWeight: 700
    },
    disabledList: {
      paddingTop: '.4rem',
      paddingBottom: '.4rem',
      backgroundColor: '#efeeee',
      color: '#1E3C8C'
    },
    listItemPrimary: {
      display: 'inline'
    },
    boxAccount: {
      width: '50%'
    },
    secondary: {
      display: 'inline'
    },
    boxHamburger: {
      width: '65%'
    },
    textHamburger: {
      width: '100%'
    },
    item: {
      padding: 0,
      paddingLeft: '4.8rem',
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    },
    colleapse: {
      padding: theme.spacing(1)
    },
    listItemIcon: {
      minWidth: '.2rem'
    }
  })
)
