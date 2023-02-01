import React from 'react'
import { FormControlLabel, Typography, Checkbox, Grid } from '@material-ui/core'
import { withRouter } from 'next/router'

// TODO::DraftのanalysisType&&Conditionsで表示を切り替える
const QualityAnalisisConditions = (props) => {
  const { router } = props
  const query = router.query || null
  if (!query.qualityAnalysis) return null
  if (query.qualityAnalysis.lengh === 0) return null
  const queryQualityAnalysis = [query.qualityAnalysis].flat()
  const checkBox = []
  queryQualityAnalysis.forEach((v) => {
    checkBox.push(
      <FormControlLabel
        disabled
        control={<Checkbox name={v} checked />}
        label={v.charAt(0).toUpperCase() + v.slice(1)}
      />
    )
  })
  const isChecked = (value) => {
    return queryQualityAnalysis.includes(value)
  }
  // 対象店舗
  return (
    <>
      <Typography variant="subtitle2">クオリティ分析</Typography>
      <Grid container>
        <Grid item xs={6}>
          <FormControlLabel
            disabled
            control={<Checkbox name="best" checked={isChecked('best')} />}
            label="Best"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            disabled
            control={<Checkbox name="better" checked={isChecked('better')} />}
            label="Better"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            disabled
            control={<Checkbox name="good" checked={isChecked('good')} />}
            label="Good"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            disabled
            control={<Checkbox name="bad" checked={isChecked('bad')} />}
            label="Bad"
          />
        </Grid>
      </Grid>
      <FormControlLabel
        disabled
        control={
          <Checkbox name="outOfAnalysis" checked={isChecked('outOfAnalysis')} />
        }
        label="分析対象外"
      />
    </>
  )
}
export default withRouter(QualityAnalisisConditions)
