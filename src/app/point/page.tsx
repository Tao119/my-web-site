'use client'
import { useState } from 'react'

const Point = () => {
  const [h, seth] = useState(1)
  const [t1, set1] = useState('')
  const [t2, set2] = useState('')
  const [t3, set3] = useState('')
  const [t4, set4] = useState('')
  const [m, setm] = useState(-1)
  const [a, seta] = useState(-1)
  const [r, setr] = useState('')
  const [f, setf] = useState(20)

  const calcF = () => {
    let tf = 20
    tf +=
      (t1.includes('刻') ? 2 : t1.includes('槓') ? 8 : 0) *
      (t1.includes('明') ? 1 : 2) *
      (t1.includes('中') ? 1 : 2)
    tf +=
      (t2.includes('刻') ? 2 : t2.includes('槓') ? 8 : 0) *
      (t2.includes('明') ? 1 : 2) *
      (t2.includes('中') ? 1 : 2)
    tf +=
      (t3.includes('刻') ? 2 : t3.includes('槓') ? 8 : 0) *
      (t3.includes('明') ? 1 : 2) *
      (t3.includes('中') ? 1 : 2)
    tf +=
      (t4.includes('刻') ? 2 : t4.includes('槓') ? 8 : 0) *
      (t4.includes('明') ? 1 : 2) *
      (t4.includes('中') ? 1 : 2)
    tf += r == 'ロン' ? 2 : 0
    tf += m >= 0 ? m : 0 + a >= 0 ? a : 0
    tf +=
      r == 'ロン' &&
      t1.includes('暗') &&
      t2.includes('暗') &&
      t3.includes('暗') &&
      t4.includes('暗')
        ? 10
        : 0
    setf(tf)
  }

  return (
    <main>
      <input type="number" value={h} onChange={(e) => (calcF(), seth(parseInt(e.target.value)))} />
      <select value={t1} onChange={(e) => set1(e.target.value)}>
        <option value="" disabled>
          1
        </option>
        <option value="明順">明順</option>
        <option value="暗順">暗順</option>
        <option value="中明刻">中明刻</option>
        <option value="中暗刻">中暗刻</option>
        <option value="么明刻">么明刻</option>
        <option value="么暗刻">么暗刻</option>
        <option value="中明槓">中明槓</option>
        <option value="中暗槓">中暗槓</option>
        <option value="么明槓">么明槓</option>
        <option value="么暗槓">么暗槓</option>
      </select>
      <select value={t2} onChange={(e) => (calcF(), set2(e.target.value))}>
        <option value="" disabled>
          2
        </option>
        <option value="明順">明順</option>
        <option value="暗順">暗順</option>
        <option value="中明刻">中明刻</option>
        <option value="中暗刻">中暗刻</option>
        <option value="么明刻">么明刻</option>
        <option value="么暗刻">么暗刻</option>
        <option value="中明槓">中明槓</option>
        <option value="中暗槓">中暗槓</option>
        <option value="么明槓">么明槓</option>
        <option value="么暗槓">么暗槓</option>
      </select>
      <select value={t3} onChange={(e) => (calcF(), set3(e.target.value))}>
        <option value="" disabled>
          3
        </option>
        <option value="明順">明順</option>
        <option value="暗順">暗順</option>
        <option value="中明刻">中明刻</option>
        <option value="中暗刻">中暗刻</option>
        <option value="么明刻">么明刻</option>
        <option value="么暗刻">么暗刻</option>
        <option value="中明槓">中明槓</option>
        <option value="中暗槓">中暗槓</option>
        <option value="么明槓">么明槓</option>
        <option value="么暗槓">么暗槓</option>
      </select>
      <select value={t4} onChange={(e) => (calcF(), set4(e.target.value))}>
        <option value="" disabled>
          4
        </option>
        <option value="明順">明順</option>
        <option value="暗順">暗順</option>
        <option value="中明刻">中明刻</option>
        <option value="中暗刻">中暗刻</option>
        <option value="么明刻">么明刻</option>
        <option value="么暗刻">么暗刻</option>
        <option value="中明槓">中明槓</option>
        <option value="中暗槓">中暗槓</option>
        <option value="么明槓">么明槓</option>
        <option value="么暗槓">么暗槓</option>
      </select>
      <select value={m} onChange={(e) => (calcF(), setm(parseInt(e.target.value)))}>
        <option value={-1} disabled>
          m
        </option>
        <option value={0}>両面・双碰</option>
        <option value={2}>単騎・篏張・辺張</option>
      </select>
      <select value={a} onChange={(e) => (calcF(), seta(parseInt(e.target.value)))}>
        <option value={-1} disabled>
          a
        </option>
        <option value={0}>数・客風</option>
        <option value={2}>役</option>
      </select>
      <select value={r} onChange={(e) => (calcF(), setr(e.target.value))}>
        <option value="" disabled>
          r
        </option>
        <option value="未">未決定</option>
        <option value="ツモ">ツモ</option>
        <option value="ロン">ロン</option>
      </select>

      <div>{f}</div>
    </main>
  )
}
export default Point
