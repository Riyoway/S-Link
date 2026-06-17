"use client"

import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Bell, MessageCircle } from "lucide-react"

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">通知</h3>
        <p className="text-sm text-muted-foreground">
          通知の受け取り方法と内容を設定します。
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">通知チャネル</h4>
        <div className="grid gap-4">
          <div className="flex items-center justify-between space-x-2 border p-3 md:p-4 rounded-lg">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/30">
                 <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Label htmlFor="browser-push" className="flex flex-col space-y-1">
                <span className="text-sm md:text-base">ブラウザ通知 (PWA)</span>
                <span className="font-normal text-xs text-muted-foreground">デバイスへのプッシュ通知</span>
              </Label>
            </div>
            <Checkbox id="browser-push" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between space-x-2 border p-3 md:p-4 rounded-lg">
             <div className="flex items-center gap-3 md:gap-4">
               <div className="bg-green-100 p-2 rounded-full dark:bg-green-900/30">
                 <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
               </div>
              <Label htmlFor="line-notify" className="flex flex-col space-y-1">
                <span className="text-sm md:text-base">LINE連携</span>
                <span className="font-normal text-xs text-muted-foreground">LINEへの通知転送</span>
              </Label>
            </div>
            <Checkbox id="line-notify" />
          </div>
          
           <div className="flex items-center justify-between space-x-2 border p-3 md:p-4 rounded-lg">
             <div className="flex items-center gap-3 md:gap-4">
               <div className="bg-indigo-100 p-2 rounded-full dark:bg-indigo-900/30">
                 <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.1588a18.2532 18.2532 0 00-5.4966 0C9.083 4.0496 8.8493 3.6529 8.6383 3.2917a.076.076 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" /></svg>
               </div>
              <Label htmlFor="discord-notify" className="flex flex-col space-y-1">
                <span className="text-sm md:text-base">Discord連携</span>
                <span className="font-normal text-xs text-muted-foreground">Discordへの通知転送</span>
              </Label>
            </div>
            <Checkbox id="discord-notify" />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">通知内容</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="notify-class" defaultChecked />
            <Label htmlFor="notify-class">授業開始前のお知らせ</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="notify-assignment" defaultChecked />
            <Label htmlFor="notify-assignment">課題期限前のお知らせ</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="notify-bus" defaultChecked />
            <Label htmlFor="notify-bus">バス到着前のお知らせ</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="notify-system" defaultChecked />
            <Label htmlFor="notify-system">システム更新のお知らせ</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
