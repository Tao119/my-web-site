'use client'
import Image from 'next/image'
import { useState } from 'react'
import { BackButton } from 'src/components/backbutton'

const Setting = () => {
  const [menu, setMenu] = useState('')
  return (
    <div className="p-setting">
      <BackButton addClass="p-setting__back-button u-blue u-mb16" />
      <div className="p-setting__title">設定</div>
      <div className="p-setting__main">
        <div className="p-setting-menu">
          <div
            className="p-setting-menu__item"
            onClick={() => {
              setMenu('account')
            }}
          >
            <div className="p-setting-menu__item-label">アカウント</div>
            <div className="p-setting-menu__item-explanation">パスワードの変更などができます</div>
          </div>
          <div
            className="p-setting-menu__item"
            onClick={() => {
              setMenu('admin')
            }}
          >
            <div className="p-setting-menu__item-label">通知</div>
            <div className="p-setting-menu__item-explanation">通知内容や頻度を変更できますv</div>
          </div>
        </div>
        <div className="p-setting-content">{/* 各設定の詳細画面 */}</div>
      </div>
    </div>
  )
}

export default Setting
