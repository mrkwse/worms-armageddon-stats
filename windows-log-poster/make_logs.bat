@echo off
IF %1.==. GOTO EndBad
set arg1=%1

for %%f in (*.WAgame) do (
	if exist %%~nf.log (
		rem file exists already
	) else (
		echo Processing: %%f
		%arg1% /getlog "%~dp0\%%f" /q
		.\curl\bin\curl.exe -F "logFile=@\"%%~nf.log\"" http://192.168.1.250:3000/upload_log
	)
)

GOTO EndGood

:EndBad
echo Invalid parameter provided
echo Please provide:
echo - the path to WA.exe as first argument e.g. "C:\GOG Games\Worms Armageddon\WA.exe"
echo - the URL to post logs to as second argument e.g. "http://192.168.1.250:3000/upload_log"

:EndGood