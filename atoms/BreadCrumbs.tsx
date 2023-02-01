import React from 'react'
import Link from 'next/link'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Box, Breadcrumbs, Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useDraftSelector as useSpDraftSelector } from '@store/salesPromotions/draftData'
import { useDraftSelector as useStDraftSelector } from '@store/stockTransfers/draftData'
import { useDraftSelector as useSoDraftSelector } from '@store/supplierOrders/draftData'
import Utils from '@utils'
import Icon from './Icons'

const STOCK_TRANSFER_TITLE = '在庫移動'
const routingMapping = {
  '/home': { title: '戦略ボード' },
  '/home/indicatorTransition': { title: '指標推移' },
  '/home/productComparison': { title: '商品比較' },
  '/strategicBoard': { title: '戦略ボード' },
  '/salesPromotions': { title: '販売強化' },
  '/salesPromotions/[id]/qualityAnalysis': { title: 'クオリティ分析(SKU)' },
  '/salesPromotions/[id]/qualityAnalysisProductCode': {
    title: 'クオリティ分析(品番)'
  },
  '/salesPromotions/[id]/qualityAnalysis/skus': { title: '商品一覧' },
  '/salesPromotions/[id]/qualityAnalysisProductCode/productCodes': {
    title: '商品一覧'
  },
  '/salesPromotions/[id]/unitPriceAnalysis': {
    title: '単価分析(SKU)'
  },
  '/salesPromotions/[id]/unitPriceAnalysisProductCode': {
    title: '単価分析(品番)'
  },
  '/salesPromotions/[id]/unitPriceAnalysis/skus': {
    title: '商品一覧'
  },
  '/salesPromotions/[id]/unitPriceAnalysisProductCode/productCodes': {
    title: '商品一覧'
  },
  '/salesPromotions/[id]/skus': { title: '商品一覧' },
  '/salesPromotions/[id]/list': { title: '無題のリスト' },
  '/salesPromotions/[id]/productCodesList': { title: '無題のリスト' },
  '/stockTransfers': { title: STOCK_TRANSFER_TITLE },
  '/stockTransfers/[id]/riskAnalysis': { title: '中央倉庫分析' },
  '/stockTransfers/[id]/riskAnalysis/skus': { title: '商品一覧' },
  '/stockTransfers/[id]/list': { title: '無題のリスト' },
  '/stockTransfers/[id]/distributeAnalysis/send': {
    title: 'ディストリビュート分析'
  },
  '/stockTransfers/[id]/distributeAnalysis/send/skus': {
    title: '商品一覧'
  },
  '/stockTransfers/[id]/distributeAnalysis/collect': {
    title: 'ディストリビュート分析：回収'
  },
  '/stockTransfers/[id]/distributeAnalysis/collect/skus': {
    title: '商品一覧'
  },
  '/supplierOrders': { title: '追加発注 / リスト一覧' },
  '/supplierOrders/[id]/skus': { title: '商品一覧' },
  '/supplierOrders/[id]/list': { title: '追加発注 / 商品リスト' },
  '/settings': { title: '設定' },
  '/settings/users': { title: 'ユーザー' },
  '/settings/users/[id]': { title: 'ユーザー編集' },
  '/settings/sellers': { title: '店舗' },
  '/settings/suppliers': { title: '発注先' },
  '/settings/warehouseSettings': { title: 'ディストリビュート' },
  '/me': { title: 'ユーザー情報' },
  '/me/changePassword': { title: 'パスワード変更' },
  '/_error': { title: 'ERROR' }
}
const Breadcrumb = () => {
  const classes = useStyles()
  // ドラフトデータ取得
  const { draft: salesPromotionDraft } = useSpDraftSelector()
  const { draft: stockTransferDraft } = useStDraftSelector()
  const { draft: supplierOrdersDraft } = useSoDraftSelector()

  const { pathname: routerPathname, query } = useRouter()

  const isEdit = Object.keys(query).indexOf('edit') !== -1
  const pathname = routerPathname
    .split('/')
    .filter((element) => element.length > 0)
  const { length } = pathname
  const links: Array<JSX.Element> = []
  let pathnameHierarchy = '/'

  for (let i = 0; i < length; i += 1) {
    let target = routingMapping[pathnameHierarchy]
    const hrefPass = pathnameHierarchy.replace('[id]', String(query?.id))
    if (target) {
      links.push(
        <Link passHref href={hrefPass} key={pathnameHierarchy}>
          <a>
            <Typography
              variant="h6"
              color="textSecondary"
              className={classes.link}
              key={pathnameHierarchy}
            >
              {routerPathname.includes('/distributeAnalysis') &&
              target.title === STOCK_TRANSFER_TITLE
                ? '在庫移動'
                : target.title}
            </Typography>
          </a>
        </Link>
      )
    }
    pathnameHierarchy += pathnameHierarchy.endsWith('/')
      ? pathname[i]
      : `/${pathname[i]}`
  }

  /**
   * 最下層=現在のルーティングはクリックできないように<Typography>でリストを作成
   */
  const subEditTitle = Utils.isProductCode(routerPathname)
    ? '(編集: 品番)'
    : '(編集: SKU)'
  if (
    pathname[length - 1] === 'list' ||
    pathname[length - 1] === 'productCodesList'
  ) {
    // 商品リスト画面はドラフトデータ名を表示
    let draftName: string
    switch (pathname[0]) {
      case 'salesPromotions':
      case 'unitPriceAnalysis':
        draftName = salesPromotionDraft?.name
        break
      case 'stockTransfers':
        draftName = stockTransferDraft?.name
        break
      case 'supplierOrders':
        draftName = supplierOrdersDraft?.name
        break
      default:
    }
    links.push(
      <Typography
        variant="h5"
        color="textSecondary"
        className={classes.link}
        key={pathnameHierarchy}
      >
        {isEdit ? `${draftName}${subEditTitle}` : '無題のリスト'}
      </Typography>
    )
  } else {
    const deepest = routingMapping[pathnameHierarchy]
    links.push(
      deepest ? (
        <Typography
          variant="h5"
          color="textSecondary"
          className={classes.link}
          key={pathnameHierarchy}
        >
          {isEdit ? `${deepest.title}${subEditTitle}` : deepest.title}
        </Typography>
      ) : (
        <Typography color="textSecondary" key={pathnameHierarchy}>
          {pathnameHierarchy}
        </Typography>
      )
    )
  }

  return (
    <>
      <div className={classes.gridCustom}>
        <div className={classes.gridLeft}>
          <Box mt={0.5}>
            <HeaderIconButton pathName={pathname} />
          </Box>
        </div>
        <div className={classes.gridRight}>
          <Box mt={0.5}>
            <Breadcrumbs
              aria-label="breadcrumb"
              className={classes.breadcrumbs}
            >
              {links.map((link) => link)}
            </Breadcrumbs>
          </Box>
        </div>
      </div>
    </>
  )
}
export default Breadcrumb

const HeaderIconButton = ({ pathName }) => {
  const func = pathName[0]
  let icon = { resource: 'home', path: '/home' }

  const pathSetting = (): string => {
    return pathName[1] ? `/settings/${pathName[1]}` : '/settings/users'
  }

  switch (func) {
    case 'strategicBoard':
      icon = { resource: 'speed_header', path: '/strategicBoard' }
      break
    case 'supplierOrders':
      icon = { resource: 'track_header', path: '/supplierOrders' }
      break
    case 'salesPromotions':
      icon = { resource: 'store_front_header', path: '/salesPromotions' }
      break
    case 'stockTransfers':
      icon = { resource: 'warehouse_header', path: '/stockTransfers' }
      break
    case 'settings':
      icon = { resource: 'settings_header', path: pathSetting() }
      break
    case 'me':
      icon = { resource: 'me_header', path: '/me' }
      break
    default:
      break
  }

  return (
    <Link passHref href={icon.path}>
      <a>
        <Icon>{icon.resource}</Icon>
      </a>
    </Link>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadcrumbs: {
      color: 'white'
    },
    link: {
      display: 'flex',
      color: 'white',
      fontWeight: 'bold'
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20
    },
    gridCustom: {
      width: ' 100%',
      display: 'flex',
      alignItems: 'center'
    },
    gridLeft: {
      width: '6%'
    },
    gridRight: {
      width: '94%'
    }
  })
)
