import { useEffect, useRef, useState } from 'react'
import './App.css'
import { fromEvent, of } from 'rxjs'
import { map, mergeScan, mergeWith } from 'rxjs/operators'

export function Login() {
  const userRef = useRef<HTMLInputElement>(null)
  const pwdRef = useRef<HTMLInputElement>(null)
  let [error, setError] = useState(null)

  useEffect(() => {
    let username$ = fromEvent(userRef.current!, 'input').pipe(
      map((event: any) => ({ username: event.target.value }))
    )
    let password$ = fromEvent(pwdRef.current!, 'input').pipe(
      map((event: any) => ({ password: event.target.value }))
    )
    
    let formData$ = username$.pipe(
      mergeWith(password$),
      mergeScan((acc, curr) => {
        return of({ ...acc, ...curr })
      }, { username: '', password:'' })
    )

    let formValidation$ = formData$.pipe(
      map(({ username, password }) => {
        const usernameRegex = /^[a-zA-Z]+$/
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
        let error = { } as any
        if (username.length <= 0) {
          error['username'] = '用户名不能为空'
        }
        if (password.length <= 0) {
          error['password'] = '密码不能为空'
        }
        if (!usernameRegex.test(username)) {
          error['username'] = '用户名格式错误'
        }
        if (!passwordRegex.test(password)) {
          error['password'] = '密码必须包含大小写字母、数字、特殊字符且长度不小于8位'
        }
        return Object.keys(error).length ? error : null
      }),
    )
    formValidation$.subscribe({
      next: (error) => setError(error),
    })
    formData$.subscribe({
      next: (data) => console.log(data),
    })

  }, [])

  return (
    <>
      <div>
        <input ref={userRef} placeholder='Username'></input>
        <br />
        <input ref={pwdRef} placeholder='Password'></input>
        {
          error && Object.keys(error).map((key) => (
            <div>{key}: {error![key]}</div>
          ))
        }
      </div>
    </>
  )
}
