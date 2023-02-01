import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SnackBarProvider } from '@context/snackbar'
import { NavDisablerProvider } from '@context/navDisabler'
import { useLoading } from '@context/loading'
import {
  fetchContractEnabled,
  fetchProductCodeExists
} from '@store/accountSettings'
import { useAppDispatch } from '@store'
import { ContractEnabled } from '@typeDefs/contractEnabled'
import * as gtag from '@lib/gtag'
import Navigation from './Navigation'
import MainContainer from './MainContainer'

const Layout = (props): JSX.Element => {
  const { children } = props
  const { onLoading, disposeLoading } = useLoading()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [loadingContract, setLoadingContract] = useState<boolean>(false)

  // ※pkg:nextjs-progressbarの実装を参考
  // https://github.com/apal21/nextjs-progressbar/blob/master/src/index.js
  const routeChangeStart = (_, { shallow }) => {
    if (!shallow || props.showOnShallow) {
      onLoading()
    }
  }
  const routeChangeEnd = (_, { shallow }) => {
    if (!shallow || props.showOnShallow) {
      setTimeout(() => {
        disposeLoading()
      }, 500)
    }
  }
  useEffect(() => {
    // 全ページ共通処理 (_app.tsx でやるのが一般的?)
    // TODO テストができたら_appに移す
    gtag.pageview(router.asPath)
    handleInitializeFetching(router.pathname)
    router.events.on('routeChangeStart', routeChangeStart)
    router.events.on('routeChangeComplete', routeChangeEnd)
    router.events.on('routeChangeError', routeChangeEnd)
    return () => {
      router.events.off('routeChangeStart', routeChangeStart)
      router.events.off('routeChangeComplete', routeChangeEnd)
      router.events.off('routeChangeError', routeChangeEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname])

  const isSupplierOrdersPathname = (pathname: string): boolean => {
    return (
      pathname === '/supplierOrders' ||
      pathname === '/supplierOrders/[id]/skus' ||
      pathname === '/supplierOrders/[id]/list'
    )
  }

  const isDistributeAnalysisPathname = (pathname: string): boolean => {
    return (
      pathname === '/stockTransfers/[id]/distributeAnalysis/send' ||
      pathname === '/stockTransfers/[id]/distributeAnalysis/send/skus' ||
      pathname === '/stockTransfers/[id]/distributeAnalysis/send/list' ||
      pathname === '/stockTransfers/[id]/distributeAnalysis/collect' ||
      pathname === '/stockTransfers/[id]/distributeAnalysis/collect/skus' ||
      pathname === '/stockTransfers/[id]/distributeAnalysis/collect/list' ||
      pathname === '/settings/warehouseSettings'
    )
  }

  const isContractEnabled = (
    payload: ContractEnabled,
    pathname: string
  ): boolean => {
    if (!payload.supplierOrder && isSupplierOrdersPathname(pathname)) {
      return false
    }

    if (
      !payload.stockDistributeAnalysis &&
      isDistributeAnalysisPathname(pathname)
    ) {
      return false
    }
    return true
  }

  const handleInitializeFetching = async (pathname) => {
    if (pathname === '/login') return

    setLoadingContract(true)
    const [contract] = await Promise.all([
      dispatch(fetchContractEnabled()), // 契約情報を取得する
      dispatch(fetchProductCodeExists()) // 品番の扱いがあるアカウントか
      // NOTE:: Navigation.tsx の fetchMeもここがいいのではないか
    ])
    setLoadingContract(false)

    if (!isContractEnabled(contract.payload as ContractEnabled, pathname)) {
      await router.push('/home')
    }
  }

  return (
    <>
      <SnackBarProvider>
        {router.pathname !== '/login' ? (
          <>
            <div className="layout-root">
              <NavDisablerProvider>
                <Navigation />
              </NavDisablerProvider>
              <MainContainer>{!loadingContract && children}</MainContainer>
            </div>
            <style jsx>{`
              .layout-root {
                display: flex;
              }
            `}</style>
          </>
        ) : (
          { ...children }
        )}
      </SnackBarProvider>
    </>
  )
}

export default Layout
