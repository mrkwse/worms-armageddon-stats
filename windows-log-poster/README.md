# Windows Log Posters 

## Requirements 
You need to download Curl for Windows and put extract it into this folder so that .\curl\bin\curl.exe exists
(https://curl.haxx.se/windows/dl-7.65.3_1/curl-7.65.3_1-win64-mingw.zip)

## Running
Stick this make_logs.bat batch file and the curl directory in your WA reply folder E.g. "C:\GOG Games\Worms Armageddon\User\Games"

Now run make_logs.bat with the first argument the path to WA.exe e.g. "C:\GOG Games\Worms Armageddon\WA.exe"
and the second argument the URL to post logs to e.g. "http://192.168.1.250:3000/upload_log"

## Running automatically
See https://www.computerhope.com/issues/ch000785.htm to setup execution of script automatically each day.