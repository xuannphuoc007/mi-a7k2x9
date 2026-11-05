import { describe, expect, it } from 'vitest'
import { compact, fmtChange, fmtPct, toCsv, toneOf } from './format'

describe('format', () => {
  it('compact', () => {
    expect(compact(3.5e12)).toContain('nghìn tỷ')
    expect(compact(2.1e9)).toContain('tỷ')
  })
  it('pct & change', () => {
    expect(fmtPct(1.234)).toMatch(/^\+1,23%$/)
    expect(fmtPct(null)).toBe('—')
    expect(fmtChange(-12, 'bp')).toBe('-12 bp')
  })
  it('tone', () => {
    expect(toneOf(1)).toBe('up')
    expect(toneOf(-1)).toBe('down')
    expect(toneOf(null)).toBe('flat')
  })
  it('csv escapes', () => {
    expect(toCsv([['a,b', 'x"y']])).toBe('﻿"a,b","x""y"')
  })
})
