'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from 'src/components/button'

interface Props {}

const Signin = () => {
  const router = useRouter()

  const [err, setErr] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hiddenPass, hidePass] = useState(true)

  const Verify = () => {
    router.push('/email')
  }

  const forgetPassword = () => {}

  return (
    <div className="p-signin">
      <div className="p-signin__content">
        <div className="p-signin__logo">
          {/* <img className='p-signin__logo-img' src='assets/img/remody-05.png' /> */}
        </div>
        <div className="p-signin__content-box">
          <div className="p-signin__sub-title">ログイン</div>
          <span className="p-signin__error">{err}</span>
          <div className="p-signin__box">
            <p className="p-signin__label">メールアドレス</p>
            <input
              placeholder="example@remody.co.jp"
              className="p-signin__input"
              type="text"
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              value={email}
            />
          </div>
          <div className="p-signin__box">
            <p className="p-signin__label">パスワード</p>
            <input
              placeholder="password"
              className="p-signin__input"
              type={hiddenPass ? 'password' : 'text'}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              value={password}
            />
            {/* <img className='p-signin__hidden-img' src='assets/img/hidden-password.png' */}
            {/* onClick={() => { hidePass(!hiddenPass) }} /> */}
            {/* <span className='p-signin__forget'
                        onClick={forgetPassword}>パスワードをお忘れですか？</span> */}
          </div>
          <Button
            addClass="p-signin__submit c-button--blue"
            label="ログイン"
            onClick={() => {
              Verify()
            }}
          />
        </div>
      </div>
      <div className="p-signin__img-box">
        {/* <img className='p-signin__img' src="assets/img/login-image.png" /> */}
      </div>
    </div>
  )
}

export default Signin
