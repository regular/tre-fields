const computed = require('mutant/computed')
const Value = require('mutant/value')
const {isMsgId} = require('ssb-ref')
const pathway = require('pathway')
const WatchMerged = require('tre-prototypes')

module.exports = function(ssb) {
  const watchMerged = WatchMerged(ssb)

  return function(kv, ctx, opts) {
    ctx = ctx || {}
    opts = opts || {}
    
    const defaultMergeOpts = opts.mergeOpts || {
      allowAllAuthors: true,
      suppressIntermediate: true
    }
    
    const defaultRenderCtx = opts.renderCtx || {
      idleTimer: ctx.idleTimer,
      currentLanguageObs: ctx.currentLanguageObs
    }

    const previewObs = ctx.previewObs || Value(kv)

    function get_from_msg(path, defaultValue) {
      return computed(previewObs, o => {
        const ret = o && pathway(o, path.split('.'))[0]
        if (ret == undefined || ret == null) return defaultValue
        return ret
      })
    }

    function get(path, defaultValue) {
      return get_from_msg(`value.content.${path}`, defaultValue)
    }

    function getDOMElement(path, render, opts) {
      opts = opts || {}
      const renderCtx = opts.renderCtx || defaultRenderCtx
      const mergeOpts = opts.mergeOpts || defaultMergeOpts

      return computed(get(path), ref => {
        if (!isMsgId(ref)) return []
        const kvObs = watchMerged(ref, mergeOpts)
        return computed(kvObs, kv => kv && render(kv, renderCtx) || [])
      })
    }
    return {
      get,
      getDOMElement,
      get_from_msg
    }
  }
}
