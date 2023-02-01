import axios from '@lib/axios'
import React, { useState, useEffect } from 'react'
import { useLoading } from '@context/loading'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Checkbox, Popover, MenuItem, MenuList } from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'
import { TableHeaderRow } from '@devexpress/dx-react-grid-material-ui'
import { useDraftSelector } from '@store/stockTransfers/draftData'
import { useFilterContext } from '@context/filter'
import { useConditionsSelector } from '@store/stockTransfers/[id]/conditions'

const TableHeaderRowCell = (props) => {
  const classes = useStyles()
  const { allSelected, someSelected, reFetchSkus, onToggle } = props
  const [openMenu, setMenu] = useState<null | HTMLElement>(null)
  const [check, setCheck] = useState(false)
  const { draft } = useDraftSelector()
  const { filters } = useFilterContext()
  const { conditions } = useConditionsSelector()
  const filterSkus = {
    filter: {
      ...conditions,
      ...filters
    }
  }
  const { onLoading, disposeLoading } = useLoading()

  useEffect(() => {
    setCheck(allSelected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSelected])

  const onChange = (e, checked) => {
    setCheck(checked)
    onToggle(checked)
  }

  const onClickCheckbox = (e) => {
    e.stopPropagation()
  }

  const handleOpen = (e) => {
    setMenu(e.currentTarget)
  }

  const handleAddAllSkusToStockTransferDraft = () => {
    setMenu(null)
    onLoading()
    addAllSkusToStockTransferDraft(draft.id, filterSkus).then(() => {
      reFetchSkus().then(disposeLoading)
    })
  }

  const handleRemoveAllSkusToStockTransferDraft = () => {
    setMenu(null)
    onLoading()
    removeAllSkusToStockTransferDraft(draft.id, filterSkus).then(() => {
      reFetchSkus().then(disposeLoading)
    })
  }

  return (
    <TableHeaderRow.Cell {...props}>
      <div className={classes.checkAllThead}>
        <Checkbox
          name="check_all"
          indeterminate={someSelected}
          onChange={onChange}
          checked={check}
          onClick={onClickCheckbox}
          color="default"
          className={classes.checkAllTheadInput}
        />
        <ArrowDropDown
          className={classes.checkAllTheadIcon}
          onClick={handleOpen}
        />
        <Popover
          anchorEl={openMenu}
          open={Boolean(openMenu)}
          onClose={() => setMenu(null)}
          id="row-menu"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <MenuList>
            <MenuItem onClick={handleAddAllSkusToStockTransferDraft}>
              全ページ選択
            </MenuItem>
            <MenuItem onClick={handleRemoveAllSkusToStockTransferDraft}>
              全ページ選択解除
            </MenuItem>
          </MenuList>
        </Popover>
      </div>
    </TableHeaderRow.Cell>
  )
}

const SelectionHeaderCellComponent = (props) => {
  return <TableHeaderRowCell {...props} />
}

export default SelectionHeaderCellComponent
const useStyles = makeStyles(() =>
  createStyles({
    checkAllThead: {
      background: '#eceef0',
      position: 'relative',
      paddingLeft: '0.563rem !important'
    },
    checkAllTheadIcon: {
      cursor: 'pointer',
      position: 'absolute',
      right: '-0.25rem',
      top: 0,
      bottom: 0,
      margin: 'auto'
    },
    checkAllTheadInput: {
      paddingRight: 0,
      '&:hover': {
        backgroundColor: 'transparent'
      }
    }
  })
)

async function addAllSkusToStockTransferDraft(draftId: string, params: any) {
  const {
    data: { success }
  } = await axios.put(
    `/api/stock-transfers/${draftId}/skus/update-all-skus`,
    params
  )
  if (!success) {
    throw new Error()
  }
}

async function removeAllSkusToStockTransferDraft(draftId: string, params: any) {
  const {
    data: { success }
  } = await axios.delete(
    `/api/stock-transfers/${draftId}/skus/update-all-skus`,
    {
      data: params
    }
  )
  if (!success) {
    throw new Error()
  }
}
