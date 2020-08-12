[![Run on Repl.it](https://repl.it/badge/github/Leo-768/discord-voice-channel-bot)](https://repl.it/github/Leo-768/discord-voice-channel-bot)

我是一個由Leo_768(#9133)編寫的Discord機器人，用於製造動態語音頻道。
你可以用[這個連結](https://discord.com/api/oauth2/authorize?client_id=742023404575522857&permissions=8&scope=bot)邀請我。

如果我沒有 `管理者` 權限的話我將離開該伺服器。

# 說明
這個機器人將在使用者加入指定語音頻道時在指定類別建立一個專屬於他的頻道，他將有管理該頻道的所有權限，而該頻道也將在裡面的沒有人有 `管理權限` 權限的時候被刪除。

# 指令

* `v!info`
  * 顯示資訊。
* `v!help`
  * 查看所有指令。
* `v!setcat <類別ID>`
  * 設定語音頻道所要生成到的類別，裡面的語音頻道在中斷連線後可能被刪除。
* `v!setcreat <頻道ID>`
  * 設定加入後會生成動態語音頻道的頻道，如果在上述類別中並不會被刪除。
* `v!setname [<名稱>]`
  * 設定生成動態語音頻道的名稱，`$` 會被替換為名字(如未填名稱將重置)。
* `v!reset`
  * 重置設定。