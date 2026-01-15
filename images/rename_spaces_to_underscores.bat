@echo off
cd /d "%~dp0images"

:: Rename folders first (deepest first)
for /f "delims=" %%d in ('dir /ad /b /s ^| sort /R') do (
    set "old=%%~fd"
    set "new=%%~fd"
    setlocal enabledelayedexpansion
    set "new=!old: =_!"
    if /I not "!old!"=="!new!" (
        ren "!old!" "!new!"
    )
    endlocal
)

:: Rename files
for /r %%f in ("* *") do (
    set "old=%%~ff"
    set "new=%%~ff"
    setlocal enabledelayedexpansion
    set "new=!old: =_!"
    if /I not "!old!"=="!new!" (
        ren "!old!" "!new!"
    )
    endlocal
)
echo Rename operation completed.
pause