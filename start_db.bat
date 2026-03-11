@echo off
echo Starting MongoDB with recovered data...
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "%~dp0migrated_data"
pause
