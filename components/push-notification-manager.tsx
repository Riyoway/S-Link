'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '@/app/actions/push'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    await subscribeUser(sub)
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }

  if (!isSupported) {
    return null; // ブラウザがサポートしていない場合は何も表示しない
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-lg">プッシュ通知設定</h3>
      {subscription ? (
        <div className="space-y-4">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">通知は現在有効です。</p>
          <Button onClick={unsubscribeFromPush} variant="outline" className="w-full sm:w-auto">通知を解除する</Button>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 mb-2">テスト通知を送信確認</p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="メッセージを入力"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button onClick={sendTestNotification}>送信</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">最新の情報を受け取るには通知を許可してください。</p>
          <Button onClick={subscribeToPush} className="w-full sm:w-auto">通知を有効にする</Button>
        </div>
      )}
    </div>
  )
}
